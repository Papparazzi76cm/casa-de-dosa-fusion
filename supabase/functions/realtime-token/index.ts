import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const systemPrompt = `Eres un asistente virtual de Casa de Dosa, un restaurante de fusión única entre la cocina india y castellana en Valladolid, España.

Tu objetivo es ayudar a los clientes a hacer reservas de manera conversacional y amigable.

INFORMACIÓN DEL RESTAURANTE:
- Horarios de comida: 13:30-16:00
- Horarios de cena: 20:00-23:00
- Teléfono: 983 64 23 92
- Dirección: Calle Mantería 18, Valladolid

PROCESO DE RESERVA:
Para completar una reserva necesitas:
1. Nombre completo del cliente
2. Email de contacto
3. Teléfono
4. Fecha de la reserva (no se puede reservar para días pasados)
5. Hora (comida: 13:30-16:00, cena: 20:00-23:00)
6. Número de comensales
7. Peticiones especiales (opcional)

REGLAS IMPORTANTES:
- Sé amable y profesional
- Habla siempre en español
- No aceptes reservas para fechas pasadas
- La sesión de comida es de 13:30 a 16:00
- La sesión de cena es de 20:00 a 23:00
- Si el cliente pide algo fuera de horario, sugiere el horario más cercano
- Si hay algún problema, sugiere llamar al 983 64 23 92

Cuando tengas TODOS los datos de la reserva confirmados, usa la función confirm_reservation para procesarla.`;

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "coral",
        instructions: systemPrompt,
        tools: [
          {
            type: "function",
            name: "confirm_reservation",
            description: "Confirma y procesa una reserva cuando todos los datos están completos",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string", description: "Nombre completo del cliente" },
                email: { type: "string", description: "Email de contacto" },
                phone: { type: "string", description: "Teléfono de contacto" },
                date: { type: "string", description: "Fecha de la reserva en formato YYYY-MM-DD" },
                time: { type: "string", description: "Hora de la reserva (ej: 14:00, 21:00)" },
                guests: { type: "number", description: "Número de comensales" },
                requests: { type: "string", description: "Peticiones especiales (opcional)" }
              },
              required: ["name", "email", "phone", "date", "time", "guests"]
            }
          }
        ],
        input_audio_transcription: {
          model: "whisper-1"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
