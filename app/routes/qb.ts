import express, { Request, Response } from 'express';
import qbController from '../controllers/qbController';


const router = express.Router();

router.post('/creditNotes', qbController.creditNotes.middleware, qbController.creditNotes.handler);
router.post('/refundReceipt', qbController.refundReceipt.middleware, qbController.refundReceipt.handler);

router.get(
    "/callback:url?:userId?",
    qbController.callback.middleware,
    qbController.callback.handler
  );

export default router;