import { Producto } from "../models/Producto.js";

export const getProducts = async (req, res) => {
  const product = await Producto.findAll();

  res.json(product);
};
