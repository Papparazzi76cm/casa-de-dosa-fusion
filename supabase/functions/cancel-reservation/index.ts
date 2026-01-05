import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Token validation schema
const tokenSchema = z.string().uuid("Invalid token format");

// Helper function to generate error HTML
const getErrorHtml = (message: string): string => `
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
    <p>${message}</p>
  </body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  
  // Validate token format
  const tokenValidation = tokenSchema.safeParse(token);
  if (!tokenValidation.success) {
    return new Response(
      getErrorHtml("Enlace de cancelación inválido. Por favor, use el enlace de su email de confirmación."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }
  
  const validToken = tokenValidation.data;

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
          <p>El enlace de cancelación no es válido.</p>
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
            <p>El enlace de cancelación ha expirado (válido por 7 días).</p>
            <div class="info">
              <p>Para cancelar tu reserva, por favor contacta con nosotros:</p>
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

    // Check if already cancelled
    if (reservation.status === 'cancelled') {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Ya Cancelada - Casa de Dosa</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              .info { color: #6b7280; }
            </style>
          </head>
          <body>
            <h1 class="info">ℹ️ Reserva ya cancelada</h1>
            <p>Esta reserva ya fue cancelada anteriormente.</p>
          </body>
        </html>
        `,
        { 
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }
      );
    }

    // Cancel the reservation and invalidate token to prevent reuse
    const { error: cancelError } = await supabase
      .from('reservations')
      .update({ 
        status: 'cancelled',
        edit_token: null,
        token_expires_at: null
      })
      .eq('id', reservation.id);

    if (cancelError) {
      console.error("Error cancelling reservation:", cancelError);
      throw cancelError;
    }

    // Send cancellation confirmation email
    await resend.emails.send({
      from: "Casa de Dosa <reservas@casadedosa.com>",
      to: [reservation.email],
      subject: "Reserva Cancelada - Casa de Dosa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
            Reserva Cancelada
          </h1>
          
          <p style="font-size: 16px;">Hola ${reservation.name},</p>
          
          <p>Tu reserva en Casa de Dosa ha sido cancelada exitosamente.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin-top: 0;">Detalles de la reserva cancelada:</h2>
            <p><strong>Fecha:</strong> ${reservation.date}</p>
            <p><strong>Hora:</strong> ${reservation.time}</p>
            <p><strong>Comensales:</strong> ${reservation.guests}</p>
          </div>
          
          <p>Esperamos verte pronto en Casa de Dosa. Puedes hacer una nueva reserva cuando quieras.</p>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="margin-top: 0;">Contacto</h3>
            <p style="margin: 5px 0;">📞 983 64 23 92</p>
            <p style="margin: 5px 0;">✉️ reservas@casadedosa.com</p>
          </div>
        </div>
      `,
    });

    console.log("Reservation cancelled:", reservation.id);

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reserva Cancelada - Casa de Dosa</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .success { color: #10b981; }
            .details { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; }
            .contact { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Reserva Cancelada</h1>
          <p>Tu reserva ha sido cancelada exitosamente.</p>
          
          <div class="details">
            <h3>Detalles de la reserva:</h3>
            <p><strong>Nombre:</strong> ${reservation.name}</p>
            <p><strong>Fecha:</strong> ${reservation.date}</p>
            <p><strong>Hora:</strong> ${reservation.time}</p>
            <p><strong>Comensales:</strong> ${reservation.guests}</p>
          </div>
          
          <p>Hemos enviado un email de confirmación de cancelación.</p>
          
          <div class="contact">
            <h3>¿Deseas hacer una nueva reserva?</h3>
            <p>📞 983 64 23 92</p>
            <p>✉️ reservas@casadedosa.com</p>
            <p style="margin-top: 15px;">
              <a href="https://casadedosa.com/reservas" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: white; text-decoration: none; border-radius: 5px;">
                Nueva Reserva
              </a>
            </p>
          </div>
        </body>
      </html>
      `,
      { 
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  } catch (error: any) {
    console.error("Error in cancel-reservation function:", error);
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
          <p>Hubo un error al procesar la cancelación.</p>
          <p>Por favor, contacta con nosotros: 983 64 23 92</p>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  }
};

serve(handler);
