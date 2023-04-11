import { Request, Response } from "express";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface UserBody {
    email: string;
    password: string;
}


export const signup = async (
    req: Request<unknown, unknown, UserBody>,
    res: Response
) => {
    try {

        const { email, password } = req.body;
        const existingUser = await AppDataSource.manager.findOneBy(User, { email })

        if (existingUser)
            return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)

        const newUser = await AppDataSource.manager.create(User, { email, password: bcrypt.hashSync(password, 10) })

        await AppDataSource.manager.save(newUser)
        delete newUser.password

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!)

        return res.status(StatusCodes.CREATED).json({ ...newUser, token });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }



};

export const signin = async (
    req: Request<unknown, unknown, UserBody>,
    res: Response
) => {
    const { password, email } = req.body;

    const user = await AppDataSource.manager.findOne(User, {
        where: { email },
        select: { email: true, password: true, id: true }
    });

    if (!user)
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)


    if (user.password && !bcrypt.compareSync(password, user.password))
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)

    delete user.password

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!)


    return res.status(StatusCodes.OK).json({
        ...user,
        token
    });
};


