import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  // Get the origin from the request or use production URL as fallback
  const origin = req.headers.get("origin") || "https://casadedosa.com";
  
  // Redirect to the React app's cancel page with the token
  const redirectUrl = `${origin}/cancel-reservation?token=${token || ""}`;
  
  return new Response(null, {
    status: 302,
    headers: {
      "Location": redirectUrl,
    },
  });
};

serve(handler);
