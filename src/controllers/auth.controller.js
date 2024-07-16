import User from "../models/user.models.js";
import bcrypt from 'bcryptjs'
import { createAccessToken } from "../libs/jwt.js";
import { uploadImage } from "../libs/cloudinary.js";
import jwt from 'jsonwebtoken'
import fs from "fs-extra";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);
  const image = {
    url:'default.webp',
    public_id: ''
  }
  try {
    const userFound = await User.findOne({email})
    if(userFound) return res.status(400).json(["El correo ya existe."])
    //Validacion añadida, si da error salta aqui
    const usernameFound = await User.findOne({username})
    if(usernameFound) return res.status(400).json(["El username ya existe."])
    
    const pwdHash = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      username,
      password: pwdHash,
      image,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({id: userSaved._id})
    res.cookie('token', token)
    res.json({
      message: `Usuario: ${username} creado con exito`,
      user: {
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        image: userSaved.image,
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {

    const userFound = await User.findOne({email})

    if (!userFound) return res.status(400).json(["Usuario no encontrado"])
  
    const isMatch = await bcrypt.compare(password, userFound.password)

    if(!isMatch)return res.status(400).json(["Contraseña no válida"])

    const token = await createAccessToken({id: userFound._id})
    res.cookie('token', token)
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
    console.log("Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  })
  return res.sendStatus(200)
};

export const profile = async (req, res) => {
  // console.log(req.user)
  const userFound = await User.findById(req.user.id)
  if(!userFound){
    return res.status(404).json({ message: "Usuario no encontrado."})
  } else {
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      image: userFound.image,
      createdAt: userFound.createdAt,
    })
  }
  // res.send('profile')
}

export const setImage = async (req, res) => {
  let image = null;
  try {
      console.log(req.files)
      console.log(req.files.image.tempFilePath);

      const result = await uploadImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath);

      image = {
        url: result.secure_url,
        public_id: result.public_id,
      }

      const imageUpdated = await User.findOneAndUpdate(
        { _id: req.user.id },
        { image},
        { new: true }
      );

      return res.json(imageUpdated);
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
  }
};

export const editProfile = async(req, res) => {
  try {
    const { username, email } = req.body;
    const userUpdated = await User.findOneAndUpdate(
      { _id: req.user.id },
      { username, email },
      { new: true }
    );
    return res.json(userUpdated);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
}

export const getByName = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username)
    // Validar si el nombre de usuario se ha proporcionado
    if (!username) {
      return res.status(400).json({ message: "El nombre de usuario es requerido." });
    }

    // Buscar al usuario por nombre de usuario
    const userFound = await User.findOne({ username: username });

    // Manejar el caso donde no se encuentra el usuario
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Responder con la información del usuario
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      image: userFound.image,
      createdAt: userFound.createdAt,
    });
  } catch (error) {
    console.error(error);
    // Responder con un error de servidor
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};


export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      image: userFound.image
    });
  });
};