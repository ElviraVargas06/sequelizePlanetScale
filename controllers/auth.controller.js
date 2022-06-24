import {User} from "../models/User.js"
import bcryptjs from "bcryptjs"
import { generateToken, generateRefreshToken  } from "../utils/tokenManager.js";

export const register = async (req, res) => {
    const salt =await bcryptjs.genSalt(10)
    let password = await bcryptjs.hashSync(req.body.password, salt);

    const {email} = req.body

    const ExistsUser = await User.findOne({where:{email}}).catch(
        (error)=> {
            console.log("Error: ", error)
        }
    )

    if (ExistsUser) {
        return res.status(404).json({
            message: "El Usuario que está ingresando ya se encuentra en nuestro sistema...!!"
        })
    }

    const user = new User({email, password})
    const savedUser = await user.save().catch((error)=>{
        console.log("Error: ", error)
        res.status(500).json({ error: "En este momento no se puede registrar en nuestro sistema...!!" });
    });

      //Generar token JWT

      const { token, expiresIn } = generateToken(user.id);
      generateRefreshToken(user.id, res);

      return res.json({ token, expiresIn });

}

export const login = async (req, res)=>{
   
    const { email } = req.body;

    const userEmail = await User.findOne({where: {email}}).catch(
        (error) => {
            console.log("Error: ", error)
        }
    )
     
        if (!userEmail) 
            return res.status(404).json({ msg: "El Correo y/o Contraseña no se encuentra en la Base de Datos...!" });
        
        const pass = await bcryptjs.compareSync(
            req.body.password,
            userEmail.password
        )

        if(!pass)
            return res.status(404).json({ msg: "El Correo y/o Contraseña no se encuentra en la Base de Datos...!" });
      
        //Generar el token JWT
        const { token, expiresIn } = generateToken(userEmail.id);
        generateRefreshToken(userEmail.id, res);

        return res.json({ token, expiresIn });
        
}

export const refreshToken = (req, res) => {
    try {
        let refreshTokenCookie = req.cookies?.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el refreshToken");

        const { id } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        const { token, expiresIn } = generateToken(id);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        const data = errorsToken(error);
        return res.status(401).json({ error: data });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.uid)
        delete user.password;
        return res.json({ user });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    return res.json({ ok: true });
};

