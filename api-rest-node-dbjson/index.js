import express, { json } from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const leerDatos = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error)
    }
}

const escribirDatos = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error)
    }
}

leerDatos();

app.get("/", (req, res) => {
    res.send('Bienvenido a la aplicación 2.0')
})

app.get("/libros", (req, res) => {
    const data = leerDatos();
    res.json(data.books);
})

app.get("/libros/:id", (req, res) => {
    const data =  leerDatos();
    const id = parseInt(req.params.id);
    console.log(id)
    const libro = data.books.find((libro) => libro.id === id);
    res.json(libro);
})

app.post("/libros", (req, res) => {
    const data = leerDatos();
    const body = req.body;
    const nuevoLibro = {
        id: data.books.length + 1,
        ...body
    };
    data.books.push(nuevoLibro);
    escribirDatos(data);
    res.json(nuevoLibro);
})

app.put("/libros/:id", (req, res) => {
    const data = leerDatos();
    const body = req.body;
    const id = parseInt(req.params.id);
    const libroIndice = data.books.findIndex((libro) => libro.id === id);
    data.books[libroIndice] = {
        ...data.books[libroIndice],
        ...body,
    }
    escribirDatos(data);
    res.json(data.books[libroIndice]);
})

app.delete("/libros/:id", (req, res) => {
    const data = leerDatos();
    const id = parseInt(req.params.id);
    const libroIndice = data.books.findIndex((libro) => libro.id === id);
    data.books.splice(libroIndice, 1);
    escribirDatos(data);
    res.json({"msg": "Libro eliminado correctamente"});
})

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000')
})