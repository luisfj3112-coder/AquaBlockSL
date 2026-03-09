require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://zihdvtkxlufsnzteuhhi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_UAaDzbPUJxgAE_Gu9F8rpQ_LTd2EPEP';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
