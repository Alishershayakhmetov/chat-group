import { useState, useEffect } from "react";

interface UserImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null; // Redefine `src` to allow `null`
  alt?: string;
}

export default function UserImage({ src, alt, ...props }: UserImageProps) {
  const [imgSrc, setImgSrc] = useState<string>("/user-solid.svg");

  // Update the image source when the `src` prop changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
    }
  }, [src]);

  const handleError = () => {
    setImgSrc("/user-solid.svg"); // Fallback to default SVG
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
}
