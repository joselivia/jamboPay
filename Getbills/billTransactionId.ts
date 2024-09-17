import express, { Request, Response } from 'express';
import axios from 'axios';
import { getAccessToken } from '../routes/auth'; 

const router = express.Router();
const BASE_URL = 'https://api-sandbox.jambopay.com'; 

router.get('/bill-transaction/:id/transactions', async (req: Request, res: Response) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ error: 'Bill ID is required' });
    }

    try {
        const token = await getAccessToken();
        
        const response = await axios.get(
            `${BASE_URL}/universal-bill/bill/${id}/transactions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

              res.status(200).json(response.data);
    } catch (error: any) {
        if (error.response) {
            console.error('API Error:', error.response.data); 
            res.status(error.response.status).json({
                error: 'Failed to get bill transaction details',
                details: error.response.data,
            });
        } else {
            console.error('Error getting bill transaction details:', error.message);
            res.status(500).json({
                error: 'Failed to get bill transaction details',
                details: error.message,
            });
        }
    }
});

export default router;
