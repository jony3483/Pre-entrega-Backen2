import { Router } from "express";
import UserModel from "../dao/fs/data/user.model.js";

const router = Router();

//importmanos passport:
import passport from "passport";

router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }

    req.session.login = true;

    res.redirect("/products");
})

router.get("/failedregister", (req, res) => {
    res.send("registro fallido");
})


//version del login con passport:

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }

    req.session.login = true;

    res.redirect("/products");

})

router.get("/faillogin", (req,res) => {
    res.send("fallo todo el login!!!");
})

//logout

router.get("/logout", (req, res) => {
    if(req.session.logon) {
        req.session.destroy();
    }
    res.redirect("/login");
})

export default router;