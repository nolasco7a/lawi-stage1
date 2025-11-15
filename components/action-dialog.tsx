import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type React from "react";

interface ActionDialogProps {
  openModal: boolean;
  // conversationId?: string;
  button?: boolean;
  icon?: React.ReactNode;
  buttonText?: string;
  title: string;
  description?: string;
  action: () => void;
  cancelText: string;
  actionText: string;
  // errorAction?: string;
  setOpenModal: (open: boolean) => void;
  children?: React.ReactNode;
  customContent?: React.ReactNode;
}

const ActionDialog = ({
  openModal = false,
  button = false,
  icon,
  buttonText,
  title,
  description,
  action,
  actionText,
  cancelText,
  setOpenModal,
  children,
  customContent,
}: ActionDialogProps) => {
  const handleAction = async () => {
    action();
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      {button && (
        <DialogTrigger asChild>
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {icon}
            {buttonText}
          </div>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            {children}
          </DialogDescription>
        </DialogHeader>
        {customContent && <div className="py-4">{customContent}</div>}
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              handleAction();
            }}
          >
            {actionText}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {cancelText}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
