"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/file-upload";
import { FileList } from "@/components/file-list";
import ChatCard from "@/components/chat-card";
import { useCaseStore } from "@/lib/store/cases";
import type { Case, Chat, CaseFile } from "@/lib/db/schema";

export default function CaseDetailsPage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const {
    currentCase: caseData,
    currentChats: chats,
    currentFiles: files,
    caseLoading: loading,
    fetchCaseDetails,
    refreshCaseDetails,
  } = useCaseStore();
  const [creatingChat, setCreatingChat] = useState(false);

  const handleCreateChat = async () => {
    if (!caseData?.id) return;

    setCreatingChat(true);
    try {
      const response = await fetch(`/api/cases/${caseData.id}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Chat - ${caseData.title}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Chat creado exitosamente");
        // Navigate to the new chat
        router.push(data.redirectUrl);
      } else {
        toast.error("Error al crear el chat");
      }
    } catch (error) {
      toast.error("Error al crear el chat");
      console.error("Error creating chat:", error);
    } finally {
      setCreatingChat(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id && id) {
      void fetchCaseDetails(id as string);
    }
  }, [session?.user?.id, id, fetchCaseDetails]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Inicia sesión para ver el caso</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-7/12 self-center p-4 md:p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando caso...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="w-7/12 self-center p-4 md:p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Caso no encontrado</p>
          <Button variant="outline" onClick={() => router.push("/cases")} className="mt-4">
            Volver a casos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-7/12 self-center p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/cases")}>
          <ArrowLeft size={16} />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{caseData.title}</h1>
        </div>
      </div>

      {/* Main content area with 70/30 layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - 70% - Case details and chats */}
        <div className="flex-1 lg:w-[70%] space-y-6">
          {/* Case description */}
          {caseData.description && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Descripción del caso</h3>
              <p className="text-sm text-muted-foreground">{caseData.description}</p>
            </div>
          )}

          {/* Chats section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <h3 className="font-semibold">Chats del caso ({chats.length})</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateChat}
                disabled={creatingChat}
              >
                <Plus size={16} />
                {creatingChat ? "Creando..." : "Nuevo chat"}
              </Button>
            </div>

            {chats.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No hay chats en este caso aún</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {chats.map((chat) => (
                    <ChatCard key={chat.id} chat={chat} showCaseTag={false} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Right side - 30% - Files section */}
        <div className="lg:w-[30%] space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} />
              <h3 className="font-semibold">Archivos del caso</h3>
            </div>

            <FileUpload
              caseId={id as string}
              onFileUploaded={refreshCaseDetails}
              className="mb-4"
            />

            <FileList files={files} caseId={id as string} onFileDeleted={refreshCaseDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}
