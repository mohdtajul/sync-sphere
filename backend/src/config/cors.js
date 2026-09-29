const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

// Allow only this Vercel project’s production and deployment-preview hostnames.
const vercelPreviewOrigin = /^https:\/\/sync-sphere-frontend(?:-[a-z0-9-]+)?-mohdtajuls-projects\.vercel\.app$/i;

export const corsOrigin = (origin, callback) => {
    if (!origin || configuredOrigins.includes(origin) || vercelPreviewOrigin.test(origin)) {
        return callback(null, true);
    }

    return callback(null, false);
};
