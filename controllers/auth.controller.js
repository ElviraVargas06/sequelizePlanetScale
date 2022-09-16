import {User} from "../models/User.js"
import bcryptjs from "bcryptjs"
import { generateToken, generateRefreshToken, generateOTP } from "../utils/tokenManager.js";
import { createTrans, generateEmailTemplate, confirmacionEmailTemplate } from "../utils/mail.js";

export const register = async ( req, res) => {

    try {
        
        const salt =await bcryptjs.genSalt(10)
        let password = await bcryptjs.hashSync(req.body.password, salt);
        
          //Generar OTP        
        
        const {otp} = generateOTP();       
        
       
        const {nombre, email} = req.body
    
        const ExistsUser = await User.findOne({where:{email}})
        if (ExistsUser) throw {email}
    
        const user = new User({
            nombre,
            email,
            password,
            verified:false,
            otp,  
            //expiresAt: Date.now() + 360000
        }) 
        

         await user.save()

        //Enviar correo electronico con la confirmacion de la cuenta        

        const transporter = createTrans()
        await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: user.email,
            subject: "verifique cuenta de correo",
            html:  generateEmailTemplate(otp),
            
        });
        
        //Generar token JWT
        
        const { token, expiresIn } = generateToken(user);
        generateRefreshToken(user, res);
      
        return res.json({ 
            status: "PENDING",
            message: "Revise su correo electrónico y valide la cuenta",
            user:{
                id:user.id,
                nombre: nombre,
                email: email,
                password: password,  
                
            },
            token, 
            expiresIn,
            otp
                        
            
        });
            
    } catch (error) {
        console.log(error)
        if(error.email){
            return res.status(404).json({ error: "Correo ya se encuentra registrado, Favor ingresar otro Correo valido 😒" });
        }
    }
    
    res.status(500).json({ message: "En este momento no se puede registrar en nuestro sistema, favor comunicarse con el administrador...!!" });
}


export const confirmarOtp = async (req, res) =>{
    
    const {otp} = req.body;      
    try {

        if(!otp)
        return res.status(403).json({message: "Lo sentimos, El código OTP no puede ir vacio"})

        const user = await User.findOne({where:{otp: otp}})
        
        if(!user) 
        
        return res.status(403).json({message: "Lo sentimos, No existe este Usuario"})

               
        //Actualiza el usuario e indica que ya se encuentra confirmada la cuenta
        await user.update({verified: true})

        // Borra el otp porque ya se confirmó el codigó
        user.otp = null

        await user.save()

        
          //Enviar correo electronico la confirmacion de la cuenta al registrar el OTP

          const transporter = createTrans()
          await transporter.sendMail({
              from: '"Fred Foo 👻" <foo@example.com>',
              to: user.email,
              subject: "verifique cuenta de correo",
              html:  confirmacionEmailTemplate(
                 "Correo verificado exitosamente!!!",
                 "Gracias por hacer parte de nosotros"
              ),
              
          });
        
        return res.json({ message:"Cuenta Verificada puede iniciar sesion" });        

    } catch (error) {
        return res.json({ msg: error.message });
        
    }
 
}

export const login = async (req, res)=>{

    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({where: {email}})
        if (!user) 
            return res.status(404).json({ message: "El Correo y/o Contraseña no se encuentra en la Base de Datos...!" });
            
        if (!user.verified) 
            return res.status(403).json({message: "Favor confirmar su cuenta para poder ingresar al sistema!!"})

        const validPass = await bcryptjs.compareSync(password, user.password)
        if(!validPass) return res.status(404).json({ message: "El Correo y/o Contraseña no se encuentra en la Base de Datos...!" }); 

        //Generar el token JWT
            const { token, expiresIn } = generateToken(user.id);
            generateRefreshToken(user.id, res);
    
            return res.json({ 
                status: "VERIFIED",
                message: "Ha ingresado a su cuenta exitosamente",
                user, token, expiresIn 
            });
        
        } catch (error) {
            console.log(error)
            return res.status(500).json({error: "Error de Servidor favor comunicarse con el Administrador"})
        }
   
        
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


export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    return res.json({ ok: true });
};

