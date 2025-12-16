"use client";

import { useEffect, useMemo, useState } from "react";

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
    const [iframeReady, setIframeReady] = useState(false);

    useEffect(() => {
        async function fetchToken() {
            try {
                const response = await fetch("/api/datalens/token");
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error ||
                        errorData.details ||
                        "Failed to fetch token"
                    );
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

    useEffect(() => {
        setIframeReady(false);
    }, [token]);

    const handleIframeLoad = () => {
        console.log("DataLens iframe loaded");
        setIframeReady(true);
    };

    const handleIframeError = () => {
        setLoadError("Ошибка загрузки iframe");
    };

    if (error) {
        return (
            <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <div className="text-center text-sm text-red-500">
                    <p className="mb-1 font-medium">Ошибка загрузки дашборда</p>
                    <p className="opacity-80">{error}</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <div className="text-center text-sm text-red-500">
                    <p className="mb-1 font-medium">Ошибка загрузки</p>
                    <p className="opacity-80">{loadError}</p>
                </div>
            </div>
        );
    }

    const src = useMemo(() => {
        if (!token) return null;

        // Возвращаем старый рабочий формат, который точно работал
        return `https://datalens.ru/embeds/dash#dl_embed_token=${encodeURIComponent(
            token
        )}`;
    }, [token]);

    const resolvedHeight = useMemo(() => {
        if (typeof height === "number") {
            return `${height}px`;
        }
        if (typeof height === "string") {
            return height;
        }
        return "800px";
    }, [height]);

    return (
        <div className="frame-container">
            {(!token || !iframeReady) && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff6a2b]/40 border-t-transparent" />
                </div>
            )}

            {src && (
                <iframe
                    src={src}
                    width={typeof width === "number" ? String(width) : width}
                    height={
                        typeof height === "number" ? String(height) : height
                    }
                    frameBorder={0}
                    style={{
                        border: 0,
                        background: "transparent",
                        width: "100%",
                    }}
                    className={`transition-opacity duration-300 ${iframeReady ? "opacity-100" : "opacity-0"
                        }`}
                    allow="fullscreen"
                    title="DataLens Dashboard"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                />
            )}
        </div>
    );
}
