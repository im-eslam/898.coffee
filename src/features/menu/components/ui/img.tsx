import { useState } from "react";

interface ImgProps {
  image: string | null;
  alt?: string;
  priority?: boolean;
  className?: string;
}

type ImageState = "loading" | "loaded" | "broken";

const styles = {
  frame: "relative overflow-hidden bg-arctic/40",
  photo:
    "absolute inset-0 size-full object-cover transition-opacity duration-(--duration-interactive) ease-smooth motion-reduce:transition-none",
  shown: "opacity-100",
  hidden: "opacity-0",
} as const;

export function Img({ image, alt = "", priority, className }: ImgProps) {
  const [state, setState] = useState<ImageState>("loading");
  const [shownImage, setShownImage] = useState(image);
  const imageSrc = image
    ? `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`
    : null;

  if (shownImage !== image) {
    setShownImage(image);
    setState("loading");
  }

  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {image && state !== "broken" && (
        <img
          key={imageSrc}
          src={imageSrc ?? undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          draggable={false}
          onLoad={() => setState("loaded")}
          onError={() => setState("broken")}
          className={`${styles.photo} ${
            state === "loaded" ? styles.shown : styles.hidden
          }`}
        />
      )}
    </div>
  );
}
