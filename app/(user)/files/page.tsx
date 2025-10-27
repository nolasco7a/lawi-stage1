"use client";
import { useDocumentStore } from "@/lib/store/documents";
import { DocumentViewer } from "@/components/document-viewer";
import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
      fetchDocuments().then(() => console.log("Documents loaded!"));
    }
  }, []);
  return (
    <div className="size-full">
      {!selectedDocument ? (
        <NoDocumentSelected filesSidebarOpen={filesSidebarOpen} />
      ) : (
        <DocumentViewer
          filesSidebarOpen={filesSidebarOpen}
          document={{
            id: selectedDocument.id,
            title: selectedDocument.title,
            fileType: selectedDocument.kind === "text" ? "md" : (selectedDocument.kind as any),
            content: selectedDocument.content || "",
            fileUrl: selectedDocument.fileUrl || "",
          }}
          isReadonly={false}
        />
      )}
    </div>
  );
}
