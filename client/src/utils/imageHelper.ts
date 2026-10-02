import tshirt from "../assets/images/tshirt.jpg";

export const DEFAULT_PRODUCT_IMAGE = tshirt;

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = DEFAULT_PRODUCT_IMAGE
) => {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
};
