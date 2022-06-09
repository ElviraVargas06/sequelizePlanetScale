import {User} from "../models/User.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

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

    if(savedUser) res.json({message: "Gracias se encuentra registrado en nuestro sistema...!!"})

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
        
        const jwtToken = jwt.sign(
            {id: userEmail.id, email: userEmail.email},
            process.env.JWT_SECRET
        )
        res.json({message: "Bienvenido a nuestro Sistema...!", token: jwtToken })
}
