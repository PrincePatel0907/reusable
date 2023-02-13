//Check QBD/QBO class is enable or not.

import { Request, Response } from "express";
import { QBOConfig } from "../../../config";
import QuickBooks from "node-quickbooks";
import connectionModal from "../../model/connectionModal";
import { Validator } from "node-input-validator";


const refundReceipt = async (req: Request, res: Response) => {
  try {
    
    const v = new Validator(req.query, {
      merchantId: "required",
    });

    const { merchantId } = req.query
    let connection = await connectionModal.findOne({
      merchantId: merchantId!
    });

    const qbo = await new QuickBooks(
      QBOConfig.QUICKBOOK_CLIENTID,
      QBOConfig.QUICKBOOK_CLIENTSECRET,
      connection?.accessToken,
      true,
      connection?.quickbookCompanyId,
      QBOConfig.QUICKBOOK_ENVIRONMENT == "Sandbox" ? true : false,
      true,
      null,
      "2.0",
      connection?.refreshToken
    );

    var refundReceiptBody = {
      "Line": [
        {
          "DetailType": "SalesItemLineDetail",
          "Amount": 451.00,
          "SalesItemLineDetail": {
            "ItemRef": {
              "value": "12"
            }
          }
        }
      ],
      "DepositToAccountRef": {
        "name": "Checking",
        "value": "35"
      },
      "CustomerRef": {
        "value": "66",
       },
    }

    qbo.createRefundReceipt(
      refundReceiptBody,
      async function (
        error: { Fault: { Error: [{ Detail: string }] } },
        refundReceipt: { Id: string }
      ) {
        if (error) {
          return res.status(450).json({
            message: error.Fault.Error[0].Detail,
          });
        } else {
          res.status(200).json(
            refundReceipt
          );
        }
      });

  
  } catch (error) {
    let error_message = error as Error
    res.status(451).json({
      message: error_message.message,
    });
  }
};

export default {
  middleware: [],
  handler: refundReceipt,
};
