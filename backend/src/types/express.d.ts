declare global {
    namespace Express {
        interface Request {
            user?: {
                id_usuario: number;
                tipo: "estudante" | "anunciante" | "admin";
            };
        }
    }
}

export {};