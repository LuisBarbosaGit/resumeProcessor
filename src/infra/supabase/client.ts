import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY;

export const supabaseStorage = createClient(supabaseUrl, supabaseKey);
