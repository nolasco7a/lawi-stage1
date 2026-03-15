import { xai } from "@ai-sdk/xai";
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from "ai";
import { isTestEnvironment } from "../constants";
import { artifactModel, chatModel, reasoningModel, titleModel } from "./models.test";

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": xai("grok-4"),
        "chat-model-reasoning": wrapLanguageModel({
          model: xai("grok-3-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": xai("grok-4-1-fast-non-reasoning"),
        "artifact-model": xai("grok-4-1-fast-non-reasoning"),
      },
      imageModels: {
        "small-model": xai.imageModel("grok-2-image"),
      },
    });
