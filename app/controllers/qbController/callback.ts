//Create QBO connection and import (vendor, class, account) data dump in import data table
//Entry in import-history table.
//check if same bbWorkspaceId have QBO or QBD connection then for Delete all past imported data and make a new connection.
import { Request, Response } from "express";
import OAuthClient from "intuit-oauth";
import { QBOConfig } from "../../../config";
import connectionModal from "../../model/connectionModal";
import { refreshToken } from "../../services/qbServices/refreshToken";
import QuickBooks from "node-quickbooks";
import { Validator } from "node-input-validator"
import { URLSearchParams } from "url";
import moment from "moment";
const callback = async (req: Request, res: Response) => {
  let url = "";


  let oauthClient;

  try {

    const v = new Validator(req.query, {
      url: "required",
    });


    const matched = await v.check();
    if (!matched) {
      return res.status(404).send(v.errors);
    }
    url = (req.query.url || "").toString();
    let Params = new URLSearchParams(url);
    var merchantId = Params.get("state");
console.log("merchantId",merchantId)
    let connection = await connectionModal.find({
      merchantId: merchantId
    });

    console.log("connection",connection)

    if(!connection || connection.length==0){
      oauthClient = new OAuthClient({
        clientId: QBOConfig.QUICKBOOK_CLIENTID,
        clientSecret: QBOConfig.QUICKBOOK_CLIENTSECRET,
        environment: QBOConfig.QUICKBOOK_ENVIRONMENT,
        redirectUri: QBOConfig.QUICKBOOK_REDIRECT_URI,
      });
      let urlParams = new URLSearchParams(url);
      oauthClient
        .createToken(url.toString())
        .then(async function (authResponse: { getJson: () => object }) {
          // const urlParams = new URLSearchParams(url);
          const RealmId = urlParams.get("realmId");
          const oauth2_token_json = JSON.stringify(
            authResponse.getJson(),
            null,
            2
          );
          const AuthReasponse = JSON.parse(oauth2_token_json);
          const qbo = await new QuickBooks(
            QBOConfig.QUICKBOOK_CLIENTID,
            QBOConfig.QUICKBOOK_CLIENTSECRET,
            AuthReasponse.access_token,
            true,
            RealmId,
            QBOConfig.QUICKBOOK_ENVIRONMENT == "Sandbox" ? true : false,
            true,
            null,
            "2.0",
            AuthReasponse.refresh_token
          );
  
          await qbo.getCompanyInfo(
            RealmId,
            async function (err: string, companyInfo: { CompanyName: string }) {
              console.log("merchantId2",merchantId)
              const connectionBody = {
                accessToken: AuthReasponse.access_token,
                refreshToken: AuthReasponse.refresh_token,
                accessTokenExpiryDate: moment(new Date()),
                refreshTokenExpiryDate: AuthReasponse.x_refresh_token_expires_in,
                quickbookCompanyId: RealmId!,
                quickbookCompanyName: companyInfo.CompanyName,
                createdAt: new Date(),
                updatedAt: new Date(),
                merchantId: merchantId!
              };
  
              var connection = await connectionModal.create(connectionBody);
  
  
              res.status(200).json({
                connectionId: connection.id,
                authResponse: {
                  accessToken: JSON.parse(oauth2_token_json).access_token,
                  refreshToken: JSON.parse(oauth2_token_json).refresh_token,
                },
              });
  
            }
          );
        })
        .catch(function (error: { authResponse: { json: { error: string } } }) {
          res.status(450).json({
            message: error.authResponse.json.error,
          });
        });
    }
    else{
      res.status(200).json({
        message: "connection already exists",
      });
    }

   
  } catch (error) {
    console.log(error)
    let error_message = error as Error
    res.status(451).json({
      message: error_message.message,
    });
  }
};

export default {
  middleware: [],
  handler: callback,
};
