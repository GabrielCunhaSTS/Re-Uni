import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import republicaRoutes from "./routes/republicaRoutes.js";
import path from "path";

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

export default app;