import express       from "express";
import cors          from "cors";
import cookieParser  from "cookie-parser";
import helmet        from "helmet";
import { authRoutes }         from "./modules/auth/auth.routes.js";
import { favoritesRoutes }    from "./modules/favorites/favorites.routes.js";
import { watchHistoryRoutes } from "./modules/watchHistory/watchHistory.routes.js";
import { adminRoutes }        from "./modules/admin/admin.routes.js";
import { errorMiddleware }    from "./middlewares/error.middleware.js";

import { env } from "./config/env.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",          authRoutes);
app.use("/api/favorites",     favoritesRoutes);
app.use("/api/watch-history", watchHistoryRoutes);
app.use("/api/admin",         adminRoutes);

app.use(errorMiddleware);
export default app;
