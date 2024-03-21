import jwt from 'jsonwebtoken'
import "dotenv/config";

const authValidation = (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({
            message: "Invalid authorization"
        })
    }

    const token = authorization.split(' ')[1]
    const secret = process.env.JWT_SECRET

    try {
        const jwtDecode = jwt.verify(token, secret)

        req.userData = jwtDecode
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    next()
}

export default authValidation