import { Config } from "./types";

export const config: Config = {
    app: {
        mailgen: {
            theme: 'default',
            product: {
                name: 'PixelPlaylistAI',
                link: process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000',
            },
        },
    }
};
