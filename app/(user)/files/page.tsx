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

export default function FilesPage() {
  const { filesSidebarOpen } = useSettingsStore();
  const { documents, selectedDocument, documentsLoading, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    if (documents.length === 0 && !documentsLoading) {
      fetchDocuments().then(() => {});
    }
  }, [documents, documentsLoading, fetchDocuments]);
  return (
    <div className="size-full">
      {selectedDocument ? (
        <DocumentViewer
          filesSidebarOpen={filesSidebarOpen}
          document={{
            id: selectedDocument.id,
            title: selectedDocument.title,
            fileType:
              selectedDocument.kind === "text" ? "md" : (selectedDocument.kind as DocumentFileType),
            content: selectedDocument.content || "",
            fileUrl: selectedDocument.fileUrl || "",
          }}
          isReadonly={false}
        />
      ) : (
        <NoDocumentSelected filesSidebarOpen={filesSidebarOpen} />
      )}
    </div>
  );
}
