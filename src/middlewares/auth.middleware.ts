import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import { RequestWithUser } from "../types";



export const isAuthenticated = (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);

        const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.user = id;
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
};