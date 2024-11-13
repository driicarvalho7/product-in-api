import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Campaign } from "../entities/Campaign";
import { Product } from "../entities/Product";
import { CampaignProduct } from "../entities/CampaignProduct";

export class CampaignController {
  // Listar todas as campanhas
  static async getAll(req: Request, res: Response): Promise<void> {
    const campaignRepository = getRepository(Campaign);
    const campaigns = await campaignRepository.find({
      relations: ["campaignProducts", "campaignProducts.product"],
    });
    res.json(campaigns);
  }

  // Listar todos os nome de campanhas
  static async getAllNames(req: Request, res: Response): Promise<void> {
    const campaignRepository = getRepository(Campaign);
    const campaigns = await campaignRepository.find({
      select: ["id", "name"],
    });
    res.json(campaigns);
  }

  // Criar uma nova campanha
  static async create(req: Request, res: Response): Promise<void> {
    const campaignRepository = getRepository(Campaign);
    const campaign = campaignRepository.create(req.body);
    const result = await campaignRepository.save(campaign);
    res.status(201).json(result);
  }

  // Associar um produto a uma campanha com quantidade
  static async addProductToCampaign(
    req: Request,
    res: Response
  ): Promise<void> {
    const { campaignId } = req.params;
    const { productId, quantity } = req.body;

    const campaignRepository = getRepository(Campaign);
    const productRepository = getRepository(Product);
    const campaignProductRepository = getRepository(CampaignProduct);

    // Encontrar a campanha
    const campaign = await campaignRepository.findOne({
      where: { id: campaignId },
    });
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }

    // Encontrar o produto
    const product = await productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Verificar se a relação entre campanha e produto já existe
    let campaignProduct = await campaignProductRepository.findOne({
      where: { campaign: { id: campaignId }, product: { id: productId } },
    });

    if (campaignProduct) {
      // Se a relação já existe, apenas atualize a quantidade
      const newQuantity = campaignProduct.quantity + quantity;
      campaignProduct.quantity = newQuantity;
    } else {
      // Caso contrário, crie uma nova relação entre campanha e produto com a quantidade especificada
      campaignProduct = campaignProductRepository.create({
        campaign,
        product,
        quantity,
      });
    }

    // Salvar a relação
    const result = await campaignProductRepository.save(campaignProduct);
    res.status(200).json(result);
  }
}
