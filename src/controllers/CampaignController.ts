import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Campaign } from "../entities/Campaign";
import { Product } from "../entities/Product";
import { CampaignProduct } from "../entities/CampaignProduct";
import { Workbook } from "exceljs";
import axios from "axios";

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
      order: { id: "ASC" },
    });
    res.json(campaigns);
  }

  // Retorna os dados da dashboard
  static async getDashboardData(req: Request, res: Response): Promise<void> {
    const { campaignId } = req.query;

    if (!campaignId) {
      res.status(400).json({ message: "O ID da campanha é obrigatório." });
      return;
    }

    const campaignRepository = getRepository(Campaign);

    const campaign = await campaignRepository.findOne({
      where: { id: campaignId as string },
      relations: ["campaignProducts", "campaignProducts.product"],
    });

    if (!campaign) {
      res.status(404).json({ message: "Campanha não encontrada." });
      return;
    }

    let totalWeight = 0;
    let totalProducts = 0;
    let totalPackages = 0;

    const products = campaign.campaignProducts.map((cp) => {
      const productWeight =
        cp.product.weight_type === "g"
          ? Number(cp.product.weight_value) / 1000 // Converte gramas para quilos
          : Number(cp.product.weight_value);

      totalWeight += productWeight * cp.quantity;
      totalProducts += 1;
      totalPackages += cp.quantity;

      return {
        name: cp.product.name,
        total_weight: productWeight * cp.quantity,
        total_packagee: cp.quantity,
      };
    });

    res.json({
      total_products: totalProducts,
      total_weight: totalWeight,
      products,
    });
  }

  // Retorna um base64 do export em excel
  static async exportProducts(req: Request, res: Response): Promise<void> {
    const { campaignId } = req.params;

    if (!campaignId) {
      res.status(400).json({ message: "O ID da campanha é obrigatório." });
      return;
    }

    const campaignRepository = getRepository(Campaign);

    const campaign = await campaignRepository.findOne({
      where: { id: campaignId },
      relations: ["campaignProducts", "campaignProducts.product"],
    });

    if (!campaign) {
      res.status(404).json({ message: "Campanha não encontrada." });
      return;
    }

    // Criar uma nova planilha
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Produtos da Campanha");

    // Adicionar cabeçalho
    sheet.addRow(["Nome da Campanha", campaign.name]);
    sheet.addRow([]);
    sheet.addRow(["Produto", "Quantidade (kg)", "Pacotes"]);

    // Adicionar produtos
    campaign.campaignProducts.forEach((cp) => {
      const productWeight =
        cp.product.weight_type === "g"
          ? Number(cp.product.weight_value) / 1000 // Converte gramas para quilos
          : Number(cp.product.weight_value);

      sheet.addRow([
        cp.product.name,
        (productWeight * cp.quantity).toFixed(2),
        cp.quantity,
      ]);
    });

    // Salvar a planilha em memória
    const buffer = await workbook.xlsx.writeBuffer();

    // Converter para Base64 corretamente
    const base64 = Buffer.from(buffer).toString("base64");

    res.json({ base64 });
  }

  /*
   * Criar uma nova campanha
   */
  static async create(req: Request, res: Response): Promise<void> {
    const campaignRepository = getRepository(Campaign);
    const campaign = campaignRepository.create(req.body);
    const result = await campaignRepository.save(campaign);
    res.status(201).json(result);
  }

  /*
   * Associar um produto a uma campanha com quantidade
   */
  static async addProductToCampaign(
    req: Request,
    res: Response
  ): Promise<void> {
    const { campaignId } = req.params;
    const { codebar, quantity } = req.body;

    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );
    console.log("codebar: ", codebar);
    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );

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

    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );
    console.log("campaign: ", campaign);
    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );

    // Primeiro, tenta encontrar o produto diretamente no banco
    let product = await productRepository.findOne({
      where: { codebar: codebar }, // Procurar pelo código de barras
    });

    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );
    console.log("product: ", product);
    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );

    if (!product) {
      // Se o produto não existir no banco, vamos tentar pegar da API externa
      try {
        const apiResponse = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${codebar}`
        );
        const productData = apiResponse.data.product;

        console.log(
          "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
        );
        console.log("productData: ", productData);
        console.log(
          "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
        );

        if (productData) {
          // Criar um novo produto com os dados retornados da API
          product = productRepository.create({
            codebar: productData._id,
            name: productData.product_name_pt || productData.product_name,
            weight_value: parseFloat(productData.product_quantity), // A API retorna o peso em unidades como '80', convertendo para número
            weight_type: productData.product_quantity_unit || "g", // A unidade de peso
          });

          // Salvar o produto no banco
          await productRepository.save(product);
        } else {
          res
            .status(404)
            .json({ message: "Product not found in external API" });
          return;
        }
      } catch (error: any) {
        res.status(500).json({
          message: "Error fetching product from external API",
          error: error.message,
        });
        return;
      }
    }

    // Agora que temos o produto (do banco ou da API externa), vamos associá-lo à campanha

    // Verificar se a relação entre campanha e produto já existe
    let campaignProduct = await campaignProductRepository.findOne({
      where: { campaign: { id: campaignId }, product: { id: product.id } },
    });

    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );
    console.log("campaignProduct: ", campaignProduct);
    console.log(
      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );

    if (campaignProduct) {
      // Se a relação já existe, apenas atualize a quantidade
      campaignProduct.quantity += quantity;
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
