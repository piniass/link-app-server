import User from "../../models/user.models.js";
import bcrypt from 'bcryptjs';
import { createAccessToken } from "../../libs/jwt.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["Usuario no encontrado"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json(["Contraseña no válida"]);

    const token = await createAccessToken({ id: userFound._id });
    res.cookie('token', token);
    res.json({
      message: `Usuario: ${email} logeado con exito`,
      user: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        image: userFound.image,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
