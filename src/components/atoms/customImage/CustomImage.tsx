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
  onClick?: () => void;
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
      <span
        onClick={props.onClick}
        className={`h-[${height}px] w-[${width}px] ${props.className}`}
      >
        <Icon />
      </span>
    );
  }
  return (
    <Image
      onClick={props.onClick}
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
