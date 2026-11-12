export function resolveImageUrl(
  image: string | null,
  size: "thumb" | "full" = "full"
): string | null {
  if (!image) return null;
  const folder = size === "thumb" ? "products-thumb" : "products-full";
  const filename =
    size === "thumb" ? image.replace(/(\.[^.]+)$/, "@400w$1") : image;
  return `${import.meta.env.BASE_URL}menu/${folder}/${filename}`;
}
