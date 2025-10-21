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

  // Handle GET request - show edit form
  if (req.method === "GET") {
    if (!token) {
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
            <h1 class="error">❌ Token inválido</h1>
            <p>El enlace de edición no es válido.</p>
          </body>
        </html>
        `,
        { 
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }
      );
    }

    try {
      // Find reservation by token
      const { data: reservation, error: findError } = await supabase
        .from('reservations')
        .select('*')
        .eq('edit_token', token)
        .single();

      if (findError || !reservation) {
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
              <h1 class="error">❌ Reserva no encontrada</h1>
              <p>No se pudo encontrar la reserva asociada a este enlace.</p>
            </body>
          </html>
          `,
          { 
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }

      // Check if token has expired
      const expiresAt = new Date(reservation.token_expires_at);
      if (expiresAt < new Date()) {
        return new Response(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Token Expirado - Casa de Dosa</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .warning { color: #f59e0b; }
                .info { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1 class="warning">⏱️ Enlace expirado</h1>
              <p>El enlace de edición ha expirado (válido solo 60 minutos).</p>
              <div class="info">
                <p>Para modificar tu reserva, por favor contacta con nosotros:</p>
                <p>📞 983 64 23 92</p>
                <p>✉️ reservas@casadedosa.com</p>
              </div>
            </body>
          </html>
          `,
          { 
            status: 410,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }

      // Check if cancelled
      if (reservation.status === 'cancelled') {
        return new Response(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Reserva Cancelada - Casa de Dosa</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                .info { color: #6b7280; }
              </style>
            </head>
            <body>
              <h1 class="info">ℹ️ Reserva cancelada</h1>
              <p>Esta reserva ya fue cancelada y no puede ser editada.</p>
            </body>
          </html>
          `,
          { 
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }

      // Show edit form
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editar Reserva - Casa de Dosa</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px; 
                background-color: #f9fafb;
              }
              .container {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #D4AF37; margin-bottom: 10px; }
              .form-group { margin-bottom: 20px; }
              label { display: block; font-weight: bold; margin-bottom: 5px; color: #374151; }
              input, select, textarea { 
                width: 100%; 
                padding: 10px; 
                border: 1px solid #d1d5db; 
                border-radius: 6px; 
                font-size: 14px;
                box-sizing: border-box;
              }
              button { 
                width: 100%; 
                padding: 12px; 
                background-color: #D4AF37; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                font-size: 16px; 
                font-weight: bold;
                cursor: pointer;
              }
              button:hover { opacity: 0.9; }
              .current { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              .expires { color: #ef4444; font-size: 12px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✏️ Editar Reserva</h1>
              <p>Modifica los detalles de tu reserva</p>
              
              <div class="current">
                <strong>Reserva actual:</strong><br>
                Fecha: ${reservation.date} | Hora: ${reservation.time} | Comensales: ${reservation.guests}
              </div>

              <form id="editForm">
                <input type="hidden" name="token" value="${token}">
                
                <div class="form-group">
                  <label for="date">Fecha *</label>
                  <input type="date" id="date" name="date" value="${reservation.date}" required min="${new Date().toISOString().split('T')[0]}">
                </div>

                <div class="form-group">
                  <label for="time">Hora *</label>
                  <select id="time" name="time" required>
                    ${['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30']
                      .map(t => `<option value="${t}" ${t === reservation.time ? 'selected' : ''}>${t}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group">
                  <label for="guests">Comensales *</label>
                  <select id="guests" name="guests" required>
                    ${[1,2,3,4,5,6,7,8,9,10].map(n => 
                      `<option value="${n}" ${n === reservation.guests ? 'selected' : ''}>${n} ${n === 1 ? 'persona' : 'personas'}</option>`
                    ).join('')}
                  </select>
                </div>

                <div class="form-group">
                  <label for="requests">Peticiones Especiales</label>
                  <textarea id="requests" name="requests" rows="3">${reservation.requests || ''}</textarea>
                </div>

                <button type="submit">Guardar Cambios</button>
                <p class="expires">Este enlace expira el ${expiresAt.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
              </form>
            </div>

            <script>
              document.getElementById('editForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                
                try {
                  const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  
                  const result = await response.text();
                  document.body.innerHTML = result;
                } catch (error) {
                  alert('Error al actualizar la reserva');
                }
              });
            </script>
          </body>
        </html>
        `,
        { 
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }
      );
    } catch (error: any) {
      console.error("Error loading edit form:", error);
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
            <p>Hubo un error al cargar el formulario de edición.</p>
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

  // Handle POST request - save changes
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
