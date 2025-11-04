import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const privateKey = process.env.DATALENS_PRIVATE_KEY;
  const embedId = process.env.DATALENS_EMBED_ID || "s49hscam1mbed";

  if (!privateKey) {
    return NextResponse.json(
      { error: "DATALENS_PRIVATE_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    // Генерируем подпись согласно документации DataLens
    // Формат: timestamp + embedId
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp}:${embedId}`;

    // Создаем подпись используя RSA SHA-256
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(message);
    sign.end();

    const signature = sign.sign(privateKey, "base64");

    // Формируем токен: timestamp:embedId:signature
    const token = `${message}:${signature}`;

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating DataLens token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

