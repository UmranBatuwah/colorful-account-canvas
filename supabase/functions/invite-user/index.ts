
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { email, firstName, lastName, role } = await req.json() as InviteUserRequest;

    if (!email || !firstName || !lastName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a random password (user will change this later)
    const tempPassword = Math.random().toString(36).slice(2, 10) + 
                         Math.random().toString(36).slice(2, 10).toUpperCase() + 
                         "!1";

    // 1. Create the user account
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Skip email verification
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: role
      }
    });

    if (createUserError) {
      throw createUserError;
    }

    // 2. Send invitation email with magic link
    // In a real application, you would use a proper email service like Resend or SendGrid
    // For now, we'll just log the info for demonstration purposes
    console.log(`
      Invitation email would be sent to: ${email}
      Subject: You've been invited to FinTrackr
      Message: 
      Hello ${firstName},

      You've been invited to join FinTrackr with the role: ${role}.
      Your temporary password is: ${tempPassword}
      Please log in and change your password.

      Click here to log in: [Login Link]
    `);

    return new Response(
      JSON.stringify({ 
        message: "Invitation sent successfully",
        userId: userData.user.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing invitation:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process invitation" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
