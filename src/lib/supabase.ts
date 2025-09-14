import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ymxaggixvsspegttixoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteGFnZ2l4dnNzcGVndHRpeG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjgxMzEsImV4cCI6MjA3MzQ0NDEzMX0.ZlaNkKac6r29A3wNn70oOMICNWuPHoEt2S75GfbTORE';

export const supabase = createClient(supabaseUrl, supabaseKey);
