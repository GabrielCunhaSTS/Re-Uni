import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import republicaRoutes from "./routes/republicaRoutes.js";
import path from "path";
import favoritoRoutes from "./routes/favoritoRoutes.js";
import comentarioRoutes from "./routes/comentarioRoutes.js";
import respostaRoutes from "./routes/respostaRoutes.js";
import configuracaoRoutes from "./routes/usuarioRoutes.js";
import aluguelRoutes from "./routes/aluguelRoutes.js";


const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


export default app;