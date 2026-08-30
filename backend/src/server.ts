import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";
import { iniciarCronVencimentos } from "./services/vencimentoService.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Banco de dados conectado!");

        app.listen(PORT, () => {

            console.log(`Servidor rodando em http://localhost:${PORT}`);
            iniciarCronVencimentos();

        });

    } catch (error) {

        console.error("Erro ao conectar ao banco:");
        console.error(error);
    }
}

startServer();