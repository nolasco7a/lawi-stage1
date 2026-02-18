"use client";

import type { ChatMessage } from "@/lib/types";
import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import { Button } from "./ui/button";
import type { VisibilityType } from "./visibility-selector";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  // selectedVisibilityType,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Redacta una carta de despido",
      label: "con argumentos legales",
      action:
        "Necesito que redactes una carta de despido justificando la decisión conforme a la ley.",
    },
    {
      title: "Resume este documento legal",
      label: "en lenguaje sencillo",
      action:
        "Por favor resume el siguiente documento legal con palabras simples para que sea más fácil de entender.",
    },
    {
      title: "Genera una demanda laboral",
      label: "para despido injustificado",
      action:
        "Ayúdame a redactar una demanda laboral por despido injustificado explicando los fundamentos legales.",
    },
    {
      title: "Explica mis derechos como trabajador",
      label: "en caso de accidente laboral",
      action: "¿Cuáles son mis derechos legales si sufro un accidente en el trabajo?",
    },
  ];

  return (
    <div data-testid="suggested-actions" className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, "", `/chat/${chatId}`);

              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">{suggestedAction.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, (prevProps, nextProps) => {
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) return false;

  return true;
});
