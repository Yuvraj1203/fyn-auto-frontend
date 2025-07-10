import { Image } from "@heroui/react";
import React from "react";

export enum ImageType {
  png = "png",
  svg = "svg",
}

type CustomImageProps = {
  src: string | any;
  width?: number | string;
  height?: number | string;
  alt?: string;
  className?: string;
  type?: ImageType;
  color?: string;
};

const CustomImage = ({
  width = "auto",
  height = "auto",
  type = ImageType.png,
  ...props
}: CustomImageProps) => {
  if (type == ImageType.svg) {
    const Icon = props.src;
    return (
      <span className={`h-[${height}px] w-[${width}px] ${props.color}`}>
        <Icon />
      </span>
    );
  }
  return (
    <Image
      src={props.src}
      width={width}
      height={height}
      alt={props.alt}
      radius="none"
      className={`${props.className}`}
    />
  );
};

export default CustomImage;
