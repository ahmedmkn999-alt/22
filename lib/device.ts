import crypto from "crypto";

export function deviceFingerprint(req:any){

const ua=req.headers.get("user-agent")||"";

const lang=req.headers.get("accept-language")||"";

return crypto
.createHash("sha256")
.update(ua+lang)
.digest("hex");

}
