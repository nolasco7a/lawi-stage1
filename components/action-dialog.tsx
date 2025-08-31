import { toast } from "sonner"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React from "react";

interface ActionDialogProps {
  openModal: boolean
  conversationId?: string
  button?: boolean
  icon?: React.ReactNode
  buttonText?: string
  title: string
  description?: string,
  action: () => void,
  cancelText: string,
  actionText: string,
  errorAction?: string,
  setOpenModal: (open: boolean) => void,
  children?: React.ReactNode
  customContent?: React.ReactNode
}

const ActionDialog = (
  {openModal = false,
    button = false,
    icon,
    buttonText,
    title,
    description,
    action,
    actionText,
    cancelText,
    errorAction,
    setOpenModal,
    children,
    customContent
  }: ActionDialogProps) => {

  const handleAction = async () => {
    try {
      action()
    } catch (error) {
      toast.error(errorAction || "Ocurrió un error, por favor intenta de nuevo.")
    }
  }
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
        {customContent && (
          <div className="py-4">
            {customContent}
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <Button variant="destructive" onClick={() => {
            handleAction().then(() => console.log("action handled executed"))
          }}>{actionText}</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {cancelText}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ActionDialog