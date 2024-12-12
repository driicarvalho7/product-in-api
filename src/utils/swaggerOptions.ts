import { ENVIRONMENT } from "./envConfigs";
import path from "path";

const base_url =
  ENVIRONMENT === "production"
    ? "https://product-in-api.onrender.com"
    : "http://localhost:3000";

// Configuração do Swagger
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for ProductIn system",
    },
    servers: [
      {
        url: `${base_url}/api/v0`,
        description:
          ENVIRONMENT === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Indica o uso do JWT como formato do token
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica o esquema de segurança globalmente
      },
    ],
  },
  apis: [
    path.join(__dirname, "../docs/**/*.swagger.ts"), // Inclui os novos arquivos de documentação
    path.join(__dirname, "../routes/**/*.ts"), // Suporte a anotações inline (opcional)
  ],
};
