import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Bangladesh phone format: 01XXXXXXXXX (11 digits starting with 01)
  const phoneRegex = /^01[3-9]\d{8}$/;
  return phoneRegex.test(phone);
};

const isValidTransactionId = (txId: string): boolean => {
  // Transaction IDs should be alphanumeric, 6-20 characters
  const txRegex = /^[A-Za-z0-9]{6,20}$/;
  return txRegex.test(txId);
};

const isValidPassword = (password: string): boolean => {
  return !!password && password.length >= 6 && password.length <= 100;
};

const sanitizeString = (str: string): string => {
  return str.trim().slice(0, 500);
};

interface OrderItem {
  id: string;
  title: string;
  price: number;
  image?: string;
}

interface OrderRequest {
  customer_name: string;
  customer_email: string;
  customer_password?: string | null;
  customer_phone?: string | null;
  payment_method: string;
  transaction_id: string;
  total_amount: number;
  items: OrderItem[];
  user_id?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

    const body: OrderRequest = await req.json();
    
    // Check if this is a logged-in user purchase
    const isLoggedInPurchase = !!body.user_id;
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!body.customer_name || body.customer_name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    
    if (!body.customer_email || !isValidEmail(body.customer_email)) {
      errors.push("Invalid email format");
    }
    
    // Only validate password and phone for guest users
    if (!isLoggedInPurchase) {
      if (!body.customer_password || !isValidPassword(body.customer_password)) {
        errors.push("Password must be 6-100 characters");
      }
      
      if (!body.customer_phone || !isValidPhone(body.customer_phone)) {
        errors.push("Invalid phone format (use 01XXXXXXXXX)");
      }
    }
    
    if (!body.transaction_id || !isValidTransactionId(body.transaction_id)) {
      errors.push("Invalid transaction ID (6-20 alphanumeric characters)");
    }
    
    if (!body.payment_method || !["বিকাশ", "নগদ", "রকেট"].includes(body.payment_method)) {
      errors.push("Invalid payment method");
    }
    
    if (!body.total_amount || body.total_amount <= 0) {
      errors.push("Invalid total amount");
    }
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      errors.push("Order must contain at least one item");
    }
    
    // Validate items
    if (body.items) {
      for (const item of body.items) {
        if (!item.id || !item.title || typeof item.price !== "number" || item.price <= 0) {
          errors.push("Invalid item data");
          break;
        }
      }
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerEmail = body.customer_email.trim().toLowerCase();
    
    let userId: string;
    
    if (isLoggedInPurchase) {
      // Use the provided user_id for logged-in users
      userId = body.user_id!;
      console.log("Logged-in user purchase:", userId);
    } else {
      // Check if user already exists for guest checkout
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === customerEmail);
      
      if (existingUser) {
        // User exists, use their ID
        userId = existingUser.id;
        console.log("Existing user found:", userId);
      } else {
        // Create new user account
        const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: body.customer_password!,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: body.customer_name.trim(),
            phone: body.customer_phone?.trim(),
          },
        });

        if (signUpError) {
          console.error("User creation error:", signUpError);
          return new Response(JSON.stringify({ error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। দয়া করে অন্য ইমেইল ব্যবহার করুন।" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        userId = newUser.user.id;
        console.log("New user created:", userId);
      }
    }

    // Generate order number
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const orderNumber = `ORD-${dateStr}-${random}`;

    // Sanitize inputs
    const sanitizedData = {
      order_number: orderNumber,
      customer_name: sanitizeString(body.customer_name),
      customer_email: customerEmail,
      customer_phone: body.customer_phone?.trim() || '',
      payment_method: body.payment_method,
      transaction_id: body.transaction_id.trim().toUpperCase(),
      status: 'পেন্ডিং',
      total_amount: Math.round(body.total_amount),
      items: body.items.map(item => ({
        id: String(item.id).slice(0, 100),
        title: sanitizeString(item.title),
        price: Math.round(item.price),
        image: item.image ? sanitizeString(item.image) : undefined,
      })),
    };

    console.log("Creating order:", orderNumber);

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Order created successfully:", orderNumber);
    
    return new Response(
      JSON.stringify({ success: true, order_number: orderNumber, user_id: userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
