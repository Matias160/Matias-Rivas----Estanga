import express from "express";

// Servidor estatico sin require y sin rutas GET propias.
const app = express();
const PORT = 3001;

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Punto 1 disponible en http://localhost:${PORT}`);
});
