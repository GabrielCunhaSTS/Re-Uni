import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
interface TokenPayload extends JwtPayload {
    id_usuario: number;
    tipo: "estudante" | "anunciante" | "admin";
}
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                mensagem: "Token de autenticação não fornecido."
            });
            return;
        }
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer" || !token) {
            res.status(401).json({
                mensagem: "Formato do token inválido."
            });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET não configurado.");
            res.status(500).json({
                mensagem: "Erro de configuração do servidor."
            });
            return;
        }
        const decoded = jwt.verify(
            token,
            jwtSecret
        ) as TokenPayload;
        if (!decoded.id_usuario || !decoded.tipo) {
            res.status(401).json({
                mensagem: "Token inválido."
            });
            return;
        }
        req.user = {
            id_usuario: decoded.id_usuario,
            tipo: decoded.tipo
        };
        next();
    } catch (error) {
        console.error("Erro na autenticação:", error);
        res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }
};