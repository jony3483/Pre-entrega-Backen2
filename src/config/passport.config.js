
//importacion de modulos:
import passport from "passport";
import local from "passport-local";

//me traigo el model y las funciones de bcrypt
import UserModel from "../dao/fs/data/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    //creamos la primera estrategia de register
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        //le decimos que queremos acceder al objeto request
        usernameField: "email"
        //el usuario sera el mail que ya tengo registrado
    }, async (req, username, password, done) => {
        //me guardo los datos que vienen en el body
        const { first_name, last_name, email, age} = req.body;

        try {
            //Verificamos si ya existe un registro con ese mail: 
            let user = await UserModel.findOne({ email: email });
                if (user) return done(null, false);
                //Si no existe, voy a crear uno nuevo: 
                    let newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password)
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

    //serializar y deserializar

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

}

export default initializePassport;