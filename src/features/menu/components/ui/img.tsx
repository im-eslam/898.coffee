import { useState } from "react";
import { Icon } from "@/shared/icons";

interface ImgProps {
  src: string | null;
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
  placeholder: "absolute inset-0 flex items-center justify-center text-navy/20",
  placeholderIcon: "size-10",
} as const;

export function Img({ src, alt = "", priority, className }: ImgProps) {
  const [state, setState] = useState<ImageState>("loading");
  const [shownSrc, setShownSrc] = useState(src);

  if (shownSrc !== src) {
    setShownSrc(src);
    setState("loading");
  }

  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {src && state !== "broken" ? (
        <img
          src={src}
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
      ) : (
        <span className={styles.placeholder} aria-hidden="true">
          <Icon name="cup" className={styles.placeholderIcon} />
        </span>
      )}
    </div>
  );
}
