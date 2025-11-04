"use client";

type Props = {
  token?: string;
  width?: number | string;
  height?: number | string;
};

export function DatalensEmbed({ token, width = "100%", height = 800 }: Props) {
  const resolvedToken =
    token || process.env.NEXT_PUBLIC_DATALENS_TOKEN || "<TOKEN>";

  const src = `https://datalens.ru/embeds/dash#dl_embed_token=${resolvedToken}`;

  return (
    <iframe
      src={src}
      width={typeof width === "number" ? String(width) : width}
      height={typeof height === "number" ? String(height) : height}
      frameBorder={0}
      style={{ border: 0, background: "transparent" }}
      allow="fullscreen"
    />
  );
}


