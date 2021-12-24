import express from "express";

const router = express.Router();
//tests profile route - Public
router.get('/test', (req,res)=> res.json({msg: 'Profile Works'}));

export default router;