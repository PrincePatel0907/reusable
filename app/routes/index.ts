//all Router files define here. (qbd,db,qbo)
import express from 'express';
import qbRouter from './qb'

const router = express.Router();
router.use('/qb', qbRouter)
router.get('/', (_, res) => {
    res.send("Lever Backend API");
});


export default router;