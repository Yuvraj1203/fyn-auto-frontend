import { TickCircle } from "@/public";
import { Input } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { ColorPopoverProps } from "./SegmentButtons";

const HexInputDiv = ({ colorValue, setColorValue }: ColorPopoverProps) => {
  const [inputValue, setInputValue] = useState(colorValue);

  useEffect(() => {
    setInputValue(colorValue);
  }, [colorValue]);

  const handleColorValue = useCallback(() => {
    const trimmed = inputValue.trim();
    if (
      trimmed.startsWith("#") &&
      trimmed !== colorValue &&
      trimmed.length > 3
    ) {
      setColorValue(trimmed);
    }
  }, [inputValue, colorValue, setColorValue]);

  return (
    <>
      <div className="flex items-center mx-2 gap-2">
        <Input
          size="sm"
          value={inputValue}
          startContent={"HEX"}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleColorValue();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          className="font-semibold text-outline "
          classNames={{
            input: "w-20",
            inputWrapper: "max-w-fit",
          }}
        />
        <span
          className="text-success cursor-pointer"
          onClick={handleColorValue}
        >
          <TickCircle />
        </span>
      </div>
    </>
  );
};

export default HexInputDiv;
