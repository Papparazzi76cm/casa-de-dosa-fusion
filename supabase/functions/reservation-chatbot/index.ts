import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Eres el asistente virtual de Casa de Dosa, un restaurante de fusión indo-española en Valladolid. Tu misión es ayudar a los clientes a hacer reservas de manera amigable y eficiente.

INFORMACIÓN DEL RESTAURANTE:
- Nombre: Casa de Dosa
- Dirección: C/ Torrecilla 6, 47003 Valladolid
- Teléfono: 983 64 23 92
- Horarios: 
  * Mediodía: 13:30 - 16:00 (últimas reservas 15:30)
  * Noche: 20:30 - 23:30 (últimas reservas 23:00)
  * Domingos solo mediodía
- Capacidad: 30 comensales por turno

PROCESO DE RESERVA:
Necesitas recopilar estos datos del cliente:
1. Nombre completo
2. Email
3. Teléfono
4. Fecha de la reserva
5. Hora (mediodía o noche)
6. Número de personas (máximo 30)
7. Peticiones especiales (opcional)

REGLAS IMPORTANTES:
- Los domingos por la noche NO hay servicio
- Sé amable, cálido y profesional
- Cuando tengas TODOS los datos necesarios, confirma con el cliente antes de procesar
- Si el cliente confirma, responde con el JSON de reserva en formato especial

FORMATO DE RESPUESTA PARA RESERVA CONFIRMADA:
Cuando el cliente confirme todos los datos, responde EXACTAMENTE así (sin texto adicional antes o después):
###RESERVA_JSON###
{
  "name": "nombre del cliente",
  "email": "email@ejemplo.com",
  "phone": "teléfono",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "guests": número,
  "requests": "peticiones especiales o vacío"
}
###FIN_RESERVA###

Si aún falta información o el cliente no ha confirmado, responde de forma conversacional normal.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chatbot request with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Por favor, espera un momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Servicio temporalmente no disponible." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Error del servicio de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
