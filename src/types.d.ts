import { Request, Response, NextFunction } from "express"
export interface RequestWithUser extends Request {
    user?: string
}