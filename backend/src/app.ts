import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import republicaRoutes from "./routes/republicaRoutes.js";
import favoritoRoutes from "./routes/favoritoRoutes.js";
import comentarioRoutes from "./routes/comentarioRoutes.js";
import respostaRoutes from "./routes/respostaRoutes.js";
import configuracaoRoutes from "./routes/usuarioRoutes.js";
import aluguelRoutes from "./routes/aluguelRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import avaliacaoRoutes from "./routes/avaliacaoRoutes.js";
import notificacaoRoutes from "./routes/notificacaoRoutes.js";
import mensagemRoutes from "./routes/mensagemRoutes.js";
import comprovanteRoutes from "./routes/comprovanteRoutes.js";
import manutencaoRoutes from './routes/manutencaoRoutes.js';


const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
}, express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
    res.json({
        message: "API ReUni funcionando!"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/republicas", republicaRoutes);
app.use("/api/favoritos", favoritoRoutes);
app.use("/api", comentarioRoutes);
app.use("/api", respostaRoutes);
app.use("/api", configuracaoRoutes);
app.use("/api", aluguelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", avaliacaoRoutes);
app.use("/api/notificacoes", notificacaoRoutes);
app.use("/api", mensagemRoutes);
app.use("/api", comprovanteRoutes);
app.use('/api', manutencaoRoutes);

export default app;