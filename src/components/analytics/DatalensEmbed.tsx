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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/datalens/token");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || "Failed to fetch token");
        }
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
        } else {
          setError(data.error || "Token not received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching DataLens token:", err);
      }
    }

    fetchToken();
  }, []);

  const handleIframeLoad = () => {
    // Проверяем, загрузился ли iframe
    console.log("DataLens iframe loaded");
  };
  
  const src = `https://datalens.ru/embeds/dash#dl_embed_token=${encodeURIComponent(token)}`;
  
  console.log("DataLens iframe src:", src.substring(0, 100) + "...");

  const handleIframeError = () => {
    setLoadError("Ошибка загрузки iframe");
  };

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

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Ошибка загрузки</p>
          <p className="text-sm text-gray-500">{loadError}</p>
        </div>
      </div>
    );
  }

  const src = `https://datalens.ru/embeds/dash/${dashboardId || "s49hscam1mbed"}?dl_embed_token=${encodeURIComponent(token)}`;

  return (
    <div className="w-full">
      <iframe
        src={src}
        width={typeof width === "number" ? String(width) : width}
        height={typeof height === "number" ? String(height) : height}
        frameBorder={0}
        style={{ border: 0, background: "transparent", width: "100%" }}
        allow="fullscreen"
        title="DataLens Dashboard"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
}


