import { NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";
import forge from "node-forge";

export async function GET() {
  let privateKey = process.env.DATALENS_PRIVATE_KEY;
  let embedId = process.env.DATALENS_EMBED_ID || "kw1mro94lpou5";

  if (!privateKey) {
    return NextResponse.json(
      { error: "DATALENS_PRIVATE_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    // Нормализуем приватный ключ и embedId
    privateKey = privateKey.replace(/\\n/g, "\n");
    embedId = embedId.trim().replace(/\n/g, "").replace(/\r/g, "");

    // Создаем JWT токен согласно документации DataLens
    // Алгоритм: PS256
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      embedId: embedId,
      iat: now,
      exp: now + 3600, // 1 час (максимум 10 часов)
      dlEmbedService: "YC_DATALENS_EMBEDDING_SERVICE_MARK",
      params: {},
    };

    // Конвертируем RSA PRIVATE KEY (PKCS1) в PKCS8 для библиотеки jose
    let keyPem = privateKey;
    
    // Если ключ в формате PKCS1, конвертируем в PKCS8
    if (keyPem.includes("BEGIN RSA PRIVATE KEY")) {
      const privateKeyForge = forge.pki.privateKeyFromPem(keyPem);
      // Конвертируем в ASN.1 структуру PKCS8
      const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKeyForge);
      const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
      keyPem = forge.pki.privateKeyInfoToPem(privateKeyInfo);
    }

    // Импортируем приватный ключ в формате PKCS8
    const key = await importPKCS8(keyPem, "PS256");

    // Подписываем JWT используя PS256
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(key);

    console.log("Generated JWT token length:", token.length);
    console.log("Embed ID used:", embedId);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating DataLens token:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
