import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationEmailRequest {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  requests?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, date, time, guests, requests }: ReservationEmailRequest = await req.json();

    console.log("Sending reservation email for:", name);

    // Determine session based on time (morning: 10:00-16:30, evening: 19:30-00:00)
    const hour = parseInt(time.split(':')[0]);
    const session = hour < 17 ? 'morning' : 'evening';

    // Check current capacity for the date and session
    const { data: existingReservations, error: queryError } = await supabase
      .from('reservations')
      .select('guests')
      .eq('date', date)
      .eq('session', session)
      .neq('status', 'cancelled');

    if (queryError) {
      console.error("Error checking capacity:", queryError);
      throw new Error("Error al verificar disponibilidad");
    }

    // Calculate total guests for this session
    const totalGuests = existingReservations?.reduce((sum, res) => sum + res.guests, 0) || 0;
    const requestedGuests = parseInt(guests);

    console.log(`Session: ${session}, Current capacity: ${totalGuests}/30, Requested: ${requestedGuests}`);

    // Check if adding this reservation would exceed capacity
    if (totalGuests + requestedGuests > 30) {
      const availableSpots = 30 - totalGuests;
      return new Response(
        JSON.stringify({ 
          error: `No hay suficiente capacidad. Solo quedan ${availableSpots} plazas disponibles para esta sesión.`,
          availableSpots
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Save reservation to database
    const { data: reservation, error: insertError } = await supabase
      .from('reservations')
      .insert({
        name,
        email,
        phone,
        date,
        time,
        guests: requestedGuests,
        session,
        requests,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving reservation:", insertError);
      throw new Error("Error al guardar la reserva");
    }

    console.log("Reservation saved:", reservation.id);

    // Enviar email al restaurante
    const restaurantEmail = await resend.emails.send({
      from: "Casa de Dosa <reservas@casadedosa.com>",
      to: ["reservas@casadedosa.com"],
      subject: `Nueva Reserva - ${name} (${date} ${time})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            Nueva Reserva Recibida
          </h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0;">Detalles de la Reserva:</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Nombre:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Teléfono:</td>
                <td style="padding: 8px 0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Fecha:</td>
                <td style="padding: 8px 0;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Hora:</td>
                <td style="padding: 8px 0;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Comensales:</td>
                <td style="padding: 8px 0;">${guests} ${guests === "1" ? "persona" : "personas"}</td>
              </tr>
            </table>
            
            ${requests ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <strong>Peticiones Especiales:</strong>
                <p style="margin: 5px 0;">${requests}</p>
              </div>
            ` : ''}
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Este email fue generado automáticamente desde el formulario de reservas de Casa de Dosa.
          </p>
        </div>
      `,
    });

    // Enviar email de confirmación al cliente
    const customerEmail = await resend.emails.send({
      from: "Casa de Dosa <reservas@casadedosa.com>",
      to: [email],
      subject: "Confirmación de Reserva - Casa de Dosa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            ¡Reserva Confirmada!
          </h1>
          
          <p style="font-size: 16px;">Hola ${name},</p>
          
          <p>Gracias por elegir Casa de Dosa. Hemos recibido tu reserva y te contactaremos pronto para confirmar todos los detalles.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0; color: #D4AF37;">Detalles de tu Reserva:</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Fecha:</td>
                <td style="padding: 8px 0;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Hora:</td>
                <td style="padding: 8px 0;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Comensales:</td>
                <td style="padding: 8px 0;">${guests} ${guests === "1" ? "persona" : "personas"}</td>
              </tr>
            </table>
            
            ${requests ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <strong>Tus Peticiones Especiales:</strong>
                <p style="margin: 5px 0;">${requests}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #D4AF37;">
            <h3 style="margin-top: 0;">Política de Reservas</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Las reservas se mantienen 15 minutos</li>
              <li>Cancelaciones con 24h de antelación</li>
              <li>Grupos grandes requieren confirmación</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="margin-top: 0;">Contacto</h3>
            <p style="margin: 5px 0;">📞 983 64 23 92</p>
            <p style="margin: 5px 0;">✉️ reservas@casadedosa.com</p>
          </div>
          
          <p style="margin-top: 30px;">¡Nos vemos pronto en Casa de Dosa!</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            Si no has realizado esta reserva, por favor ignora este email.
          </p>
        </div>
      `,
    });

    console.log("Restaurant email sent:", restaurantEmail);
    console.log("Customer email sent:", customerEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        restaurantEmailId: restaurantEmail.data?.id,
        customerEmailId: customerEmail.data?.id
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reservation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
