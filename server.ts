import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
 import billerTV from './biller/billerTv'
import billApi from "./biller/billApi";
import billItemApi from "./biller/billItemApi";
import getbillItem from "./Getbills/getbillItem";
import getbills from "./Getbills/getbills";
import getbillId from "./Getbills/billIdApi";
import getbillcode from "./Getbills/billcodeApi";
import billTransactionId from "./Getbills/billTransactionId";
import billTransactionCode from "./Getbills/billTransactionCode";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

app.use(
  "/auth",
  authRoutes,
  billApi,
  billItemApi,
  getbillItem,
  getbills,
  getbillId,
  getbillcode,
  billTransactionId,
  billTransactionCode,
  billerTV,
);
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
