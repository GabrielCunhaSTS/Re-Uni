import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/database";
import { Usuario } from "./models";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
    try {

        await sequelize.authenticate();

        const usuarios = await Usuario.findAll();

        console.log("Usuários encontrados:", usuarios.length);

        console.log("Banco de dados conectado!");

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (error) {

        console.error("Erro ao conectar ao banco:");
        console.error(error);

    }
}

startServer();