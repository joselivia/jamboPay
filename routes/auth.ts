import express, { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';

const router = express.Router();

let accessToken: string | null = null; 
let tokenExpiry: number | null = null; 

router.post('/token', async (req: Request, res: Response) => {
    const { CLIENT_ID, CLIENT_SECRET, TOKEN_URL } = process.env;

    try {
        const requestBody = qs.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials',
        });

        const response = await axios.post(TOKEN_URL!, requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

             accessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000); 

        console.log('Access Token:', accessToken);
        res.json({ accessToken, expires_in: response.data.expires_in });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            res.status(500).json({ error: error.response?.data || 'Error fetching access token' });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});
export const getAccessToken = async () => {
    if (!accessToken || (tokenExpiry && Date.now() >= tokenExpiry)) {
        console.log('Token expired or not available, fetching a new one...');
           const tokenResponse = await axios.post('http://localhost:3000/token');
        accessToken = tokenResponse.data.accessToken;
        tokenExpiry = Date.now() + (tokenResponse.data.expires_in * 1000);
    }
    return accessToken;
};

export default router;
