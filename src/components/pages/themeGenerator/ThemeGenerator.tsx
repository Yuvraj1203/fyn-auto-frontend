"use client";
import { ColorPopover } from "@/components/common";
import React, { useEffect, useRef, useState } from "react";

type ColorBoxProps = {
  label: ColorKey;
  color: string;
  handleThemeColorsUpdate: (key: ColorKey, value: string) => void;
};

type ColorKey = keyof typeof colors.light;

type MainColorKey = keyof typeof mainColors;

const mainColors = {
  primary: "#2196F3",
  secondary: "#673AB7",
  tertiary: "#006c48",
};

const colors = {
  light: {
    primary: "#673AB7",
    onPrimary: "#ffffff",
    primaryContainer: "#EDE7F6",
    onPrimaryContainer: "#5E35B1",
    secondary: "#2196F3",
    onSecondary: "#ffffff",
    secondaryContainer: "#E3F2FD",
    onSecondaryContainer: "#1E88E5",
    tertiary: "#006c48",
    onTertiary: "#fff",
  },
  dark: {
    primary: "#673AB7",
    onPrimary: "#ffffff",
    primaryContainer: "#EDE7F6",
    onPrimaryContainer: "#5E35B1",
    secondary: "#2196F3",
    onSecondary: "#ffffff",
    secondaryContainer: "#E3F2FD",
    onSecondaryContainer: "#1E88E5",
  },
};

const ThemeGenerator = () => {
  const [themeMainColors, setThemeMainColors] = useState({ ...mainColors });
  const [themeColors, setThemeColors] = useState({ ...colors });

  const handleThemeMainColorsUpdate = (key: ColorKey, value: string) => {};

  const handleThemeColorsUpdate = (key: ColorKey, value: string) => {
    const currentThemeColors = { ...themeColors };
    currentThemeColors.light[key] = value;
    setThemeColors(currentThemeColors);
  };
  return (
    <>
      <h2 className="heading3 px-5 pt-3">{"Playground"}</h2>
      <div className="grid grid-cols-3 gap-4 p-5">
        {Object.entries(mainColors).map(([key, value]) => (
          <ColorBox
            label={key as ColorKey}
            color={value}
            handleThemeColorsUpdate={handleThemeMainColorsUpdate}
          />
        ))}
      </div>
      <h2 className="heading3 mx-5 ">{"Preview"}</h2>
      <div className="grid grid-cols-3 gap-4 p-5">
        {Object.entries(colors.light).map(([key, value]) => (
          <ColorBox
            label={key as ColorKey}
            color={value}
            handleThemeColorsUpdate={handleThemeColorsUpdate}
          />
        ))}
      </div>
    </>
  );
};

const getPairedColorKey = (key: ColorKey): ColorKey | undefined => {
  const pairMap: Record<ColorKey, ColorKey> = {
    primary: "onPrimary",
    onPrimary: "primary",
    secondary: "onSecondary",
    onSecondary: "secondary",
    primaryContainer: "onPrimaryContainer",
    onPrimaryContainer: "primaryContainer",
    secondaryContainer: "onSecondaryContainer",
    onSecondaryContainer: "secondaryContainer",
    tertiary: "onTertiary",
    onTertiary: "tertiary",
  };

  return pairMap[key];
};

const ColorBox = ({ label, color, handleThemeColorsUpdate }: ColorBoxProps) => {
  const [colorValue, setColorValue] = useState(color);
  const textColorKey = getPairedColorKey(label as ColorKey);
  const textColor = textColorKey ? colors.light[textColorKey] : "#000";

  useEffect(() => {
    handleThemeColorsUpdate(label, colorValue);
  }, [colorValue]);

  const ColorPickerDropDown = () => {
    return (
      <div
        key={label}
        className="min-w-24 rounded-lg overflow-hidden shadow-lightShadow cursor-pointer"
      >
        <div
          className={`min-w-24 h-14 rounded-b-lg flex justify-center py-2 shadow-sm duration-400`}
          style={{ backgroundColor: colorValue }}
        >
          <span className="font-semibold" style={{ color: textColor }}>
            {colorValue}
          </span>
        </div>
        <div className="min-w-24 p-1.5 rounded-lg overflow-hidden flex items-center justify-center font-semibold">
          <span>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <ColorPopover
      trigger={ColorPickerDropDown}
      colorValue={colorValue}
      setColorValue={setColorValue}
    />
  );
};

export default ThemeGenerator;
