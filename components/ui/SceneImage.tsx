"use client";

import Image from "next/image";
import { useState } from "react";

type SceneImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  /** Image au-dessus de la ligne de flottaison (hero) : chargement prioritaire. */
  priority?: boolean;
  /** Cadrage de l’image (CSS object-position), utile sur mobile. */
  position?: string;
  className?: string;
};

/**
 * Visuel plein cadre avec fallback en dégradé sombre.
 * Si l'image est absente ou ne charge pas, seul le dégradé reste visible.
 */
export function SceneImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  position = "center",
  className = "",
}: SceneImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div aria-hidden="true" className="scene-fallback absolute inset-0" />
      {failed ? null : (
        <Image
          ref={(img) => {
            // L'erreur a pu survenir avant l'hydratation : on la rattrape ici.
            if (img?.complete && img.naturalWidth === 0) setFailed(true);
          }}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          style={{ objectPosition: position }}
          className="object-cover text-transparent"
        />
      )}
    </div>
  );
}
