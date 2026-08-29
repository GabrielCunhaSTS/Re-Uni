import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
    title: "ReUni | Moradias Estudantis",
    description: "Conectando estudantes ao lugar ideal para morar.",
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={inter.className}>
                <QueryProvider>
                    {children}
                </QueryProvider>
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}