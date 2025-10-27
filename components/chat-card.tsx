import type { Chat } from "@/lib/db/schema";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import { useChatStore } from "@/lib/store/chat";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle,
  ClipboardCopy,
  Edit,
  Globe,
  Lock,
  MoreHorizontal,
  Share,
  Trash,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ActionDialog from "@/components/action-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ChatCard({
  chat,
  showCaseTag = false,
}: {
  chat: Chat;
  showCaseTag?: boolean;
}) {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibilityType: chat.visibility,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  const { deleteChat, renameChat } = useChatStore();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteChat(deleteId);
    } catch (error) {
      // Error handling is done in the store
    }

    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const handleRename = async () => {
    if (!renameId || !newTitle.trim()) return;

    try {
      await renameChat(renameId, newTitle.trim());
    } catch (error) {
      // Error handling is done in the store
    }

    setShowRenameDialog(false);
    setRenameId(null);
    setNewTitle("");
  };

  const openDeleteDialog = (chatId: string) => {
    setDeleteId(chatId);
    setShowDeleteDialog(true);
  };

  const openRenameDialog = (chatId: string, currentTitle: string) => {
    setRenameId(chatId);
    setNewTitle(currentTitle);
    setShowRenameDialog(true);
  };

  return (
    <div className="w-full border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <Link
            href={`/chat/${chat.id}`}
            className="text-base md:text-lg font-medium hover:underline block truncate"
          >
            {chat.title}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(chat.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </span>
            <div className="flex items-center gap-1">
              {visibilityType === "public" ? (
                <>
                  <Globe size={14} />
                  <span>Público</span>
                  <div
                    onClick={() =>
                      copyToClipboard(`${window.location.origin}/chat/${chat.id}`, toast)
                    }
                    className="flex flex-direction-row ml-4 gap-1 items-center cursor-pointer hover:underline"
                  >
                    <ClipboardCopy size={14} />
                    Copiar enlace
                  </div>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Privado</span>
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openRenameDialog(chat.id, chat.title);
              }}
              className="cursor-pointer"
            >
              <Edit size={16} />
              <span>Renombrar</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Share size={16} />
                <span>Compartir</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisibilityType("private");
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Lock size={12} />
                      <span>Privado</span>
                    </div>
                    {visibilityType === "private" && <CheckCircle size={16} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisibilityType("public");
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Globe size={12} />
                      <span>Público</span>
                    </div>
                    {visibilityType === "public" && <CheckCircle size={16} />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openDeleteDialog(chat.id);
              }}
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive"
            >
              <Trash size={16} />
              <span>Borrar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Dialog */}
      <ActionDialog
        openModal={showDeleteDialog}
        setOpenModal={setShowDeleteDialog}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente tu chat y lo removerá de nuestros servidores."
        action={handleDelete}
        actionText="Borrar"
        cancelText="Cancelar"
      />

      {/* Rename Dialog */}
      <ActionDialog
        openModal={showRenameDialog}
        setOpenModal={setShowRenameDialog}
        title="Renombrar Chat"
        description="Ingresa un nuevo nombre para tu chat."
        action={handleRename}
        actionText="Renombrar"
        cancelText="Cancelar"
        customContent={
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nuevo título del chat"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleRename();
              }
            }}
          />
        }
      />
    </div>
  );
}
