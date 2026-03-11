require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL || 'https://zihdvtkxlufsnzteuhhi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_UAaDzbPUJxgAE_Gu9F8rpQ_LTd2EPEP';

console.log('=== DIAGNÓSTICO DE SUPABASE ===');
console.log('URL:', supabaseUrl);
console.log('Key (primeros 20 chars):', supabaseKey.substring(0, 20) + '...');
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    // Test 1: Conexión básica
    console.log('--- Test 1: Conexión con Supabase ---');
    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
        console.log('❌ ERROR al consultar usuarios:', error.message);
        console.log('   Código:', error.code);
        console.log('   Detalles:', JSON.stringify(error));
        return;
    }

    if (!users || users.length === 0) {
        console.log('❌ La tabla users está VACÍA o RLS sigue bloqueando.');
        console.log('   Datos recibidos:', users);
        return;
    }

    console.log('✅ Conexión OK. Usuarios encontrados:', users.length);
    users.forEach(u => {
        console.log(`   - ${u.username} (hash empieza por: ${u.password_hash.substring(0, 10)}...)`);
    });

    // Test 2: Verificar contraseña
    console.log('');
    console.log('--- Test 2: Verificar contraseña de LuisR ---');
    const luisR = users.find(u => u.username === 'LuisR');
    if (!luisR) {
        console.log('❌ Usuario LuisR no encontrado en la base de datos.');
        return;
    }

    const match = await bcrypt.compare('aquablocksl', luisR.password_hash);
    console.log(`   Contraseña "aquablocksl" coincide: ${match ? '✅ SÍ' : '❌ NO'}`);

    if (!match) {
        console.log('   El hash guardado es INVÁLIDO. Necesitamos regenerarlo.');
        const newHash = await bcrypt.hash('aquablocksl', 10);
        console.log('   Nuevo hash correcto:', newHash);
    }

    console.log('');
    console.log('=== FIN DEL DIAGNÓSTICO ===');
}

test().catch(err => console.error('Error fatal:', err));
