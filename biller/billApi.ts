import express, { Request, Response } from "express";
import axios from "axios";
import { getAccessToken } from "../routes/auth";
import { v4 as uuidv4 } from "uuid"
const router = express.Router();
const BASE_URL = "https://api-sandbox.jambopay.com";

router.post("/create-bill", async (req: Request, res: Response) => {
  const {
      name,
    description,
    allow_partial_payment,
    recurrent,
    collection_account,
    recurrent_interval,
    recurrent_date,
    bill_items,
  } = req.body;
  const order_id = `${uuidv4()}`;
   const requestBody = {
    order_id: order_id,
    name: name,
    description: description,
    allow_partial_payment: allow_partial_payment,
    recurrent: recurrent,
    recurrent_interval: recurrent_interval,
    recurrent_date: recurrent_date,
    bill_channel: "jambopay",
   collection_account: collection_account,
    bill_items: bill_items,
  };
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/universal-bill`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    if (error.response) {
            res.status(400).json({
        error: "Failed to create the bill",
        details: error.response.data,
      });
    } else {
      console.error("Error creating bill:", error.message); // If no response, log general message
      res
        .status(500)
        .json({ error: "Failed to create the bill", details: error.message });
    }
  }
});
export default router;
