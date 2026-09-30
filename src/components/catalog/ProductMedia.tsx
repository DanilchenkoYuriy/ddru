import Image from "next/image";
import type { ProductImage } from "@/types/product";
export function ProductMedia({
  image,
  label,
  index = "01",
  priority = false,
}: {
  image: ProductImage | null;
  label: string;
  index?: string;
  priority?: boolean;
}) {
  return (
    <div className="product-media">
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 620px"
          preload={priority}
          className="product-image"
        />
      ) : (
        <div
          className="media-placeholder"
          role="img"
          aria-label={`${label}: фотография готовится`}
        >
          <span className="media-index" aria-hidden="true">
            {index}
          </span>
          <span className="media-name">{label}</span>
          <span className="media-caption">
            Фотография готовится <span aria-hidden="true">↗</span>
          </span>
        </div>
      )}
    </div>
  );
}
