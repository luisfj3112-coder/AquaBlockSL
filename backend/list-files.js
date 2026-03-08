const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)) {
    console.log('Uploads directory does not exist');
} else {
    const files = fs.readdirSync(dir);
    console.log('--- Files in uploads/ ---');
    files.forEach(f => {
        console.log(`"${f}" | Hex: ${Buffer.from(f).toString('hex')}`);
    });
}
