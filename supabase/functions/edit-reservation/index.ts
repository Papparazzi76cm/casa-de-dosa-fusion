import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  // Get the origin from the request or use production URL as fallback
  const origin = req.headers.get("origin") || req.headers.get("referer")?.split("/")[0] + "//" + req.headers.get("referer")?.split("/")[2] || "https://casadedosa.com";
  
  // Handle GET request - redirect to React app
  if (req.method === "GET") {
    const redirectUrl = `${origin}/edit-reservation?token=${token || ""}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        "Location": redirectUrl,
      },
    });
  }

  // Handle POST request - save changes from React app (kept for backward compatibility if needed)
  if (req.method === "POST") {
    try {
      const { token, date, time, guests, requests } = await req.json();

      if (!token) {
        throw new Error("Token missing");
      }

      // Find reservation
      const { data: reservation, error: findError } = await supabase
        .from('reservations')
        .select('*')
        .eq('edit_token', token)
        .single();

      if (findError || !reservation) {
        throw new Error("Reservation not found");
      }

      // Check token expiry
      const expiresAt = new Date(reservation.token_expires_at);
      if (expiresAt < new Date()) {
        throw new Error("Token expired");
      }

      // Determine session
      const hour = parseInt(time.split(':')[0]);
      const session = hour < 17 ? 'morning' : 'evening';

      // Check capacity for new date/session
      const { data: existingReservations, error: queryError } = await supabase
        .from('reservations')
        .select('guests')
        .eq('date', date)
        .eq('session', session)
        .neq('status', 'cancelled')
        .neq('id', reservation.id); // Exclude current reservation

      if (queryError) throw queryError;

      const totalGuests = existingReservations?.reduce((sum, r) => sum + r.guests, 0) || 0;
      const requestedGuests = parseInt(guests);

      if (totalGuests + requestedGuests > 30) {
        const availableSpots = 30 - totalGuests;
        return new Response(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Error - Casa de Dosa</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .error { color: #ef4444; }
              </style>
            </head>
            <body>
              <h1 class="error">❌ No hay suficiente capacidad</h1>
              <p>Solo quedan ${availableSpots} plazas disponibles para esa fecha y sesión.</p>
              <button onclick="history.back()">Volver</button>
            </body>
          </html>
          `,
          { 
            status: 400,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }

      // Update reservation
      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          date,
          time,
          guests: requestedGuests,
          session,
          requests: requests || null
        })
        .eq('id', reservation.id);

      if (updateError) throw updateError;

      // Send confirmation email
      await resend.emails.send({
        from: "Casa de Dosa <reservas@casadedosa.com>",
        to: [reservation.email],
        subject: "Reserva Modificada - Casa de Dosa",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
              Reserva Modificada
            </h1>
            
            <p style="font-size: 16px;">Hola ${reservation.name},</p>
            
            <p>Tu reserva en Casa de Dosa ha sido modificada exitosamente.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h2 style="margin-top: 0; color: #D4AF37;">Nuevos Detalles:</h2>
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
              <p><strong>Comensales:</strong> ${guests}</p>
              ${requests ? `<p><strong>Peticiones:</strong> ${requests}</p>` : ''}
            </div>
            
            <p>¡Nos vemos pronto en Casa de Dosa!</p>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
              <h3 style="margin-top: 0;">Contacto</h3>
              <p style="margin: 5px 0;">📞 983 64 23 92</p>
              <p style="margin: 5px 0;">✉️ reservas@casadedosa.com</p>
            </div>
          </div>
        `,
      });

      console.log("Reservation updated:", reservation.id);

      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Reserva Actualizada - Casa de Dosa</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              .success { color: #10b981; }
              .details { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; }
            </style>
          </head>
          <body>
            <h1 class="success">✅ Reserva Actualizada</h1>
            <p>Tu reserva ha sido modificada exitosamente.</p>
            
            <div class="details">
              <h3>Nuevos detalles:</h3>
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
              <p><strong>Comensales:</strong> ${guests}</p>
              ${requests ? `<p><strong>Peticiones:</strong> ${requests}</p>` : ''}
            </div>
            
            <p>Hemos enviado un email de confirmación con los nuevos detalles.</p>
            <p>¡Nos vemos pronto en Casa de Dosa!</p>
          </body>
        </html>
        `,
        { 
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }
      );
    } catch (error: any) {
      console.error("Error updating reservation:", error);
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Error - Casa de Dosa</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              .error { color: #ef4444; }
            </style>
          </head>
          <body>
            <h1 class="error">❌ Error</h1>
            <p>Hubo un error al actualizar la reserva.</p>
            <p>${error.message}</p>
          </body>
        </html>
        `,
        {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

serve(handler);
