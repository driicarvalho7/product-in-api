import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import bcrypt from "../utils/bcrypt";
import { SECRET_KEY } from "../utils/envConfigs";

export class AuthController {
  // Realizar login de usuário
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const userRepository = getRepository(User);

    // Encontrar o usuário pelo email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Invalid Credentials" });
      return;
    } else {
      // Comparar a senha fornecida com o hash armazenado
      const isMatch = await bcrypt.comparePassword(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid Credentials" });
        return;
      }

      // Cria token de autenticação
      const token = jwt.sign(
        { id: user.id, username: user.name, email: user.email },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      // Autenticação bem-sucedida
      res.status(200).json({ message: "Login successful", token: token });
    }
  }

  static async protected(req: Request, res: Response): Promise<void> {
    res.json({
      message: "Acesso concedido à rota protegida",
      auth: req.headers.authorization,
    });
  }
}
