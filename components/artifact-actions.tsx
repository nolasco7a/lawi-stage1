import { cn } from "@/lib/utils";
import { type Dispatch, type SetStateAction, memo, useState } from "react";
import { toast } from "sonner";
import { type UIArtifact, artifactDefinitions } from "./artifact";
import type { ArtifactActionContext } from "./create-artifact";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ArtifactActionsProps {
  artifact: UIArtifact;
  handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void;
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  mode: "edit" | "diff";
  metadata: any;
  setMetadata: Dispatch<SetStateAction<any>>;
}

function PureArtifactActions({
  artifact,
  handleVersionChange,
  currentVersionIndex,
  isCurrentVersion,
  mode,
  metadata,
  setMetadata,
}: Readonly<ArtifactActionsProps>) {
  const [isLoading, setIsLoading] = useState(false);

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind,
  );

  if (!artifactDefinition) {
    throw new Error("Artifact definition not found!");
  }

  const actionContext: ArtifactActionContext<unknown> = {
    content: artifact.content,
    handleVersionChange,
    currentVersionIndex,
    isCurrentVersion,
    mode,
    metadata,
    setMetadata,
  };

  const disabled = (action: any) => {
    if (isLoading || artifact.status === "streaming") {
      return true;
    }
    if (action.isDisabled) {
      return action.isDisabled(actionContext);
    }
    return false;
  };

  return (
    <div className="flex flex-row gap-1">
      {artifactDefinition.actions.map((action) => (
        <Tooltip key={action.description}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn("h-fit dark:hover:bg-zinc-700", {
                "p-2": !action.label,
                "py-1.5 px-2": action.label,
              })}
              onClick={async () => {
                setIsLoading(true);

                await Promise.resolve(action.onClick(actionContext))
                  .then(() => {
                    setIsLoading(false);
                  })
                  .catch(() => {
                    toast.error("Failed to execute action");
                  });
              }}
              disabled={disabled(action)}
            >
              {action.icon}
              {action.label}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{action.description}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export const ArtifactActions = memo(PureArtifactActions, (prevProps, nextProps) => {
  if (prevProps.artifact.status !== nextProps.artifact.status) return false;
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex) return false;
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false;
  if (prevProps.artifact.content !== nextProps.artifact.content) return false;

  return true;
});
