interface oauthClient {
    makeApiCall(arg0: {
      url: string;
      headers: { "content-type": string; authorization: string };
    }): any;
    createToken(arg0: string): any;
    revoke(arg0: {
      token_type: string;
      refresh_token: string | null;
      x_refresh_token_expires_in: number | null;
      access_token: string | null;
    }): any;
    clientId: string;
    clientSecret: string;
    environment: string;
    redirectUri: string;
  }

  interface connection {
    refreshToken: string;
    accessTokenExpiryDate: Date;
    quickbookCompanyId: string;
    merchantId:string
    quickbookCompanyName: string;
    createdAt: Date;
    updatedAt: Date;
    refreshTokenExpiryDate: number;
    accessToken: string;
  }