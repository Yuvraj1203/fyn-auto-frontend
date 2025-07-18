import { Button } from "@heroui/react";
import React from "react";

type ProceedButtonProps = {
  loading?: boolean;
  buttonType?: "button" | "submit" | "reset" | undefined;
  content: string;
  onClick?: () => void;
};

const ProceedButton = ({
  loading = false,
  buttonType = "button",
  content,
  onClick,
}: ProceedButtonProps) => {
  return (
    <div className="bg-background border-t-1 border-surface px-5 py-4 sticky z-10 bottom-0 left-0 right-0 rounded-2xl">
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
    </div>
  );
};

export default ProceedButton;
