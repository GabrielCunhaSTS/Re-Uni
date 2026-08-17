import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/database";
import "./models";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
    try {

        await sequelize.authenticate();

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