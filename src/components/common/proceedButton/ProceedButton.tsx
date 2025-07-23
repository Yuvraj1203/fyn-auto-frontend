import { Button } from "@heroui/react";
import React, { ReactNode } from "react";

type ProceedButtonProps = {
  loading?: boolean;
  buttonType?: "button" | "submit" | "reset" | undefined;
  content: string;
  onClick?: () => void;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
};

const ProceedButton = ({
  loading = false,
  buttonType = "button",
  content,
  onClick,
  startContent,
  endContent,
  className,
}: ProceedButtonProps) => {
  return (
    <div
      className={`bg-background border-t-1 border-surface px-5 py-4 sticky z-10 bottom-0 left-0 right-0 rounded-2xl ${className}`}
    >
      {startContent && startContent}
      <Button
        className="min-h-10 w-full"
        type={buttonType}
        color="primary"
        variant={"shadow"}
        size={"md"}
        onClick={() => onClick?.()}
        isLoading={loading}
      >
        {content}
      </Button>

      {endContent && endContent}
    </div>
  );
};

export default ProceedButton;
