import { Router } from "express";
import { login, logout,register, profile, getByName, editProfile, setImage, verifyToken } from "../controllers/auth.controller.js";
import { createLink, getLinks, getLink, deleteLink, updateLink, getLinkByName } from "../controllers/links.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router = Router()

router.post('/register',register);

router.post('/login',login);

router.post('/logout',logout);

router.get('/profile', authRequired, profile)

router.put('/edit', authRequired, editProfile)

router.put('/image', authRequired, setImage)

router.get('/user/:username', getByName)

router.get('/link', authRequired, getLinks)

router.get('/link/:id', authRequired, getLink)

router.post('/link', authRequired, createLink)

router.put('/link/:id', authRequired, updateLink)

router.delete('/link/:id', authRequired, deleteLink)

router.get('/link/user/:username', getLinkByName)

router.get("/auth/verify", verifyToken);

export default router;