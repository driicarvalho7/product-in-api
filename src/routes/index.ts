import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { CampaignController } from "../controllers/CampaignController";
import { ProductController } from "../controllers/ProductController";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/*
 * Rota para Autenticação
 */
/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: Realiza o login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/signUp", AuthController.login);

/**
 * @swagger
 * /signIn:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 */
router.post("/signIn", UserController.create);

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Retorna o Header de Autenticação do Usuário
 *     responses:
 *       200:
 *         description: Dados do Header
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 auth:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/protected", authMiddleware, AuthController.protected);

/*
 * Rotas para Usuários
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get("/users", authMiddleware, UserController.getAll);

/*
 * Rotas para Campanhas
 */
/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Retorna todas as campanhas
 *     responses:
 *       200:
 *         description: Lista de campanhas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 */
router.get("/campaigns", authMiddleware, CampaignController.getAll);

/**
 * @swagger
 * /campaigns_names:
 *   get:
 *     summary: Retorna a lista de ids e nomes das campanhas
 *     responses:
 *       200:
 *         description: Lista de nomes de campanhas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get("/campaigns_names", authMiddleware, CampaignController.getAllNames);

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Cria uma nova campanha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 */
router.post("/campaigns", authMiddleware, CampaignController.create);

/**
 * @swagger
 * /campaigns/{campaignId}/products:
 *   post:
 *     summary: Associa um produto a uma campanha com quantidade
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto associado à campanha com sucesso
 *       404:
 *         description: Campanha ou produto não encontrado
 */
router.post(
  "/campaigns/:campaignId/products",
  authMiddleware,
  CampaignController.addProductToCampaign
);

/*
 * Rotas para Produtos
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   codebar:
 *                     type: string
 *                   name:
 *                     type: string
 *                   weight_value:
 *                     type: number
 *                   weight_type:
 *                     type: string
 */
router.get("/products", authMiddleware, ProductController.getAll);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codebar:
 *                 type: string
 *               name:
 *                 type: string
 *               weight_value:
 *                 type: number
 *               weight_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 codebar:
 *                   type: string
 *                 name:
 *                   type: string
 *                 weight_value:
 *                   type: number
 *                 weight_type:
 *                   type: string
 */
router.post("/products", authMiddleware, ProductController.create);

export default router;
