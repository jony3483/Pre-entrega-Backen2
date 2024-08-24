import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

//cambios con passport:
import initializePassport from "./config/passport.config.js";
import passport from "passport";

//express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(session({
  secret: "secretCoder",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://coderhouse69990:coderhouse@cluster0.rxgyfzi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  })
}))


///Cambios con passport: 
initializePassport();
app.use(passport.initialize()); 
app.use(passport.session()); 



// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`servidor listo ${PUERTO}`);
});

import ProductManager from "./dao/fs/product-manager.js";
const productManager = new ProductManager("./src/models/productos.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("un cliente se conecto");

  socket.emit("productos", await productManager.getProducts());

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);

    io.emit("productos", await productManager.getProducts());
  });

  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);

    io.emit("productos", await productManager.getProducts());
  });
});
