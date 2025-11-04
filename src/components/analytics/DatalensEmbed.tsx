"use client";

import { useEffect, useState } from "react";

type Props = {
  dashboardId?: string;
  width?: number | string;
  height?: number | string;
};

export function DatalensEmbed({
  dashboardId,
  width = "100%",
  height = 800,
}: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/datalens/token");
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
        } else {
          setError(data.error || "Token not received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    fetchToken();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Ошибка загрузки дашборда</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  const src = `https://datalens.ru/embeds/dash#dl_embed_token=${encodeURIComponent(token)}`;

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


