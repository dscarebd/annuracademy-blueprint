import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে")
    .max(100, "নাম ১০০ অক্ষরের বেশি হতে পারবে না"),
  email: z
    .string()
    .trim()
    .email("সঠিক ইমেইল দিন")
    .max(255, "ইমেইল ২৫৫ অক্ষরের বেশি হতে পারবে না"),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
    .max(100, "পাসওয়ার্ড ১০০ অক্ষরের বেশি হতে পারবে না"),
  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)"),
  transactionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,20}$/, "সঠিক Transaction ID দিন (৬-২০ অক্ষর)"),
});

// Schema for logged-in users (no password required)
export const loggedInCheckoutFormSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,20}$/, "সঠিক Transaction ID দিন (৬-২০ অক্ষর)"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type LoggedInCheckoutFormData = z.infer<typeof loggedInCheckoutFormSchema>;
