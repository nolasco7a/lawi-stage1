'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  File, 
  FileText, 
  Download, 
  Trash2, 
  MoreHorizontal,
  FileType,
  FileSpreadsheet
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ActionDialog from '@/components/action-dialog';
import type { CaseFile } from '@/lib/db/schema';

interface FileListProps {
  files: CaseFile[];
  caseId: string;
  onFileDeleted?: () => void;
  className?: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType.includes('pdf')) {
    return <FileType size={16} className="text-red-500" />;
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return <FileText size={16} className="text-blue-500" />;
  }
  if (mimeType.includes('text')) {
    return <FileText size={16} className="text-gray-500" />;
  }
  if (mimeType.includes('csv') || mimeType.includes('spreadsheet')) {
    return <FileSpreadsheet size={16} className="text-green-500" />;
  }
  return <File size={16} className="text-gray-500" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function FileItem({ 
  file, 
  caseId, 
  onDelete 
}: { 
  file: CaseFile; 
  caseId: string; 
  onDelete: (fileId: string) => void; 
}) {
  const handleDownload = async () => {
    try {
      // TODO: Implement download functionality
      toast.info('Descarga no implementada aún');
    } catch (error) {
      toast.error('Error al descargar el archivo');
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      {getFileIcon(file.mimeType)}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.originalName}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(file.createdAt), { 
              addSuffix: true, 
              locale: es 
            })}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDownload}
            className="cursor-pointer"
          >
            <Download size={16} />
            <span>Descargar</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(file.id)}
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive"
          >
            <Trash2 size={16} />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function FileList({ files, caseId, onFileDeleted, className }: FileListProps) {
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteFile = async () => {
    if (!deleteFileId) return;

    try {
      const response = await fetch(
        `/api/cases/${caseId}/files?fileId=${deleteFileId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast.success('Archivo eliminado exitosamente');
        onFileDeleted?.();
      } else {
        toast.error('Error al eliminar el archivo');
      }
    } catch (error) {
      toast.error('Error al eliminar el archivo');
      console.error('Error deleting file:', error);
    }

    setShowDeleteDialog(false);
    setDeleteFileId(null);
  };

  const openDeleteDialog = (fileId: string) => {
    setDeleteFileId(fileId);
    setShowDeleteDialog(true);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium">
          Archivos ({files.length})
        </h4>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">
            No hay archivos en este caso
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                caseId={caseId}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Delete confirmation dialog */}
      <ActionDialog
        openModal={showDeleteDialog}
        setOpenModal={setShowDeleteDialog}
        title="¿Eliminar archivo?"
        description="Esta acción no se puede deshacer. El archivo será eliminado permanentemente."
        action={handleDeleteFile}
        actionText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}