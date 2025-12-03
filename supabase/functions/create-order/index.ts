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
  customer_phone: string;
  payment_method: string;
  transaction_id: string;
  total_amount: number;
  items: OrderItem[];
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
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!body.customer_name || body.customer_name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    
    if (!body.customer_email || !isValidEmail(body.customer_email)) {
      errors.push("Invalid email format");
    }
    
    if (!body.customer_phone || !isValidPhone(body.customer_phone)) {
      errors.push("Invalid phone format (use 01XXXXXXXXX)");
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

    // Generate order number
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const orderNumber = `ORD-${dateStr}-${random}`;

    // Sanitize inputs
    const sanitizedData = {
      order_number: orderNumber,
      customer_name: sanitizeString(body.customer_name),
      customer_email: body.customer_email.trim().toLowerCase().slice(0, 255),
      customer_phone: body.customer_phone.trim(),
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
      JSON.stringify({ success: true, order_number: orderNumber }),
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
