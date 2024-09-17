import express, { Request, Response } from 'express';
import axios from 'axios';
import { getAccessToken } from '../routes/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const BASE_URL = 'https://api-sandbox.jambopay.com'; 

router.post('/paytv-biller', async (req: Request, res: Response) => {
    const { accountNo, billerName, callbackUrl, item } = req.body;

    const orderId = uuidv4();

    if (!accountNo || !billerName || !callbackUrl || !item || 
        !item.amount || !item.phoneNumber || !item.accountNumber || !item.provider) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

      const requestBody = {
        orderId,
        accountNo,
        billerName,
        callbackUrl,
        item
    };
    try {
        const token = await getAccessToken(); 
        const response = await axios.post(
            `${BASE_URL}/biller`, 
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', 
                },
            }
        );

        res.status(201).json(response.data);
    } catch (error: any) {
        if (error.response) {
                     res.status(error.response.status).json({
       
                details: error.response.data,
            });
        } else {
                 res.status(500).json({
                       details: error.message,
            });
        }
    }
});

export default router;
