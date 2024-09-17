import express, { Request, Response } from 'express';
import axios from 'axios';
import { getAccessToken } from '../routes/auth';

const router = express.Router();
const BASE_URL = 'https://api-sandbox.jambopay.com';

router.post('/add-bill-item', async (req: Request, res: Response) => {
    const { bill_id, bill_items } = req.body;

    // Check if bill_id and bill_items are valid
    if (!bill_id || !Array.isArray(bill_items) || bill_items.length === 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    // Ensure correct field names
    const requestBody = {
        bill_id: bill_id, // Check if API expects 'billId' or 'bill_id'
        bill_items: bill_items, // Check if API expects 'billItems' or 'bill_items'
    };

    console.log('Request Body:', requestBody); // Log the request body

    try {
        const token = await getAccessToken();
        const response = await axios.post(
            `${BASE_URL}/universal-bill/item`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        res.status(201).json(response.data);
    } catch (error: any) {
        if (error.response) {
            console.error('API Error:', error.response.data); // Log detailed API error
            res.status(error.response.status).json({
                error: 'Failed to add bill item',
                details: error.response.data,
            });
        } else {
            console.error('Error adding bill item:', error.message);
            res.status(500).json({
                error: 'Failed to add bill item',
                details: error.message,
            });
        }
    }
});

export default router;
