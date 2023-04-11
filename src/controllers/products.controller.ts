import { Request, Response } from "express";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import { RequestWithUser } from "../types";
import { Product } from "../entities/Product";


interface CreateProductDto {
    title: string;
    price: number;
    description?: string;
}

interface UpdateProductDto {
    title: string;
    price: number;
    description?: string;
}

export const create = async (
    req: RequestWithUser,
    res: Response
) => {
    try {
        const { user } = req
        const { ...createProductDto } = req.body as CreateProductDto

        if (!user) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);

        const populatedUser = await AppDataSource.manager.findOneBy(User, { id: user })
        if (!populatedUser) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);

        const product = await AppDataSource.manager.create(Product, { ...createProductDto, user: populatedUser })

        await AppDataSource.manager.save(product)

        return res.status(StatusCodes.CREATED).json(product);

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)

    }

};

export const findAll = async (
    req: RequestWithUser,
    res: Response
) => {
    try {
        const { user } = req

        if (!user) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);

        const products = await AppDataSource.manager.find(Product, { relations: { user: true }, where: { user: { id: user } } })

        return res.status(StatusCodes.OK).json(products);


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
};

export const findOne = async (
    req: Request,
    res: Response
) => {
    try {
        const product = await AppDataSource.manager.findOneBy(Product, { id: req.params.id });
        return res.status(StatusCodes.OK).json(product);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
};

export const update = async (
    req: Request,
    res: Response
) => {
    try {
        const { ...updateProductDto } = req.body as UpdateProductDto
        const product = await AppDataSource.manager.findOneBy(Product, { id: req.params.id });
        if (!product) return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)

        const result = await AppDataSource.manager.save(Product, {
            ...product,
            ...updateProductDto
        });
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
};

export const remove = async (
    req: Request,
    res: Response
) => {
    try {
        const product = await AppDataSource.manager.findOneBy(Product, { id: req.params.id });
        if (!product) return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
        await AppDataSource.manager.remove(product)
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
};


