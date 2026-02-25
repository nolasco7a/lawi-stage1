"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Document } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import { FileTextIcon } from "lucide-react";
import { PenIcon, XIcon } from "lucide-react";
import mammoth from "mammoth";
import Papa from "papaparse";
import { memo, useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { useDebounceCallback } from "usehooks-ts";
import { CopyIcon } from "./icons";
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
  initialEditing?: boolean;
}

export function DocumentViewer({
  document,
  filesSidebarOpen,
  initialEditing = false,
}: Readonly<DocumentViewerProps>) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [localDocument, setLocalDocument] = useState<Document | null>(null);
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);

  // For uploaded files (content is a Blob URL),
  // fetch the actual text content for text-based file types
  const isUploadedTextFile =
    document.fileUrl &&
    (document.fileType === "txt" || document.fileType === "md" || document.fileType === "csv");

  useEffect(() => {
    if (isUploadedTextFile && document.fileUrl) {
      setFetchedContent(null);
      fetch(document.fileUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch file content");
          return res.text();
        })
        .then((text) => setFetchedContent(text))
        .catch((err) => {
          console.error("Error fetching file content:", err);
          setFetchedContent("");
        });
    }
  }, [isUploadedTextFile, document.fileUrl]);

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

  const { mutate } = useSWRConfig();
  const [_mode, _setMode] = useState<"edit" | "diff">("edit");

  const handleVersionChange = useCallback(
    (type: "next" | "prev" | "toggle" | "latest") => {
      if (!documents) return;

      if (type === "latest") {
        setCurrentVersionIndex(documents.length - 1);
        _setMode("edit");
      }

      if (type === "toggle") {
        _setMode((currentMode) => (currentMode === "edit" ? "diff" : "edit"));
      }

      if (type === "prev") {
        if (currentVersionIndex > 0) {
          setCurrentVersionIndex((index) => index - 1);
        }
      } else if (type === "next") {
        if (currentVersionIndex < documents.length - 1) {
          setCurrentVersionIndex((index) => index + 1);
        }
      }
    },
    [documents, currentVersionIndex],
  );

  const isCurrentVersion = documents ? currentVersionIndex === documents.length - 1 : true;

  const saveContentCallback = useCallback(
    async (updatedContent: string) => {
      try {
        const response = await fetch("/api/document", {
          method: "POST",
          body: JSON.stringify({
            id: document.id,
            title: document.title,
            kind: document.kind ?? "text",
            content: updatedContent,
          }),
        });

        if (!response.ok) throw new Error("Failed to save");

        mutate<Array<Document>>(
          `/api/document?id=${document.id}`,
          async (currentDocuments) => {
            if (currentDocuments && currentDocuments.length > 0) {
              const currentDocument = currentDocuments.at(-1);
              const newDoc: Document = {
                ...currentDocument!,
                content: updatedContent,
                createdAt: new Date(),
              };
              return [...currentDocuments, newDoc];
            }
            return currentDocuments;
          },
          { revalidate: false },
        );
      } catch (error) {
        console.error("Failed to save:", error);
        toast.error("Error al guardar");
      }
    },
    [document.id, document.title, document.kind, mutate],
  );

  const debouncedSave = useDebounceCallback(saveContentCallback, 1000);

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      if (debounce) {
        debouncedSave(updatedContent);
      } else {
        void saveContentCallback(updatedContent);
      }
    },
    [debouncedSave, saveContentCallback],
  );

  const getDocumentContentById = (index: number) => {
    if (!documents) return "";
    if (!documents[index]) return "";
    return documents[index].content ?? "";
  };

  // For uploaded text files, use fetched content; otherwise use the DB content
  const effectiveContent = isUploadedTextFile
    ? (fetchedContent ?? "Cargando...")
    : (localDocument?.content ?? document.content ?? "");

  const currentViewContent = isEditing
    ? isCurrentVersion
      ? effectiveContent
      : getDocumentContentById(currentVersionIndex)
    : effectiveContent;

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
    handleVersionChange: _handleVersionChange,
    isCurrentVersion: _isCurrentVersion,
    currentVersionIndex: _currentVersionIndex,
    contentToCopy,
  }: {
    title: string;
    fileType: DocumentFileType;
    filesSidebarOpen: boolean;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void;
    isCurrentVersion: boolean;
    currentVersionIndex: number;
    contentToCopy: string;
  }) => {
    const isTextBased = fileType === "txt" || fileType === "md";

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(contentToCopy);
        toast.success("Copiado al portapapeles");
      } catch (error) {
        console.error("Failed to copy:", error);
        toast.error("Error al copiar");
      }
    }, [contentToCopy]);

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!filesSidebarOpen && <SidebarTrigger />}
          <FileTextIcon size={20} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold truncate max-w-[300px]" title={title}>
            {title}
          </h2>
          <span className="text-xs text-muted-foreground uppercase font-mono">{fileType}</span>
        </div>
        <div className="flex gap-1">
          {isTextBased && (
            <TooltipProvider delayDuration={300}>
              {isEditing ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                      <XIcon size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cerrar editor</TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <PenIcon size={14} className="mr-1" />
                        Editar Inline
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Editar documento</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <CopyIcon size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copiar contenido</TooltipContent>
                  </Tooltip>
                </>
              )}
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  },
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
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxLoading, setDocxLoading] = useState(false);

  // Convert DOCX to HTML using mammoth
  useEffect(() => {
    if ((document.fileType === "docx" || document.fileType === "doc") && document.fileUrl) {
      setDocxLoading(true);
      fetch(document.fileUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
        .then((result) => {
          setDocxHtml(result.value);
          setDocxLoading(false);
        })
        .catch((err) => {
          console.error("Error converting DOCX:", err);
          setDocxHtml("<p>Error al cargar el documento</p>");
          setDocxLoading(false);
        });
    }
  }, [document.fileType, document.fileUrl]);

  const csvData = useMemo(() => {
    if (
      document.fileType === "csv" &&
      currentViewContent &&
      !currentViewContent.startsWith("/api/") &&
      !currentViewContent.startsWith("http")
    ) {
      try {
        const parsed = Papa.parse(currentViewContent, { header: true });
        return parsed.data as Record<string, string>[];
      } catch (error) {
        console.error("Error parsing CSV:", error);
        return [];
      }
    }
    return [];
  }, [document.fileType, currentViewContent]);

  const csvColumns = useMemo(() => {
    if (csvData.length > 0) {
      return Object.keys(csvData[0] as object);
    }
    return [];
  }, [csvData]);

  const getContainerClasses = () => {
    switch (document.fileType) {
      case "txt":
      case "md":
        return "w-4/6 p-4 mt-28 sm:px-8 sm:py-6 overflow-y-auto";
      case "csv":
        return "p-4 overflow-auto w-full";
      case "pdf":
      case "doc":
      case "docx":
        return "h-full w-full";
      default:
        return "";
    }
  };

  return (
    <div className="flex justify-center">
      <div className={getContainerClasses()}>
        {/* TXT / MD — editing */}
        {(document.fileType === "txt" || document.fileType === "md") && isEditing ? (
          <Editor
            content={currentViewContent}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status="idle"
            suggestions={[]}
            onSaveContent={saveContent}
          />
        ) : /* MD — preview */
        document.fileType === "md" ? (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentViewContent}</ReactMarkdown>
          </div>
        ) : /* TXT — preview */
        document.fileType === "txt" ? (
          <div className="whitespace-pre-wrap font-mono text-sm">{currentViewContent}</div>
        ) : /* CSV — styled table */
        document.fileType === "csv" && csvData.length > 0 ? (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/80 sticky top-0">
                <tr>
                  {csvColumns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap border-b border-border"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, i) => (
                  <tr
                    key={`row-${i}`}
                    className="border-b border-border/50 hover:bg-muted/40 transition-colors"
                  >
                    {csvColumns.map((col) => (
                      <td key={`${col}-${i}`} className="px-4 py-2.5 whitespace-nowrap">
                        {row[col] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : document.fileType === "csv" ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {currentViewContent === "Cargando..."
              ? "Cargando datos CSV..."
              : "Error al parsear datos CSV"}
          </div>
        ) : /* PDF — native browser iframe */
        document.fileType === "pdf" && document.fileUrl ? (
          <iframe
            src={document.fileUrl}
            title={document.title}
            className="w-full border-0"
            style={{ height: "calc(100vh - 80px)" }}
          />
        ) : /* DOCX — mammoth html */
        (document.fileType === "docx" || document.fileType === "doc") && document.fileUrl ? (
          docxLoading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Cargando documento...
            </div>
          ) : docxHtml ? (
            <div className="p-8 max-w-4xl mx-auto">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: docxHtml }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Error al cargar el documento
            </div>
          )
        ) : /* No content */
        !document.content && !document.fileUrl ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No hay contenido disponible
          </div>
        ) : null}
      </div>
    </div>
  );
};
