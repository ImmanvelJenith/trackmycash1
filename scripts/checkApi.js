import axios from 'axios';
import 'dotenv/config';

const API_BASE = 'https://express-application-b92j.onrender.com';
const EXPENSES_URL = `${API_BASE}/api/expenses`;

const token = process.env.TOKEN;

(async function () {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(EXPENSES_URL, { headers });
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('HTTP Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
})();
