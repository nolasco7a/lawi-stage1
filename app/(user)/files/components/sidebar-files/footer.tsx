import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useDocumentStore } from "@/lib/store/documents";
import { FilePlus, Loader2, Upload } from "lucide-react";
import { useRef } from "react";

export function Footer() {
  const sidebarContext = useSidebar();
  const { createDocument, uploadDocument, uploading, activeTab } = useDocumentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadDocument(file);
    }
    // Clear the input so the same file could be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showCreateButton = activeTab === "artifacts";

  return (
    <SidebarFooter>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.md,.csv"
        className="hidden"
      />
      {sidebarContext.open ? (
        <div className="flex w-full gap-2">
          {showCreateButton && (
            <Button
              variant="ghost"
              className="flex-1"
              title="Crear archivo nuevo"
              onClick={createDocument}
            >
              <FilePlus strokeWidth={1.5} />
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            title="Subir archivo"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Upload strokeWidth={1.5} />
            )}
            {uploading && <span className="ml-1 text-xs">Subiendo...</span>}
          </Button>
        </div>
      ) : (
        <>
          {showCreateButton && (
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              title="Crear archivo nuevo"
              onClick={createDocument}
            >
              <FilePlus strokeWidth={1.5} />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="w-full"
            title="Subir archivo"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Upload strokeWidth={1.5} />
            )}
          </Button>
        </>
      )}
    </SidebarFooter>
  );
}
