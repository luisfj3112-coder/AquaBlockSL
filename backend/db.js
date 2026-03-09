require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://zihdvtkxlufsnzteuhhi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaGR2dGt4bHVmc256dGV1aGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTEwMjYsImV4cCI6MjA4ODU4NzAyNn0.zbjg-RZy1qJZ-S0cuVLYOlBewsI1lZUiCVNf93CE8B4';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
