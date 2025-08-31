'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, FolderOpen, MessageCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ActionDialog from '@/components/action-dialog';
import { CHAT_PAGE_SIZE } from '@/lib/constants';
import type { Case } from '@/lib/db/schema';

interface CasesResponse {
  cases: Case[];
  hasMore: boolean;
  currentPage: number;
  totalCases: number;
}

function CaseCard({ 
  caseItem, 
  onRename, 
  onDelete 
}: { 
  caseItem: Case & { chatCount?: number };
  onRename: (caseId: string, currentTitle: string, currentDescription?: string) => void;
  onDelete: (caseId: string) => void;
}) {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <Link href={`/cases/${caseItem.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold truncate">{caseItem.title}</h3>
          </div>
          
          {caseItem.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {caseItem.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Creado {formatDistanceToNow(new Date(caseItem.createdAt), { 
                addSuffix: true, 
                locale: es 
              })}
            </span>
            <div className="flex items-center gap-1">
              <MessageCircle size={12} />
              <span>{caseItem.chatCount || 0} chat{(caseItem.chatCount || 0) !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={handleMenuClick}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                handleMenuClick(e);
                onRename(caseItem.id, caseItem.title, caseItem.description || undefined);
              }}
              className="cursor-pointer"
            >
              <Edit size={16} />
              <span>Renombrar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                handleMenuClick(e);
                onDelete(caseItem.id);
              }}
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive"
            >
              <Trash2 size={16} />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const { data: session } = useSession();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCases, setTotalCases] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDescription, setNewCaseDescription] = useState('');
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [editCaseTitle, setEditCaseTitle] = useState('');
  const [editCaseDescription, setEditCaseDescription] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchCases = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      const data: CasesResponse = await response.json();

      setCases(data.cases);
      setTotalCases(data.totalCases);
    } catch (error) {
      toast.error('Error al cargar los casos');
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    void fetchCases();
  }, [fetchCases]);

  const handleCreateCase = async () => {
    if (!newCaseTitle.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newCaseTitle.trim(),
          description: newCaseDescription.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Caso creado exitosamente');
        setShowCreateDialog(false);
        setNewCaseTitle('');
        setNewCaseDescription('');
        
        // Navigate to the new case
        window.location.href = `/cases/${data.case.id}`;
      } else {
        toast.error('Error al crear el caso');
      }
    } catch (error) {
      toast.error('Error al crear el caso');
      console.error('Error creating case:', error);
    }
  };

  const handleRenameCase = (caseId: string, currentTitle: string, currentDescription?: string) => {
    setEditingCase(cases.find(c => c.id === caseId) || null);
    setEditCaseTitle(currentTitle);
    setEditCaseDescription(currentDescription || '');
    setShowEditDialog(true);
  };

  const handleUpdateCase = async () => {
    if (!editingCase || !editCaseTitle.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      const response = await fetch(`/api/cases/${editingCase.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editCaseTitle.trim(),
          description: editCaseDescription.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast.success('Caso actualizado exitosamente');
        setShowEditDialog(false);
        setEditingCase(null);
        setEditCaseTitle('');
        setEditCaseDescription('');
        void fetchCases();
      } else {
        toast.error('Error al actualizar el caso');
      }
    } catch (error) {
      toast.error('Error al actualizar el caso');
      console.error('Error updating case:', error);
    }
  };

  const handleDeleteCase = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/cases/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Caso eliminado exitosamente');
        setShowDeleteDialog(false);
        setDeleteId(null);
        void fetchCases();
      } else {
        toast.error('Error al eliminar el caso');
      }
    } catch (error) {
      toast.error('Error al eliminar el caso');
      console.error('Error deleting case:', error);
    }
  };

  const openDeleteDialog = (caseId: string) => {
    setDeleteId(caseId);
    setShowDeleteDialog(true);
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Inicia sesión para ver tus casos</p>
      </div>
    );
  }

  return (
    <div className="w-7/12 self-center p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Mis Casos</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} />
          Crear Caso
        </Button>
      </div>

      {totalCases > 0 && (
        <div className="text-sm text-muted-foreground">
          Tienes {totalCases} caso{totalCases !== 1 ? 's' : ''} activo{totalCases !== 1 ? 's' : ''}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando casos...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tienes casos aún</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer caso para organizar tus chats y archivos
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus size={16} />
              Crear mi primer caso
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="group">
                <CaseCard 
                  caseItem={caseItem} 
                  onRename={handleRenameCase}
                  onDelete={openDeleteDialog}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Case Dialog */}
      <ActionDialog
        openModal={showCreateDialog}
        setOpenModal={setShowCreateDialog}
        title="Crear Nuevo Caso"
        description="Ingresa los detalles para tu nuevo caso legal."
        action={handleCreateCase}
        actionText="Crear Caso"
        cancelText="Cancelar"
        customContent={
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título del caso *</label>
              <Input
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
                placeholder="Ej. Divorcio contencioso Sr. López"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción (opcional)</label>
              <Textarea
                value={newCaseDescription}
                onChange={(e) => setNewCaseDescription(e.target.value)}
                placeholder="Breve descripción del caso..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        }
      />

      {/* Edit Case Dialog */}
      <ActionDialog
        openModal={showEditDialog}
        setOpenModal={setShowEditDialog}
        title="Editar Caso"
        description="Modifica los detalles del caso."
        action={handleUpdateCase}
        actionText="Guardar Cambios"
        cancelText="Cancelar"
        customContent={
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título del caso *</label>
              <Input
                value={editCaseTitle}
                onChange={(e) => setEditCaseTitle(e.target.value)}
                placeholder="Ej. Divorcio contencioso Sr. López"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción (opcional)</label>
              <Textarea
                value={editCaseDescription}
                onChange={(e) => setEditCaseDescription(e.target.value)}
                placeholder="Breve descripción del caso..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        }
      />

      {/* Delete Case Dialog */}
      <ActionDialog
        openModal={showDeleteDialog}
        setOpenModal={setShowDeleteDialog}
        title="¿Eliminar caso?"
        description="Esta acción no se puede deshacer. El caso y todos sus chats y archivos serán eliminados permanentemente."
        action={handleDeleteCase}
        actionText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}