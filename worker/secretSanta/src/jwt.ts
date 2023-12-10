import { jwt } from "./types";

export async function isValidJwt(request: any, jwks: any[], issuer: string, audience: string) {
    const encodedToken = getJwt(request);
    if (encodedToken === null) {
      console.log("No token found");
      return false;
    }
    const token = decodeJwt(encodedToken);
    console.log(`Decoded token ${JSON.stringify(token)}`);
    const isNbf = isJwtNbf(token.payload);
    if(token.payload.iss !== issuer && issuer !== "*"){
      console.log("Token issuer is invalid");
      return false;
    }
    if(token.payload.aud !== audience && audience !== "*" && token.payload.aud.indexOf(audience) === -1){
      console.log("Token audience is invalid");
      return false;
    }
    if (isNbf) {
      console.log("Token is not valid yet");
      return false;
    }
  
    const isExpired = isJwtExpired(token.payload);
    if (isExpired) {
      console.log("Token is expired");
      return false;
    }
    console.debug("jwks: " + JSON.stringify(jwks));
    console.debug("token: " + JSON.stringify(token));
    const isValidSignature = await isValidJwtSignature(token, jwks);
    if (!isValidSignature) {
      console.log("Invalid signature");
      return false;
    }
    return true;
  }

export async function getEmail(request: any){
    const encodedToken = getJwt(request);
    if (encodedToken === null) {
      console.log("No token found");
      return null;
    }
    const token = decodeJwt(encodedToken);
    console.log(`Decoded token ${JSON.stringify(token)}`);
    return token.payload.custom_email_claim;
}
  function decodeJwt(token: any) {
    const parts = token.split(".");
    const header = JSON.parse(atob(parts[0]));
    const payload = parts[1].length > 0 ? JSON.parse(atob(parts[1])): {};
    const signature = atob(parts[2].replace(/_/g, "/").replace(/-/g, "+"));
    return {
      header: header,
      payload: payload,
      signature: signature,
      raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    };
  }

  function isJwtExpired(token: jwt) {
    const now = Math.floor(Date.now() / 1000);
    return token.exp < now;
  }
  function isJwtNbf(token: jwt) {
    const now = Math.floor(Date.now() / 1000);
    return token.nbf > now;
  }
  
  async function isValidJwtSignature(token: any, jwks: any[]) {
    const encoder = new TextEncoder();
    const data = encoder.encode([token.raw.header, token.raw.payload].join("."));
    const sigArray: any[] = Array.from(token.signature);
    const uintArray = sigArray.map((c) => c.charCodeAt(0));
    const signature = new Uint8Array(uintArray);
  
    for (const jwk of jwks) {

      console.debug("testing jwk: " + JSON.stringify(jwk));
      const key = await crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"]
      );
        console.debug("key: " + JSON.stringify(key));
      if (await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data)) {
        return true;
      }
    }
    console.debug("no valid keys");
    return false;
  }
  
  function getJwt(request: any) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader.substring(0, 6) !== "Bearer") {
      return null;
    }
    return authHeader.substring(6).trim();
  }