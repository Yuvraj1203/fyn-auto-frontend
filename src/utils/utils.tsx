import { addToast } from "@heroui/react";

type SnackbarEnum =
  | "success"
  | "default"
  | "foreground"
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | undefined;

export const showSnackbar = (
  msg: string,
  type: SnackbarEnum | undefined = "default",
  delay: number = 0
) => {
  addToast({
    title: msg,
    color: type,
    promise: new Promise((resolve) => setTimeout(resolve, delay)),
  });
};
