//refresh token for connected QBO company accounts. and return updated object for connections.
import moment from "moment";
import OAuthClient from "intuit-oauth";

import { QBOConfig } from "../../../config";
import connectionModal from "../../model/connectionModal";

export async function refreshToken(merchantId: string) {
  var connection: any;
  connection = await  connectionModal.findOne({
    merchantId:merchantId
  });

  console.log("connection",connection)
  var oauthClient;
  oauthClient = new OAuthClient({
    clientId: QBOConfig.QUICKBOOK_CLIENTID,
    clientSecret: QBOConfig.QUICKBOOK_CLIENTSECRET,
    environment: QBOConfig.QUICKBOOK_ENVIRONMENT,
    redirectUri: QBOConfig.QUICKBOOK_REDIRECT_URI,
    token: connection.accessToken,
  });
  var currentTime: Date = new Date();
  var CurrentDateTime = moment(currentTime);
  var AccessTokenUTCDate = moment(connection.accessTokenExpiryDate);

  console.log(currentTime +"\n"+ CurrentDateTime+"\n"+AccessTokenUTCDate)
  const minutes: number = CurrentDateTime.diff(AccessTokenUTCDate, "minutes");
  if (minutes >= 50) {
    await oauthClient
      .refreshUsingToken(connection.refreshToken)
      .then(async function (authResponse: any) {
        connection = await connectionModal.updateOne({
            id: connection.id,
          }
          ,{
            accessToken: authResponse.getJson().access_token,
            refreshToken: authResponse.getJson().refresh_token,
            accessTokenExpiryDate: new Date(),
            refreshTokenExpiryDate:
              authResponse.getJson().x_refresh_token_expires_in,
            updatedAt: new Date(),
          });
        });
  return connection;
}
}
