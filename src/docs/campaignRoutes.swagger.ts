/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Retorna todas as campanhas
 *     tags: [Campaigns]
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

/**
 * @swagger
 * /campaigns_names:
 *   get:
 *     summary: Retorna a lista de ids e nomes das campanhas
 *     tags: [Campaigns]
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

/**
 * @swagger
 * /dashboard_data:
 *   get:
 *     summary: Retorna dados consolidados da campanha (produtos, peso total, pacotes)
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados consolidados da campanha
 */

/**
 * @swagger
 * /products_export/{campaignId}:
 *   get:
 *     summary: Exporta os produtos da campanha em um arquivo Excel
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retorna o arquivo Excel em base64
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Cria uma nova campanha
 *     tags: [Campaigns]
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

/**
 * @swagger
 * /campaigns/{campaignId}/products:
 *   post:
 *     summary: Associa um produto a uma campanha com quantidade
 *     tags: [Campaigns]
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
