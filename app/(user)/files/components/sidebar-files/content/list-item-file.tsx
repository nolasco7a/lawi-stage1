"use client";

import ActionDialog from "@/components/action-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { Document } from "@/lib/db/schema";
import { useDocumentStore } from "@/lib/store/documents";
import { cn } from "@/lib/utils";
import {
  Code2,
  FileImage,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ListItemFileProps {
  document: Document;
}

const KIND_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  text: {
    icon: <FileText size={16} />,
    label: "Texto",
  },
  code: {
    icon: <Code2 size={16} />,
    label: "Código",
  },
  image: {
    icon: <FileImage size={16} />,
    label: "Imagen",
  },
  sheet: {
    icon: <FileSpreadsheet size={16} />,
    label: "Hoja",
  },
};

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ListItemFile({ document }: ListItemFileProps) {
  const { selectedDocument, setSelectedDocument, renameDocument, deleteDocument } =
    useDocumentStore();
  const isSelected = selectedDocument?.id === document.id;

  const isUploadedFile = document.source === "user";
  let icon = KIND_CONFIG.text.icon;
  let label = "Archivo";

  if (isUploadedFile) {
    const mimeType = document.kind.toLowerCase();
    if (mimeType.includes("pdf")) {
      icon = <FileText size={16} />;
      label = "PDF";
    } else if (mimeType.includes("image")) {
      icon = <FileImage size={16} />;
      label = "Imagen";
    } else if (
      mimeType.includes("csv") ||
      mimeType.includes("sheet") ||
      mimeType.includes("excel")
    ) {
      icon = <FileSpreadsheet size={16} />;
      label = "Hoja";
    } else {
      icon = <FileText size={16} />;
      label = "Archivo";
    }
  } else {
    const config = KIND_CONFIG[document.kind] ?? KIND_CONFIG.text;
    icon = config.icon;
    label = config.label;
  }

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(document.title);

  const handleSelect = () => {
    setSelectedDocument({
      id: document.id,
      title: document.title,
      kind: document.kind,
      content: document.content ?? undefined,
      source: document.source as "model" | "user",
      // For uploaded files, `content` stores the file URL path
      fileUrl: document.source === "user" ? (document.content ?? undefined) : undefined,
    });
  };

  const handleRename = async () => {
    await renameDocument(document.id, newTitle);
    setShowRenameDialog(false);
  };

  const handleDelete = async () => {
    await deleteDocument(document.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <SidebarMenuItem
        className={cn(
          "cursor-pointer rounded-md transition-colors",
          isSelected ? "bg-card" : "hover:bg-card",
        )}
        onClick={handleSelect}
      >
        <SidebarMenuButton
          asChild
          className="h-auto py-2 hover:bg-transparent active:bg-transparent"
        >
          <div className="flex items-start gap-2 w-full min-w-0">
            {/* Icon — rounded container aligned to first text line */}
            <span className="shrink-0 flex self-start justify-center size-[22px] rounded-md bg-accent/10 text-accent mt-[2px]">
              {icon}
            </span>

            {/* Text content */}
            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
              <span
                className="text-sm font-medium leading-tight w-full"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={document.title}
              >
                {document.title || "Sin título"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 flex-shrink-0">
                <span className="text-[10px] text-muted-foreground">{label}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatDate(document.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </SidebarMenuButton>

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal size={14} />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-36">
            <DropdownMenuItem
              className="gap-2 text-sm"
              onSelect={() => {
                setNewTitle(document.title);
                setShowRenameDialog(true);
              }}
            >
              <Pencil size={14} className="text-muted-foreground" />
              <span>Renombrar</span>
            </DropdownMenuItem>

            {isUploadedFile && document.content && (
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer"
                onSelect={() => {
                  window.open(document.content ?? "", "_blank");
                }}
              >
                <FileText size={14} className="text-muted-foreground" />
                <span>Descargar</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="gap-2 text-sm text-destructive focus:text-destructive"
              onSelect={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={14} />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Rename Dialog */}
      <ActionDialog
        openModal={showRenameDialog}
        setOpenModal={setShowRenameDialog}
        title="Renombrar documento"
        description="Ingresa un nuevo nombre para el documento."
        action={handleRename}
        actionText="Renombrar"
        cancelText="Cancelar"
        customContent={
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nuevo nombre del documento"
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleRename();
            }}
          />
        }
      />

      {/* Delete Dialog */}
      <ActionDialog
        openModal={showDeleteDialog}
        setOpenModal={setShowDeleteDialog}
        title="¿Eliminar documento?"
        description="Esta acción no se puede deshacer. El documento será eliminado permanentemente."
        action={handleDelete}
        actionText="Eliminar"
        cancelText="Cancelar"
      />
    </>
  );
}
