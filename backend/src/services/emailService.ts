import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const enviarEmailRecuperacao = async (email: string, token: string) => {
    const linkRecuperacao = `http://localhost:3000/resetar-senha?token=${token}`;

    const mailOptions = {
        from: `"Equipe ReUni" <suporte@reuni.com>`,
        to: email,
        subject: "Recuperação de Senha - ReUni",
        html: `
            <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <h1 style="color: #1e3a8a; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px;">ReUni</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                                <h2 style="color: #1e3a8a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; text-align: center;">Recuperação de Senha</h2>

                                <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 16px; text-align: center;">
                                    Você solicitou a recuperação de senha da sua conta ReUni. Clique no botão abaixo para criar uma nova senha:
                                </p>

                                <div style="text-align: center; margin: 32px 0;">
                                    <a href="${linkRecuperacao}" style="background-color: #1e3a8a; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);">Redefinir Senha</a>
                                </div>

                                <p style="font-size: 14px; line-height: 1.5; color: #64748b; margin-top: 24px; text-align: center;">
                                    Se você não solicitou essa alteração, apenas ignore este e-mail.
                                </p>

                                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />

                                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
                                    Este link é seguro e expira em 1 hora.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top: 24px;">
                            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                                &copy; 2026 ReUni. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};