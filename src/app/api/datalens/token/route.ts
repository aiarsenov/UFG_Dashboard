import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export async function GET() {
  let privateKey = process.env.DATALENS_PRIVATE_KEY;
  let embedId = process.env.DATALENS_EMBED_ID || "s49hscam1mbed";

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
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: embedId, // issuer - идентификатор эмбеддинга
      sub: embedId, // subject - идентификатор дашборда
      iat: now, // issued at
      exp: now + 3600, // expiration (1 час)
    };

    // Подписываем JWT используя RSA
    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
    });

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

