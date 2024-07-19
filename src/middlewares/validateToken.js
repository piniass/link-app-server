import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export const authRequired = (req, res, next) => {
    const { token } = req.cookies
    console.log("token: ",token)
    if(!token) return res.status(401).json({ message: "No hay token, autoización denegada."})

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        console.log("token verify: ", token)
        console.log("secret: ", TOKEN_SECRET)
        console.log("user: ", user)
        if(err) return res.status(403).json({ message: "Token inválido"})

        req.user = user
        console.log("req user: ",req.user)

        next()

    })


}