import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const reservationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{9,20}$/, "Invalid phone format"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  guests: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1 && num <= 30;
  }, "Guests must be between 1 and 30"),
  requests: z.string().max(500, "Special requests too long").optional()
});

type ReservationEmailRequest = z.infer<typeof reservationSchema>;

// Helper function to check if a slot is blocked
const isSlotBlocked = async (date: string, session: 'morning' | 'evening'): Promise<boolean> => {
  // Sundays evening are always blocked
  const checkDate = new Date(date + 'T00:00:00'); // Use T00:00:00 to avoid timezone issues with getDay()
  if (checkDate.getDay() === 0 && session === 'evening') {
    return true;
  }

  // Check the blocked_slots table
  const { data, error } = await supabase
    .from('blocked_slots')
    .select('id')
    .eq('date', date)
    .eq('session', session)
    .maybeSingle(); // Use maybeSingle to handle null result without error

  if (error) {
    console.error("Error checking blocked slots:", error);
    throw new Error("Unable to verify slot availability");
  }

  return data !== null; // If data is not null, the slot exists, hence it's blocked
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input data
    const validationResult = reservationSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid reservation data",
          details: validationResult.error.errors.map(e => e.message)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const { name, email, phone, date, time, guests, requests } = validationResult.data;

    console.log("Processing reservation request for:", name, date, time);

    // Determine session based on time (morning: 10:00-16:30, evening: 19:30-00:00)
    const hour = parseInt(time.split(':')[0]);
    const session = hour < 17 ? 'morning' : 'evening';

    // *** Check if the slot is blocked ***
    const blocked = await isSlotBlocked(date, session);
    if (blocked) {
      console.log(`Reservation attempt blocked for ${date} ${session}`);
      return new Response(
        JSON.stringify({
          error: `Lo sentimos, la sesión ${session === 'morning' ? 'de mañana' : 'de tarde'} del ${date} está completamente bloqueada y no acepta reservas.`,
          blocked: true
        }),
        {
          status: 400, // Bad Request or 409 Conflict might also be suitable
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // *** End of block check ***

    // Check current capacity for the date and session
    const { data: existingReservations, error: queryError } = await supabase
      .from('reservations')
      .select('guests')
      .eq('date', date)
      .eq('session', session)
      .neq('status', 'cancelled');

    if (queryError) {
      console.error("Error checking capacity:", queryError);
      throw new Error("Unable to verify availability");
    }

    // Calculate total guests for this session
    const totalGuests = existingReservations?.reduce((sum, res) => sum + res.guests, 0) || 0;
    const requestedGuests = parseInt(guests);
    const capacity = 30; // Define capacity

    console.log(`Session: ${session}, Current capacity: ${totalGuests}/${capacity}, Requested: ${requestedGuests}`);

    // Check if adding this reservation would exceed capacity
    if (totalGuests + requestedGuests > capacity) {
      const availableSpots = capacity - totalGuests;
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
        status: 'pending' // Default status
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving reservation:", insertError);
      throw new Error("Error al guardar la reserva");
    }

    console.log("Reservation saved:", reservation.id);

    // Generate secure token for cancellation/editing (valid for 7 days)
    const editToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    console.log("Updating reservation with token:", reservation.id);

    // Update reservation with token
    const { data: updatedData, error: updateError } = await supabase
      .from('reservations')
      .update({
        edit_token: editToken,
        token_expires_at: tokenExpiresAt.toISOString()
      })
      .eq('id', reservation.id)
      .select(); // Re-select updated data if needed

    if (updateError) {
      console.error("Error updating token:", updateError);
      // Optional: Attempt to delete the reservation if token update fails? Or just log?
      throw new Error("Error al actualizar el token de reserva");
    }

    console.log("Token updated successfully for reservation:", reservation.id);

    // Create action URLs
    const functionHost = Deno.env.get("SUPABASE_URL")?.replace('/rest/v1', '') || ''; // Get base URL correctly
    const cancelUrl = `${functionHost}/functions/v1/cancel-reservation?token=${editToken}`;

    // Enviar email al restaurante
    const restaurantEmail = await resend.emails.send({
      from: "Casa de Dosa <reservas@casadedosa.com>",
      to: ["reservas@casadedosa.com"], // Send to restaurant
      subject: `Nueva Reserva - ${name} (${date} ${time})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            Nueva Reserva Recibida
          </h1>
          <p>Se ha registrado una nueva reserva:</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0;">Detalles:</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p><strong>Comensales:</strong> ${guests}</p>
            ${requests ? `<p><strong>Peticiones:</strong> ${requests}</p>` : ''}
          </div>
        </div>
      `,
    });

    // Enviar email de confirmación al cliente
    const customerEmail = await resend.emails.send({
      from: "Casa de Dosa <reservas@casadedosa.com>",
      to: [email], // Send to customer
      subject: "Confirmación de Reserva - Casa de Dosa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            ¡Reserva Recibida!
          </h1>
          <p>Hola ${name},</p>
          <p>Hemos recibido tu solicitud de reserva en Casa de Dosa. Nos pondremos en contacto contigo pronto para confirmarla.</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0; color: #D4AF37;">Detalles de tu Solicitud:</h2>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p><strong>Comensales:</strong> ${guests}</p>
            ${requests ? `<p><strong>Peticiones:</strong> ${requests}</p>` : ''}
          </div>
          <div style="background-color: #e8f4f8; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
            <h3 style="margin-top: 0;">¿Necesitas cancelar?</h3>
            <p>Si necesitas cancelar tu reserva, puedes hacerlo usando el siguiente enlace (válido por 7 días):</p>
            <p><a href="${cancelUrl}" style="color: #ef4444; font-weight: bold;">Cancelar Reserva</a></p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">Para modificar tu reserva, por favor contacta con nosotros al 983 64 23 92</p>
          </div>
          <p>¡Esperamos verte pronto!</p>
        </div>
      `,
    });

    console.log("Emails sent - Restaurant:", restaurantEmail.data?.id, "Customer:", customerEmail.data?.id);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reservation-email function:", error);
    // Provide more specific error messages if possible
    let errorMessage = "Error al procesar la reserva.";
    if (error.message.includes('No hay suficiente capacidad')) {
      errorMessage = error.message;
    } else if (error.message.includes('bloqueada')) {
        errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: error.message.includes('capacidad') || error.message.includes('bloqueada') ? 400 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
