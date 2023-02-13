//Create QBO client object for performing createVendor, createPurchase etc using node-quickbooks package.
import { QBOConfig } from "../../../config";
import QuickBooks from "node-quickbooks";
import { refreshToken } from "./refreshToken";

export const createQboClient = async (connectionData: connection) => {
	try {
		let connections = await refreshToken(connectionData.merchantId);
		const qboClient = await new QuickBooks(
			QBOConfig.QUICKBOOK_CLIENTID,
			QBOConfig.QUICKBOOK_CLIENTSECRET,
			connectionData.accessToken,
			true,
			connectionData.quickbookCompanyId,
			QBOConfig.QUICKBOOK_ENVIRONMENT == "Sandbox" ? true : false,
			true,
			null,
			"2.0",
			connections.refreshToken
		)
		return qboClient
	} catch (err) {
		console.log(err)
		return;
	}
}