import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "./routes/auth.routes";
import productRoutes from "./routes/products.routes"
import { isAuthenticated } from "./middlewares/auth.middleware"

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/products", isAuthenticated, productRoutes);


export default app;