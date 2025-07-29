import { Input, Select, SelectItem } from "@heroui/react";
import React from "react";

export enum CustomTextInputType {
  text = "text",
  number = "number",
  email = "email",
  password = "password",
  select = "select",
}

// Define the props for FormTextInput without generics
export type CustomTextInputProps<T> = {
  label?: string;
  type?: CustomTextInputType;
  selectItems?: T[]; //mandatory for select and has 'key' key in object
  selectedValue?: T | null; //mandatory for select
  handleSelectItemChange?: (value: string | number) => void; //mandatory for select
  displayKey?: keyof T; //mandatory for select
  isRequired?: boolean;
  style?: string;
  containerStyle?: string;
  isReadOnly?: boolean;
  errorMessage?: string;
};

const CustomTextInput = <T extends Record<string, any>>({
  label,
  type = CustomTextInputType.text,
  selectItems = [],
  selectedValue,
  handleSelectItemChange,
  displayKey = "label",
  isRequired = false,
  style,
  containerStyle,
  isReadOnly = false,
  errorMessage,
}: CustomTextInputProps<T>) => {
  return (
    <>
      <div
        className={`${containerStyle} flex w-full flex-wrap md:flex-nowrap gap-4`}
      >
        {type == CustomTextInputType.select ? (
          <Select
            isRequired={isRequired}
            label={label}
            size={"sm"}
            errorMessage={errorMessage}
            isInvalid={errorMessage ? true : false}
            selectedKeys={selectedValue?.key ? [selectedValue.key] : []}
            onChange={(e) => handleSelectItemChange?.(e.target.value)}
            className={style}
            classNames={{
              trigger:
                "bg-background data-[hover=true]:bg-background group-data-[focus=true]:bg-background !shadow-lightShadow",
            }}
          >
            {selectItems!.map((item: T, index: number) => (
              <SelectItem key={item.key}>{item[displayKey]}</SelectItem>
            ))}
          </Select>
        ) : (
          <Input
            isRequired={isRequired}
            label={label ? label : null}
            type={type}
            variant={"flat"}
            size={"sm"}
            isReadOnly={isReadOnly}
            classNames={{
              inputWrapper:
                "bg-background data-[hover=true]:bg-background group-data-[focus=true]:bg-background !shadow-lightShadow",
            }}
            className={style}
            errorMessage={errorMessage}
            isInvalid={errorMessage ? true : false}
            spellCheck={"false"}
          />
        )}
      </div>
    </>
  );
};

export default CustomTextInput;
