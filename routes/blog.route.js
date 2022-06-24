import { Router } from "express";
import { 
    getAllBlogs, 
    getBlog,
    createBlog, 
    updateBlog,
    deleteBlog     
 } from "../controllers/blog.controller.js";

//const urlValidar = require("../middlewares/urlValida")
const router = Router();

router.get('/', getAllBlogs)
router.get('/:id', getBlog)
router.post('/', createBlog)
router.put('/:id', updateBlog)
router.delete('/:id', deleteBlog)

export default router;