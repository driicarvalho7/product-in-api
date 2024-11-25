import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entities/Product";

export class ProductController {
  // Listar todas os produtos
  static async getAll(req: Request, res: Response): Promise<void> {
    const productRepository = getRepository(Product);
    const products = await productRepository.find({
      order: {
        created_at: "ASC",
      },
    });
    res.json(products);
  }

  // Criar um novo produto
  static async create(req: Request, res: Response): Promise<void> {
    const productRepository = getRepository(Product);
    const product = productRepository.create(req.body);
    const result = await productRepository.save(product);
    res.status(201).json(result);
  }

  // Atualizar um produto existente
  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const productRepository = getRepository(Product);

    const existingProduct = await productRepository.findOne({
      where: { id: id },
    });
    if (!existingProduct) {
      res.status(404).json({ message: "Produto não encontrado." });
      return;
    }

    productRepository.merge(existingProduct, req.body);
    const result = await productRepository.save(existingProduct);
    res.json(result);
  }

  // Deletar um produto
  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const productRepository = getRepository(Product);

    const existingProduct = await productRepository.findOne({
      where: { id: id },
    });
    if (!existingProduct) {
      res.status(404).json({ message: "Produto não encontrado." });
      return;
    }

    await productRepository.remove(existingProduct);
    res.status(200).json({ message: "Produto removido com sucesso." });
  }

  // Buscar produto pelo código de barras
  static async getByCodebar(req: Request, res: Response): Promise<void> {
    const codebar =
      typeof req.query.codebar === "string" ? req.query.codebar : undefined;

    if (!codebar) {
      res.status(400).json({ message: "O código de barras é obrigatório." });
      return;
    }

    const productRepository = getRepository(Product);

    const product = await productRepository.findOne({
      where: { codebar },
    });

    if (!product) {
      res.status(404).json({ message: "Produto não encontrado." });
      return;
    }

    res.json(product);
  }
}
