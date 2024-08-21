
import express from "express";
const router = express.Router();

import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();
import CartModel from "../dao/fs/data/cart.model.js";

//creamos carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//obtener los carritos 
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error al obtener los carritos', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//obtener  carrito por id
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId);
        
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);

    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//agregar productos a distintos carritos.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//eliminar producto selecionado
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
        if (updatedCart) {
            res.json(updatedCart.products);
        } else {
            res.status(404).json({ error: "Cart or product not found" });
        }
    } catch (error) {
        console.error("Error removing product from cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await cartManager.clearCart(cartId);
        if (updatedCart) {
            res.json(updatedCart.products);
        } else {
            res.status(404).json({ error: "Cart not found" });
        }
    } catch (error) {
        console.error("Error clearing cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//Actualizar carrito con arreglo de productos
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;

    try {
        const updatedCart = await cartManager.updateCartWithProducts(cartId, products);
        if (updatedCart) {
            res.json(updatedCart.products);
        } else {
            res.status(404).json({ error: "Cart not found" });
        }
    } catch (error) {
        console.error("Error updating cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Actualizar solo la cantidad de ejemplares de un producto
router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        if (updatedCart) {
            res.json(updatedCart.products);
        } else {
            res.status(404).json({ error: "Cart or product not found" });
        }
    } catch (error) {
        console.error("Error updating product quantity", error);
        res.status(500).json({ error: "Internal server error" });
    }
    // Obtener productos completos mediante populate
    router.get("/:cid/products", async (req, res) => {
        const cartId = req.params.cid;
        try {
            const cart = await cartManager.getCartWithProducts(cartId);
            if (cart) {
                res.json(cart.products);
            } else {
                res.status(404).json({ error: "Cart not found" });
            }
        } catch (error) {
            console.error("Error getting cart with products", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});


export default router;