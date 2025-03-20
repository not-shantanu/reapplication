const https = require('https');

const options = {
  hostname: 'qfemixdottfdgkuhacys.supabase.co',
  path: '/rest/v1/verification_pending?select=*',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZW1peGRvdHRmZGdrdWhhY3lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTYzMjk3MCwiZXhwIjoyMDI1MjA4OTcwfQ.Pu_qDR4BH7lkx5uw4WU0-QYKKTr0DhOhm0-0URl2LyM',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZW1peGRvdHRmZGdrdWhhY3lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTYzMjk3MCwiZXhwIjoyMDI1MjA4OTcwfQ.Pu_qDR4BH7lkx5uw4WU0-QYKKTr0DhOhm0-0URl2LyM',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  }
};

console.log('Checking Supabase connection to verification_pending table...');

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end(); 