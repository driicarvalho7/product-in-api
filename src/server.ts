import express from "express";
import routes from "./routes/index";
import { connectDB } from "./database/connection";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./utils/swaggerOptions";
import {
  PORT,
  DB_CONNECTION,
  SECRET_KEY,
  ENVIRONMENT,
} from "./utils/envConfigs";

console.log(`Loaded SECRET_KEY: ${SECRET_KEY}`);
console.log(`Loaded DB_CONNECTION: ${DB_CONNECTION}`);

const app = express();
const isPostgres = DB_CONNECTION === "postgres";

app.use(express.json());

const swaggerDocument = swaggerJSDoc(swaggerOptions);

// Rotas da API
app.use("/api/v0", routes);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB(isPostgres)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log("Database connection error:", error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENVIRONMENT} environment`);
});
