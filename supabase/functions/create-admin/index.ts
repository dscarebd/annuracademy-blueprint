import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const email = "abdullah@annuracademy.com";
    const password = "Moreom@001";

    // Create user using admin API
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // User might already exist
      if (createError.message.includes("already been registered")) {
        // Get existing user
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users?.users?.find((u) => u.email === email);
        
        if (existingUser) {
          // Add admin role
          const { error: roleError } = await supabaseAdmin
            .from("user_roles")
            .upsert({ user_id: existingUser.id, role: "admin" }, { onConflict: "user_id,role" });

          if (roleError) {
            console.error("Role error:", roleError);
            return new Response(JSON.stringify({ error: roleError.message }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({ success: true, message: "Admin role added to existing user" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      console.error("Create error:", createError);
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add admin role for new user
    if (userData?.user) {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userData.user.id, role: "admin" });

      if (roleError) {
        console.error("Role insert error:", roleError);
      }
    }

    console.log("Admin user created successfully");
    return new Response(
      JSON.stringify({ success: true, message: "Admin user created successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
