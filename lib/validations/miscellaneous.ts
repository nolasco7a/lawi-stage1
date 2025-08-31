import { z } from "zod"
import type { TranslateFunction } from "../types/common";

export const createTitleConversationSchema = (t: TranslateFunction) => z.object({
  title: z.string().min(5, t("validation.title.min")),
});

export type TitleConversationFormData = z.infer<ReturnType<typeof createTitleConversationSchema>>;