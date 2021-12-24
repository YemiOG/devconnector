import express from "express";

const router = express.Router();
//tests posts route - Public
router.get('/test', (req,res)=> res.json({msg: 'Posts Works'}));

export default router;