import React, { ReactNode, useMemo, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
} from "@heroui/react";
import { TickCircle } from "@/public";
import HexInputDiv from "./HexInputDiv";
import SegmentButtons from "./SegmentButtons";

type ColorPopoverProps = {
  trigger: () => JSX.Element;
  colorValue: string;
  setColorValue: (value: string) => void;
};

const primaryColorChoices = [
  "#6200EE",
  "#2962FF",
  "#00C853",
  "#D50000",
  "#FF6D00",
  "#AA00FF",
  "#0091EA",
  "#C51162",
  "#FFD600",
  "#00B8D4",
  "#1DE9B6",
  "#3D5AFE",
  "#E64A19",
  "#5D4037",
  "#607D8B",
];

const ColorPopover = ({
  trigger,
  colorValue,
  setColorValue,
}: ColorPopoverProps) => {
  const popoverTrigger = trigger;

  return (
    <Popover>
      <PopoverTrigger>{popoverTrigger()}</PopoverTrigger>
      <PopoverContent>
        <div className="bg-background p-2">
          <SegmentButtons
            colorValue={colorValue}
            setColorValue={setColorValue}
          />
          <HexInputDiv colorValue={colorValue} setColorValue={setColorValue} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPopover;
