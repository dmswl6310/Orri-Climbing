// Keep this allowlist aligned with next.config.ts remotePatterns.
export function isSupportedImageSource(src: string) {
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("\\")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "picsum.photos" &&
      !url.port && !url.username && !url.password && url.pathname.startsWith("/seed/");
  } catch { return false; }
}
