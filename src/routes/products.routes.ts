import { Router } from "express";
import {
    create,
    findAll,
    findOne,
    update,
    remove
} from "../controllers/products.controller";

const router = Router();

router.post("/", create);

router.get("/", findAll);

router.get("/:id", findOne)

router.patch("/:id", update)

router.delete("/:id", remove)

export default router;