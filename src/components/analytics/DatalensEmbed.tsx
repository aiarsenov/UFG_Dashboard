"use client";

type Props = {
  token?: string;
  width?: number | string;
  height?: number | string;
};

export function DatalensEmbed({ token, width = "100%", height = 800 }: Props) {
  // Токен должен быть передан через переменную окружения или пропс
  // Для продакшна: установите NEXT_PUBLIC_DATALENS_TOKEN в Vercel Environment Variables
  const resolvedToken =
    token || process.env.NEXT_PUBLIC_DATALENS_TOKEN || "";

  if (!resolvedToken) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Токен DataLens не настроен</p>
          <p className="text-sm text-gray-500">
            Установите переменную NEXT_PUBLIC_DATALENS_TOKEN
          </p>
        </div>
      </div>
    );
  }

  const src = `https://datalens.ru/embeds/dash#dl_embed_token=${encodeURIComponent(resolvedToken)}`;

  return (
    <iframe
      src={src}
      width={typeof width === "number" ? String(width) : width}
      height={typeof height === "number" ? String(height) : height}
      frameBorder={0}
      style={{ border: 0, background: "transparent", width: "100%" }}
      allow="fullscreen"
      title="DataLens Dashboard"
    />
  );
}


