import { Image } from "@heroui/react";
import React from "react";

type CustomImageProps = {
  src: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  className?: string;
};

const CustomImage = ({
  width = "auto",
  height = "auto",
  ...props
}: CustomImageProps) => {
  return (
    <Image
      src={props.src}
      width={width}
      height={height}
      alt={props.alt}
      className={props.className}
    />
  );
};

export default CustomImage;
