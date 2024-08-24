
//importacion de modulos:
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import CartManager from "../dao/db/cart-manager-db.js";
import UserModel from "../dao/models/user.model.js";

import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

//instancia del gestor de carritos
const cartManager = new CartManager();

//calve secreta para firmar los jwt
const JWT_SECRET = "coderhouse";

//funcion para extraer el token jwt desde las cookies
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}


const initializePassport = () => {
    //creamos la primera estrategia de register
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        //le decimos que queremos acceder al objeto request
        usernameField: "email"
        //el usuario sera el mail que ya tengo registrado
    }, async (req, username, password, done) => {
        //me guardo los datos que vienen en el body
        const { first_name, last_name, email, age, role} = req.body;

        try {
            //Verificamos si ya existe un registro con ese mail: 
            let user = await UserModel.findOne({ email: email });
                if (user) return done(null, false);

                const carrito = await cartManager.crearCarrito();
                //Si no existe, voy a crear uno nuevo: 
                    let newUser = {
                        first_name,
                        last_name,
                        email,
                        cart_id: carrito_id, // guarda el id del carrito en el nuevo usuario
                        age,
                        password: createHash(password),
                        role: role || "usuario"
                    }

                    let result = await UserModel.create(newUser);

                    //Si todo resulta bien, podemos mandar done con el usuario generado. 

                    return done(null, result);
        
                } catch (error) {
                    return done(error);
        }
    }))

    //Agregamos una nueva estrategia ahora para el login: 
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Verifico si existe un usuario con ese email: 
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                console.log("Este usuario no existe ahhhhh auxilio!");
                return done(null, false);
            }

            //Si existe el user, verifico la contraseña: 
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    //estrategia autenticacion jwt basada en cookies
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))

    //serializar al usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    
    //deerializacion del usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
        
    })
}

export default initializePassport;