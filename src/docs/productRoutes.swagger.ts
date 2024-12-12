/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Products]
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

/**
 * @swagger
 * /productByCodebar:
 *   get:
 *     summary: Busca um produto pelo código de barras
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: codebar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               codebar:
 *                 type: string
 *               name:
 *                 type: string
 *               weight_value:
 *                 type: number
 *               weight_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
