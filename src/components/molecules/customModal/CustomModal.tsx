import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { cloneElement, ReactElement, ReactNode } from "react";

type CustomModalProps = {
  title: ReactNode;
  content: ReactNode;
  closeButton?: boolean;
  actionButton?: string;
  actionButtonPress?: () => void;
  trigger: ReactElement;
};

const CustomModal = ({
  content,
  title,
  closeButton = true,
  actionButton,
  actionButtonPress,
  trigger,
}: CustomModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {cloneElement(trigger, { onPress: onOpen })}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          closeButton:
            "right-3 -top-10 md:-right-4 md:-top-4 bg-background shadow-fullShadow",
          base: "overflow-visible max-md:rounded-b-none max-md:m-0",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {title && (
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
              )}

              {content && <ModalBody>{content}</ModalBody>}
              <ModalFooter>
                {closeButton && (
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                )}
                {actionButton && (
                  <Button color="primary" onPress={actionButtonPress}>
                    {actionButton}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
