import express, { Request, Response } from 'express';
import axios from 'axios';
import { getAccessToken } from '../routes/auth';

const router = express.Router();
const BASE_URL = 'https://api-sandbox.jambopay.com';

router.get('/bill-items', async (req: Request, res: Response) => {
        const { PageIndex, PageSize } = req.query;

    const queryParams = new URLSearchParams();
    if (PageIndex) queryParams.append('PageIndex', PageIndex as string);
    if (PageSize) queryParams.append('PageSize', PageSize as string);

    try {
 
        const token = await getAccessToken();
        const response = await axios.get(
            `${BASE_URL}/universal-bill/item?${queryParams.toString()}`,
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
                error: 'Failed to get bill items',
                details: error.response.data,
            });
        } else {
            console.error('Error getting bill items:', error.message);
            res.status(500).json({
                error: 'Failed to get bill items',
                details: error.message,
            });
        }
    }
});

export default router;
