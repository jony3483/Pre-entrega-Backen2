
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productoSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: true
    }, 
    price: {
        type: Number, 
        required: true
    }, 
    img: {
        type: String
    }, 
    code: {
        type: String, 
        required: true, 
        unique: true
    }, 
    stock: {
        type: Number, 
        required: true
    }, 
    category: {
        type: String, 
        required: true
    }, 
    status: {
        type: Boolean, 
        required: true
    }, 
    thumbnails: {
        type: [String]
    }
})

productoSchema.plugin(mongoosePaginate);

//Aca creamos el model y lo exportamos: 

const ProductModel = mongoose.model("products", productoSchema); 

export default ProductModel; 