export const register = (req, res)=>{
    console.log(req.body)
    res.json({ok: "Registrado 6000"})
}

export const login = (req, res)=>{
    res.json({ok: "login 6000"})
}

