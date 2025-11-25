"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTextIcon } from "lucide-react";
import Papa from "papaparse";
import { memo, useMemo } from "react";
import DataGrid from "react-data-grid";
import DocViewer from "react-doc-viewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Editor } from "./text-editor";
import { SidebarTrigger } from "./ui/sidebar";

export type DocumentFileType = "txt" | "md" | "csv" | "pdf" | "doc" | "docx";

interface DocumentViewerProps {
  document: {
    id: string;
    title: string;
    fileType: DocumentFileType;
    content?: string;
    fileUrl?: string;
  };
  isReadonly?: boolean;
  filesSidebarOpen?: boolean;
}

export function DocumentViewer({ document, filesSidebarOpen }: Readonly<DocumentViewerProps>) {
  // The ScrollArea now takes the available space and only it is scrollable, not the whole viewer.
  return (
    <div className="size-full">
      <div className="bg-muted min-h-24 border-b border-zinc-700 p-4">
        <DocumentHeader
          title={document.title}
          fileType={document.fileType}
          filesSidebarOpen={filesSidebarOpen || false}
        />
      </div>
      <ScrollArea className="bg-muted h-[calc(100vh-100px)]">
        <DocumentContent document={document} />
      </ScrollArea>
    </div>
  );
}

const DocumentHeader = memo(
  ({
    title,
    fileType,
    filesSidebarOpen,
  }: {
    title: string;
    fileType: DocumentFileType;
    filesSidebarOpen: boolean;
  }) => (
    <div className="">
      <div className="flex flex-row items-start sm:items-center gap-3">
        {!filesSidebarOpen && <SidebarTrigger />}
        <div className="text-muted-foreground">
          <FileTextIcon size={24} />
        </div>
        <div className="-translate-y-1 sm:translate-y-0 font-bold">{title}</div>
        <span className="text-xs text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
          {fileType}
        </span>
      </div>
    </div>
  ),
);

DocumentHeader.displayName = "DocumentHeader";

const DocumentContent = ({ document }: { document: DocumentViewerProps["document"] }) => {
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
        {document.fileType === "txt" && (
          <Editor
            content={document.content ?? ""}
            isCurrentVersion={true}
            currentVersionIndex={0}
            status="idle"
            suggestions={[]}
            onSaveContent={() => {
              console.info("onSaveContent");
            }}
          />
        )}

        {document.fileType === "md" && (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{document.content ?? ""}</ReactMarkdown>
          </div>
        )}

        {document.fileType === "csv" && csvData.length > 0 && (
          <div className="size-full">
            <DataGrid
              columns={csvColumns}
              rows={csvData}
              className="rdg-light dark:rdg-dark"
              style={{ height: "350px" }}
            />
          </div>
        )}

        {document.fileType === "csv" && csvData.length === 0 && document.content && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>Error parsing CSV data</div>
          </div>
        )}

        {(document.fileType === "pdf" ||
          document.fileType === "doc" ||
          document.fileType === "docx") &&
          document.fileUrl && (
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
          )}

        {(document.fileType === "pdf" ||
          document.fileType === "doc" ||
          document.fileType === "docx") &&
          !document.fileUrl && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div>No file URL provided for {document.fileType.toUpperCase()} document</div>
            </div>
          )}

        {!document.content && !document.fileUrl && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>No content available</div>
          </div>
        )}
      </div>
    </div>
  );
};
