import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { CampaignController } from "../controllers/CampaignController";
import { ProductController } from "../controllers/ProductController";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Rotas para Autenticação
router.post("/signIn", AuthController.login);
router.post("/signUp", UserController.create);
router.get("/protected", authMiddleware, AuthController.protected);

// Rotas para Usuários
router.get("/users", authMiddleware, UserController.getAll);

// Rotas para Campanhas
router.get("/campaigns", authMiddleware, CampaignController.getAll);
router.get("/campaigns_names", authMiddleware, CampaignController.getAllNames);
router.get(
  "/dashboard_data",
  authMiddleware,
  CampaignController.getDashboardData
);
router.get(
  "/products_export/:campaignId",
  authMiddleware,
  CampaignController.exportProducts
);
router.post("/campaigns", authMiddleware, CampaignController.create);
router.post(
  "/campaigns/:campaignId/products",
  authMiddleware,
  CampaignController.addProductToCampaign
);

// Rotas para Produtos
router.get("/products", authMiddleware, ProductController.getAll);
router.get("/productByCodebar", authMiddleware, ProductController.getByCodebar);
router.post("/products", authMiddleware, ProductController.create);
router.put("/products/:id", authMiddleware, ProductController.update);
router.delete("/products/:id", authMiddleware, ProductController.delete);

export default router;
