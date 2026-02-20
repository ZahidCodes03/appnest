import axios from 'axios';

async function verifyLogin() {
    const url = 'http://localhost:5000/api/auth/login';
    const credentials = {
        email: 'admin@appnest.in',
        password: 'Admin@123'
    };

    console.log(`Connecting to ${url}...`);
    try {
        const response = await axios.post(url, credentials);
        console.log('✅ Login successful!');
        console.log('Response status:', response.status);
        console.log('User role:', response.data.user.role);
    } catch (error) {
        if (error.response) {
            console.error('❌ Login failed with status:', error.response.status);
            console.error('Error data:', error.response.data);
        } else {
            console.error('❌ Error connecting to server:', error.message);
        }
    }
}

verifyLogin();
