"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Document } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import { FileTextIcon } from "lucide-react";
import { PenIcon, XIcon } from "lucide-react";
import Papa from "papaparse";
import { memo, useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import DocViewer from "react-doc-viewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { useDebounceCallback } from "usehooks-ts";
import { CopyIcon, RedoIcon, UndoIcon } from "./icons";
import { Editor } from "./text-editor";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export type DocumentFileType = "txt" | "md" | "csv" | "pdf" | "doc" | "docx";

interface DocumentViewerProps {
  document: {
    id: string;
    title: string;
    fileType: DocumentFileType;
    kind?: string;
    content?: string;
    fileUrl?: string;
  };
  isReadonly?: boolean;
  filesSidebarOpen?: boolean;
}

export function DocumentViewer({ document, filesSidebarOpen }: Readonly<DocumentViewerProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [localDocument, setLocalDocument] = useState<Document | null>(null);

  const {
    data: documents,
    isLoading: _isDocumentsFetching,
    mutate: _mutateDocuments,
  } = useSWR<Array<Document>>(document.id ? `/api/document?id=${document.id}` : null, fetcher);

  useEffect(() => {
    if (documents && documents.length > 0) {
      const mostRecentDocument = documents.at(-1);

      if (mostRecentDocument) {
        setLocalDocument(mostRecentDocument);
        setCurrentVersionIndex(documents.length - 1);
      }
    }
  }, [documents]);

  const isCurrentVersion =
    documents && documents.length > 0 ? currentVersionIndex === documents.length - 1 : true;

  const { mutate } = useSWRConfig();
  const [_isContentDirty, setIsContentDirty] = useState(false);

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!document.id) return;

      mutate<Array<Document>>(
        `/api/document?id=${document.id}`,
        async (currentDocuments) => {
          if (!currentDocuments) return undefined;

          const currentDoc = currentDocuments.at(-1);

          if (!currentDoc || !currentDoc.content) {
            setIsContentDirty(false);
            return currentDocuments;
          }

          if (currentDoc.content !== updatedContent) {
            await fetch(`/api/document?id=${document.id}`, {
              method: "POST",
              body: JSON.stringify({
                title: document.title,
                content: updatedContent,
                kind: document.kind || "text",
              }),
            });

            setIsContentDirty(false);

            const newDocument = {
              ...currentDoc,
              content: updatedContent,
              createdAt: new Date(),
            };

            return [...currentDocuments, newDocument];
          }
          return currentDocuments;
        },
        { revalidate: false },
      );
    },
    [document.id, document.title, document.kind, mutate],
  );

  const debouncedHandleContentChange = useDebounceCallback(handleContentChange, 2000);

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      // Allow saving if standard document content changes
      if (updatedContent !== (localDocument?.content ?? document.content)) {
        setIsContentDirty(true);

        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      }
    },
    [localDocument, document.content, debouncedHandleContentChange, handleContentChange],
  );

  const handleVersionChange = (type: "next" | "prev" | "latest") => {
    if (!documents) return;

    if (type === "latest") {
      setCurrentVersionIndex(documents.length - 1);
    } else if (type === "prev" && currentVersionIndex > 0) {
      setCurrentVersionIndex((index) => index - 1);
    } else if (type === "next" && currentVersionIndex < documents.length - 1) {
      setCurrentVersionIndex((index) => index + 1);
    }
  };

  const getDocumentContentById = (index: number) => {
    if (!documents) return "";
    if (!documents[index]) return "";
    return documents[index].content ?? "";
  };

  const currentViewContent = isEditing
    ? isCurrentVersion
      ? (localDocument?.content ?? document.content ?? "")
      : getDocumentContentById(currentVersionIndex)
    : (localDocument?.content ?? document.content ?? "");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-muted border-b border-zinc-700 p-4 flex-shrink-0">
        <DocumentHeader
          title={document.title}
          fileType={document.fileType}
          filesSidebarOpen={filesSidebarOpen || false}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isCurrentVersion={isCurrentVersion}
          currentVersionIndex={currentVersionIndex}
          handleVersionChange={handleVersionChange}
          contentToCopy={currentViewContent}
        />
      </div>
      <ScrollArea className="bg-muted flex-1">
        <DocumentContent
          document={document}
          isEditing={isEditing}
          currentViewContent={currentViewContent}
          isCurrentVersion={isCurrentVersion}
          currentVersionIndex={currentVersionIndex}
          saveContent={saveContent}
        />
      </ScrollArea>
    </div>
  );
}

const DocumentHeader = memo(
  ({
    title,
    fileType,
    filesSidebarOpen,
    isEditing,
    setIsEditing,
    isCurrentVersion,
    currentVersionIndex,
    handleVersionChange,
    contentToCopy,
  }: {
    title: string;
    fileType: DocumentFileType;
    filesSidebarOpen: boolean;
    isEditing: boolean;
    setIsEditing: (v: boolean) => void;
    isCurrentVersion: boolean;
    currentVersionIndex: number;
    handleVersionChange: (type: "next" | "prev" | "latest") => void;
    contentToCopy: string;
  }) => (
    <div className="flex flex-row items-center justify-between w-full h-8">
      <div className="flex flex-row items-start sm:items-center gap-3">
        {!filesSidebarOpen && <SidebarTrigger />}
        <div className="text-muted-foreground">
          <FileTextIcon size={24} />
        </div>
        <div className="-translate-y-1 sm:translate-y-0 font-bold max-w-[200px] md:max-w-[400px] truncate">
          {title}
        </div>
        <span className="text-xs text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
          {fileType}
        </span>
      </div>

      {(fileType === "md" || fileType === "txt") && (
        <div className="flex flex-row gap-1 items-center">
          {isEditing ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleVersionChange("prev")}
                    disabled={currentVersionIndex <= 0}
                  >
                    <UndoIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Versión anterior</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleVersionChange("next")}
                    disabled={isCurrentVersion}
                  >
                    <RedoIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Versión siguiente</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(contentToCopy);
                      toast.success("Copiado al portapapeles");
                    }}
                  >
                    <CopyIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copiar</TooltipContent>
              </Tooltip>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleVersionChange("latest");
                  setIsEditing(false);
                }}
                className="ml-2 flex gap-1 text-muted-foreground hover:text-foreground"
              >
                <XIcon size={16} />
                <span>Cerrar</span>
              </Button>
            </TooltipProvider>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex gap-2"
            >
              <PenIcon size={16} />
              <span>Editar Inline</span>
            </Button>
          )}
        </div>
      )}
    </div>
  ),
);

DocumentHeader.displayName = "DocumentHeader";

const DocumentContent = ({
  document,
  isEditing,
  currentViewContent,
  isCurrentVersion,
  currentVersionIndex,
  saveContent,
}: {
  document: DocumentViewerProps["document"];
  isEditing: boolean;
  currentViewContent: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  saveContent: (updatedContent: string, debounce: boolean) => void;
}) => {
  const csvData = useMemo(() => {
    if (document.fileType === "csv" && document.content) {
      try {
        const parsed = Papa.parse(document.content, { header: true });
        return parsed.data;
      } catch (error) {
        console.error("Error parsing CSV:", error);
        return [];
      }
    }
    return [];
  }, [document.fileType, document.content]);

  const csvColumns = useMemo(() => {
    if (csvData.length > 0) {
      return Object.keys(csvData[0] as object).map((key) => ({
        key,
        name: key,
        resizable: true,
      }));
    }
    return [];
  }, [csvData]);

  const getContainerClasses = () => {
    switch (document.fileType) {
      case "txt":
      case "md":
        return "w-4/6 p-4 mt-28 sm:px-8 sm:py-6 overflow-y-auto";
      case "csv":
        return "p-4 min-h-[400px] overflow-auto";
      case "pdf":
      case "doc":
      case "docx":
        return "min-h-[500px]";
      default:
        return "";
    }
  };

  return (
    <div className={"flex justify-center"}>
      <div className={getContainerClasses()}>
        {(document.fileType === "txt" || document.fileType === "md") && isEditing ? (
          <Editor
            content={currentViewContent}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status="idle"
            suggestions={[]}
            onSaveContent={saveContent}
          />
        ) : document.fileType === "md" ? (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentViewContent}</ReactMarkdown>
          </div>
        ) : document.fileType === "txt" ? (
          <div className="whitespace-pre-wrap">{currentViewContent}</div>
        ) : document.fileType === "csv" && csvData.length > 0 ? (
          <div className="size-full">
            <DataGrid
              columns={csvColumns}
              rows={csvData}
              className="rdg-light dark:rdg-dark"
              style={{ height: "350px" }}
            />
          </div>
        ) : document.fileType === "csv" && csvData.length === 0 && document.content ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>Error parsing CSV data</div>
          </div>
        ) : (document.fileType === "pdf" ||
            document.fileType === "doc" ||
            document.fileType === "docx") &&
          document.fileUrl ? (
          <DocViewer
            documents={[{ uri: document.fileUrl }]}
            className="size-full"
            config={{
              header: {
                disableHeader: true,
              },
            }}
            style={{ height: "500px" }}
          />
        ) : (document.fileType === "pdf" ||
            document.fileType === "doc" ||
            document.fileType === "docx") &&
          !document.fileUrl ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>No file URL provided for {document.fileType.toUpperCase()} document</div>
          </div>
        ) : !document.content && !document.fileUrl ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>No content available</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
