import express from "express";
const router = express.Router();

//tests users route - Public
router.get('/test', (req,res)=> res.json({msg: 'Users Works'}));

export default router;