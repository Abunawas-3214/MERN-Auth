import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/Products.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/products', verifyUser, createProduct)
router.get('/products', verifyUser, getProducts)
router.get('/products/:id', verifyUser, getProductById)
router.patch('/products/:id', verifyUser, updateProduct)
router.delete('/products/:id', verifyUser, deleteProduct)

export default router