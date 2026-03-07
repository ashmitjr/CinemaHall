import "dotenv/config";
import app from "./src/app.js";
import { env } from "./src/config/env.js";

const PORT = env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
