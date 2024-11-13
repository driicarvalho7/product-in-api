import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entities/Product";

export class ProductController {
  // Listar todas os produtos
  static async getAll(req: Request, res: Response): Promise<void> {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    res.json(products);
  }

  // Criar um novo produto
  static async create(req: Request, res: Response): Promise<void> {
    const productRepository = getRepository(Product);
    const product = productRepository.create(req.body);
    const result = await productRepository.save(product);
    res.status(201).json(result);
  }
}
