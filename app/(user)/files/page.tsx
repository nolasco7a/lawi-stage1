"use client";
import { type DocumentFileType, DocumentViewer } from "@/components/document-viewer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDocumentStore } from "@/lib/store/documents";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useEffect } from "react";

const NoDocumentSelected = ({ filesSidebarOpen }: { filesSidebarOpen: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
      <div className="text-2xl mb-4">No document selected</div>
      <div className="mb-4">
        Please select a document from the sidebar to view its details.
        {!filesSidebarOpen && <SidebarTrigger />}
      </div>
    </div>
  );
};

/**
 * Maps the document `kind` field to a `DocumentFileType` for the viewer.
 * Artifacts use simple kinds like "text", "code", etc.
 * Uploaded files store the mimeType as kind (e.g. "application/pdf").
 */
function getFileType(kind: string, source?: string): DocumentFileType {
  // Artifacts (source === "model") use simple kind values
  if (source !== "user") {
    return kind === "text" ? "md" : (kind as DocumentFileType);
  }

  // Uploaded files: map mimeType to DocumentFileType
  const mime = kind.toLowerCase();
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("msword") || mime.includes("wordprocessingml")) return "docx";
  if (mime.includes("csv")) return "csv";
  if (mime.includes("markdown")) return "md";
  if (mime.includes("text/plain")) return "txt";

  // Fallback: try to infer from the kind string
  return "txt";
}

export default function FilesPage() {
  const { filesSidebarOpen } = useSettingsStore();
  const { selectedDocument, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    void fetchDocuments();
  }, []);

  return (
    <div className="h-full overflow-hidden">
      {selectedDocument ? (
        <DocumentViewer
          key={selectedDocument.id}
          filesSidebarOpen={filesSidebarOpen}
          initialEditing={selectedDocument.source === "model" && selectedDocument.kind === "text"}
          document={{
            id: selectedDocument.id,
            title: selectedDocument.title,
            kind: selectedDocument.kind,
            fileType: getFileType(selectedDocument.kind, selectedDocument.source),
            content: selectedDocument.content || "",
            fileUrl:
              selectedDocument.source === "user"
                ? selectedDocument.content || ""
                : selectedDocument.fileUrl || "",
          }}
          isReadonly={false}
        />
      ) : (
        <NoDocumentSelected filesSidebarOpen={filesSidebarOpen} />
      )}
    </div>
  );
}
