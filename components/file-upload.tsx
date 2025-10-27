"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Upload, X, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateFileType, validateFileSize } from "@/lib/vectorization";

interface FileUploadProps {
  caseId: string;
  onFileUploaded?: () => void;
  className?: string;
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

export function FileUpload({ caseId, onFileUploaded, className }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      const uploadId = Math.random().toString(36).substring(7);

      // Add to uploading files
      setUploadingFiles((prev) => [
        ...prev,
        {
          file,
          id: uploadId,
          progress: 0,
          status: "uploading",
        },
      ]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/cases/${caseId}/files`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Update status to success
          setUploadingFiles((prev) =>
            prev.map((uf) =>
              uf.id === uploadId ? { ...uf, progress: 100, status: "success" as const } : uf,
            ),
          );

          toast.success(`Archivo ${file.name} subido exitosamente`);
          onFileUploaded?.();

          // Remove from list after delay
          setTimeout(() => {
            setUploadingFiles((prev) => prev.filter((uf) => uf.id !== uploadId));
          }, 2000);
        } else {
          const errorData = await response.text();
          throw new Error(errorData);
        }
      } catch (error) {
        console.error("Upload error:", error);

        // Update status to error
        setUploadingFiles((prev) =>
          prev.map((uf) => (uf.id === uploadId ? { ...uf, status: "error" as const } : uf)),
        );

        toast.error(`Error al subir ${file.name}`);
      }
    },
    [caseId, onFileUploaded],
  );

  const handleFiles = useCallback(
    (files: FileList) => {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Validate file
        if (!validateFileType(file)) {
          toast.error(`Tipo de archivo no soportado: ${file.name}`);
          continue;
        }

        if (!validateFileSize(file)) {
          toast.error(`Archivo muy grande: ${file.name} (máximo 10MB)`);
          continue;
        }

        void uploadFile(file);
      }
    },
    [uploadFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input
      e.target.value = "";
    },
    [handleFiles],
  );

  const removeUploadingFile = useCallback((id: string) => {
    setUploadingFiles((prev) => prev.filter((uf) => uf.id !== id));
  }, []);

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-muted-foreground mb-3">PDF, Word, TXT, MD, CSV (máx. 10MB)</p>
        <Button size="sm" variant="outline" type="button">
          Seleccionar archivos
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.md,.csv"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploading files progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium">Subiendo archivos...</h4>
          {uploadingFiles.map((uploadingFile) => (
            <div key={uploadingFile.id} className="flex items-center gap-3 p-2 border rounded-lg">
              <File size={16} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{uploadingFile.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {uploadingFile.status === "uploading" && (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span className="text-xs text-muted-foreground">Procesando...</span>
                    </>
                  )}
                  {uploadingFile.status === "success" && (
                    <span className="text-xs text-green-600">Completado</span>
                  )}
                  {uploadingFile.status === "error" && (
                    <span className="text-xs text-red-600">Error</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploadingFile(uploadingFile.id);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
