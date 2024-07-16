import Link from "../models/links.model.js";
import User from "../models/user.models.js";

export const getLinks = async (req,res) => {
    const links = await Link.find({
        user: req.user.id
    }).populate('user');
    res.json(links)
}

export const createLink = async(req,res) => {
    try {
        const { pagina, enlace } = req.body;
        const newLink = new Link({
            pagina,
            enlace,
            user: req.user.id,
        });
        const linkSaved = await newLink.save();
        res.json(linkSaved);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const getLink = async(req,res) => {
    const link = await Link.findById(req.params.id);
    if(!link) return res.status(404).json({ message: "Link no encontrado" });
    res.json(link)
}

export const deleteLink = async(req, res) => {
    const link = await Link.findByIdAndDelete(req.params.id);
    if(!link) return res.status(404).json({ message: "Link no encontrado" });
    res.json(link)
}

export const updateLink = async (req, res) => {
    try {
      const { pagina, enlace } = req.body;
      const linkUpdated = await Link.findOneAndUpdate(
        { _id: req.params.id },
        { pagina, enlace },
        { new: true }
      );
      return res.json(linkUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getLinkByName = async(req, res) => {
    try {
        const { username } = req.params;
    
    // Validar si el nombre de usuario se ha proporcionado
    if (!username) {
      return res.status(400).json({ message: "El nombre de usuario es requerido." });
    }

    // Buscar al usuario por nombre de usuario
    const userFound = await User.findOne({ username: username });
    const linkByName = await Link.find({ user: userFound._id })
    res.json(linkByName)
    } catch (error) {
        
    }
  }
