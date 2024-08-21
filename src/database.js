import mongoose, { connect } from "mongoose";

mongoose.connect("mongodb+srv://coderhouse69990:coderhouse@cluster0.rxgyfzi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
.then( ()=> console.log("conexion exitosa"))
.catch( (error)=> console.log("tenemos un error", error))