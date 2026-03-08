const axios = require('axios');

const testPut = async () => {
    try {
        const payload = {
            name: 'Lina Ruiz',
            items: [
                { description: 'Test Item 1', price: 100 },
                { description: 'Test Item 2', price: 200 }
            ],
            amount: 363, // (100+200) * 1.21
            stage: 'Sin presupuesto'
        };
        const res = await axios.put('http://localhost:5000/api/clients/1', payload);
        console.log('PUT Response:', res.status, res.data);
    } catch (err) {
        console.error('PUT Error:', err.response ? err.response.data : err.message);
    }
};

testPut();
