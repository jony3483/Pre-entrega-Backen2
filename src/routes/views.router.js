
import express from "express";
const router = express.Router();
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
})

router.get("/", async (req, res) => {
    res.render("home", {});
})

router.get("/products", async (req, res) => {
    try {
        const { page =1, limit = 4} = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
         });
        
        res.render("products",{
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });

    } catch (error) {
        console.error("error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "error interno del servidor"
        });
    }
})


router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
  
    try {
       const carrito = await cartManager.getCarritoById(cartId);
  
       if (!carrito) {
          console.log("No existe ese carrito con el id");
          return res.status(404).json({ error: "Carrito no encontrado" });
       }
  
       const productosEnCarrito = carrito.products.map(item => ({
          product: item.product.toObject(),
          //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
          quantity: item.quantity
       }));
  
  
       res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
       console.error("Error al obtener el carrito", error);
       res.status(500).json({ error: "Error interno del servidor" });
    }
  });


  //ruta para el formulario de login

router.get("/login", (req, res) => {
    if(req.session.login) {
        return res.redirect("/products");
    }
    res.render("login");
})


  //Ruta para el formulario de Register: 

router.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/products"); 
    }
    res.render("register");

})

//Ruta para el formulario de Perfil: 

router.get("/profile", (req, res) => {
    if(!req.session.login) {
        return res.redirect("/login"); 
    }
    res.render("profile", {user: req.session.user});
})

//ruta enviamos al usuario a la vista de productos
router.get("/products", (req, res) => {
    res.render("products", {user: req.session.user});
})


export default router;