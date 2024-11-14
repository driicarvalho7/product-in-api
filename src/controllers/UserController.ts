import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import bcrypt from "../utils/bcrypt";

export class UserController {
  // Listar todos os usuários
  static async getAll(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  }

  // Criar um novo usuário com senha criptografada
  static async create(req: Request, res: Response) {
    const { email } = req.body;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (user) {
      res.status(400).json({ message: "e-mail alredy existis" });
    }

    try {
      // Criptografar a senha antes de salvar
      const hashedPassword = await bcrypt.hashPassword(req.body.password);

      // Criar o usuário com a senha criptografada
      const user = userRepository.create({
        ...req.body,
        password: hashedPassword,
      });

      const result = await userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }
}
