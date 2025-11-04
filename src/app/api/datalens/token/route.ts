import { NextResponse } from "next/server";
import crypto from "crypto";

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

    // Генерируем подпись согласно документации DataLens
    // Формат: timestamp:embedId:signature (НЕ JWT!)
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp}:${embedId}`;

    // Создаем подпись используя RSA SHA-256
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(message, "utf8");
    sign.end();

    const signature = sign.sign(privateKey, "base64");

    // Формируем токен: timestamp:embedId:signature (без переносов строк)
    const token = `${message}:${signature}`.replace(/\n/g, "").replace(/\r/g, "");

    console.log("Generated token length:", token.length);
    console.log("Embed ID used:", embedId);
    console.log("Token format:", `${timestamp}:${embedId}:${signature.substring(0, 20)}...`);

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

