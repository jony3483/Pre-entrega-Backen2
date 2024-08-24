import fs from 'fs/promises';

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, thumbnails, code, stock, category }) {
        try {
            const arrayProductos = await this.leerArchivo();

            if (!title || !description || !price || !thumbnails || !code || !stock ||!category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            if (arrayProductos.some(item => item.code === code)) {
                console.log("El código debe ser único");
                return;
            }

            const nuevoProducto = {
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                category,
                status: true,
            };

            if (arrayProductos.length > 0) {
                ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            nuevoProducto.id = ++ProductManager.ultId;

            arrayProductos.push(nuevoProducto);
            await this.guardarArchivo(arrayProductos);
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }
    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo();
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const producto = arrayProductos.find(item => item.id === id);

            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return producto;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }


    async updateProduct(id, updateFields) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index === -1) {
                console.error("Producto no encontrado");
                return null;
            }
            //actulizar solo los campos proporcionados
            const productoActualizado = {...arrayProductos[index], ...updateFields, id};

            arrayProductos[index] = productoActualizado;
            await this.guardarArchivo(arrayProductos);
            return productoActualizado;
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                console.log("No se encontró el producto");
                return null;
            }

                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log(`Producto eliminado ${id}`);
                return true;
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            return false;
        }
    }

     // Métodos auxiliares para guardarArchivo y leerArchivo.

     async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo: ", error);
            throw error;
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("El archivo no existe, se creará uno nuevo.");
                await this.guardarArchivo([]);
                return [];
            } else {
                console.log("Error al leer el archivo: ", error);
                throw error;
            }
        }
    }
}

export default ProductManager;