import "server-only";

import { and, asc, count, desc, eq, gt, gte, inArray, like, lt, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  stream,
  passwordResetToken,
  type PasswordResetToken,
  country,
  deptoState,
  cityMunicipality,
  type Country,
  type DeptoState,
  type CityMunicipality,
  caseTable,
  type Case,
  caseFile,
  type CaseFile,
} from "./schema";
import type { ArtifactKind } from "@/components/artifact";
import { generateUUID } from "../utils";
import { generateHashedPassword } from "./utils";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get user by email");
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({
      email,
      password: hashedPassword,
      role: "user",
      is_guest: false,
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

export async function createUserWithDetails(userData: {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  role: "user" | "lawyer" | "admin";
  lawyer_credential_number?: string;
  national_id?: string;
  phone?: string;
  country_id?: string;
  depto_state_id?: string;
  city_municipality_id?: string;
}) {
  console.log("user Data received for createUserWithDetails:", {
    ...userData,
    password: "[HIDDEN]",
  });
  const hashedPassword = generateHashedPassword(userData.password);

  try {
    console.log("createUserWithDetails - Creating user with data:", {
      ...userData,
      password: "[HIDDEN]",
    });

    return await db
      .insert(user)
      .values({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        lastname: userData.lastname,
        role: userData.role,
        phone: userData.phone,
        country_id: userData.country_id,
        depto_state_id: userData.depto_state_id,
        city_municipality_id: userData.city_municipality_id,
        lawyer_credential_number: userData.lawyer_credential_number,
        national_id: userData.national_id,
        is_guest: false,
      })
      .returning({
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        role: user.role,
      });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user with details");
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    return await db
      .insert(user)
      .values({
        email,
        password,
        role: "user",
        is_guest: true,
      })
      .returning({
        id: user.id,
        email: user.email,
      });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create guest user");
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function saveChatWithCase({
  id,
  userId,
  title,
  visibility,
  caseId,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
  caseId: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
      caseId,
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat with case");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db.delete(chat).where(eq(chat.id, id)).returning();
    return chatsDeleted;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to delete chat by id");
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(whereCondition ? and(whereCondition, eq(chat.userId, id)) : eq(chat.userId, id))
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError("not_found:database", `Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db.select().from(chat).where(eq(chat.id, endingBefore)).limit(1);

      if (!selectedChat) {
        throw new ChatSDKError("not_found:database", `Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chats by user id");
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get messages by chat id");
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === "up",
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get votes by chat id");
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get documents by id");
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get document by id");
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(and(eq(suggestion.documentId, id), gt(suggestion.documentCreatedAt, timestamp)));

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp",
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save suggestions");
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get suggestions by document id");
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get message by id");
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)));

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)));

      return await db
        .delete(message)
        .where(and(eq(message.chatId, chatId), inArray(message.id, messageIds)));
    }
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp",
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to update chat visibility by id");
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, "user"),
        ),
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get message count by user id");
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await db.insert(stream).values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create stream id");
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get stream ids by chat id");
  }
}

export async function createPasswordResetToken({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  try {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Delete any existing tokens for this email
    await db.delete(passwordResetToken).where(eq(passwordResetToken.email, email));

    return await db
      .insert(passwordResetToken)
      .values({
        email,
        token,
        expiresAt,
        attempts: "0",
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create password reset token");
  }
}

export async function getPasswordResetToken({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<PasswordResetToken | null> {
  try {
    const [resetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(
        and(
          eq(passwordResetToken.email, email),
          eq(passwordResetToken.token, token),
          gt(passwordResetToken.expiresAt, new Date()),
        ),
      );

    return resetToken || null;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get password reset token");
  }
}

export async function incrementPasswordResetAttempts({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  try {
    return await db
      .update(passwordResetToken)
      .set({
        attempts: String(
          Number((await getPasswordResetTokenByEmailAndToken(email, token))?.attempts || "0") + 1,
        ),
      })
      .where(and(eq(passwordResetToken.email, email), eq(passwordResetToken.token, token)));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to increment password reset attempts");
  }
}

async function getPasswordResetTokenByEmailAndToken(
  email: string,
  token: string,
): Promise<PasswordResetToken | null> {
  try {
    const [resetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(and(eq(passwordResetToken.email, email), eq(passwordResetToken.token, token)));

    return resetToken || null;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get password reset token by email and token",
    );
  }
}

export async function deletePasswordResetToken({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  try {
    return await db
      .delete(passwordResetToken)
      .where(and(eq(passwordResetToken.email, email), eq(passwordResetToken.token, token)));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to delete password reset token");
  }
}

export async function updateUserPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const hashedPassword = generateHashedPassword(password);
    return await db.update(user).set({ password: hashedPassword }).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to update user password");
  }
}

export async function updateUserCustomerId({
  userId,
  customerId,
}: {
  userId: string;
  customerId: string;
}) {
  try {
    return await db.update(user).set({ customer_id: customerId }).where(eq(user.id, userId));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to update user customer ID");
  }
}

export async function getUserById({ id }: { id: string }) {
  try {
    const [selectedUser] = await db.select().from(user).where(eq(user.id, id));
    return selectedUser;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get user by id");
  }
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    return await db.select().from(country);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get all countries");
  }
}

export async function getDeptoStatesByCountryId(country_id: string): Promise<DeptoState[]> {
  try {
    return await db.select().from(deptoState).where(eq(deptoState.country_id, country_id));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get states/departments by country id",
    );
  }
}

export async function getCityMunicipalitiesByCountryId(
  country_id: string,
): Promise<CityMunicipality[]> {
  try {
    return await db
      .select()
      .from(cityMunicipality)
      .where(eq(cityMunicipality.country_id, country_id));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get cities/municipalities by state/department id",
    );
  }
}

export async function searchChatsByUserId({
  userId,
  query,
  limit,
  offset,
}: {
  userId: string;
  query?: string;
  limit: number;
  offset: number;
}) {
  try {
    const whereConditions = [eq(chat.userId, userId)];

    if (query && query.trim()) {
      whereConditions.push(like(chat.title, `%${query.trim()}%`));
    }

    const chats = await db
      .select()
      .from(chat)
      .where(and(...whereConditions))
      .orderBy(desc(chat.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = chats.length > limit;

    return {
      chats: hasMore ? chats.slice(0, limit) : chats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to search chats by user id");
  }
}

export async function updateChatTitle({
  chatId,
  title,
}: {
  chatId: string;
  title: string;
}) {
  try {
    return await db.update(chat).set({ title }).where(eq(chat.id, chatId)).returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to update chat title");
  }
}

export async function getTotalChatsByUserId({
  userId,
}: {
  userId: string;
}) {
  try {
    const [result] = await db
      .select({ count: count(chat.id) })
      .from(chat)
      .where(eq(chat.userId, userId));

    return result?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get total chats count");
  }
}

// Case management functions
export async function createCase({
  title,
  description,
  userId,
}: {
  title: string;
  description?: string;
  userId: string;
}) {
  try {
    return await db
      .insert(caseTable)
      .values({
        title,
        description,
        userId,
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create case");
  }
}

export async function getCasesByUserId({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  try {
    const cases = await db
      .select()
      .from(caseTable)
      .where(and(eq(caseTable.userId, userId), eq(caseTable.active, true)))
      .orderBy(desc(caseTable.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = cases.length > limit;

    return {
      cases: hasMore ? cases.slice(0, limit) : cases,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get cases by user id");
  }
}

export async function getCaseById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    const [selectedCase] = await db
      .select()
      .from(caseTable)
      .where(and(eq(caseTable.id, id), eq(caseTable.userId, userId), eq(caseTable.active, true)));

    return selectedCase;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get case by id");
  }
}

export async function updateCase({
  id,
  userId,
  title,
  description,
}: {
  id: string;
  userId: string;
  title?: string;
  description?: string;
}) {
  try {
    return await db
      .update(caseTable)
      .set({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      })
      .where(and(eq(caseTable.id, id), eq(caseTable.userId, userId), eq(caseTable.active, true)))
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to update case");
  }
}

export async function deleteCaseById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    return await db
      .update(caseTable)
      .set({
        active: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(caseTable.id, id), eq(caseTable.userId, userId), eq(caseTable.active, true)))
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to delete case");
  }
}

export async function getChatsByCaseId({
  caseId,
  userId,
}: {
  caseId: string;
  userId: string;
}) {
  try {
    return await db
      .select()
      .from(chat)
      .where(and(eq(chat.caseId, caseId), eq(chat.userId, userId)))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chats by case id");
  }
}

export async function getTotalCasesByUserId({
  userId,
}: {
  userId: string;
}) {
  try {
    const [result] = await db
      .select({ count: count(caseTable.id) })
      .from(caseTable)
      .where(and(eq(caseTable.userId, userId), eq(caseTable.active, true)));

    return result?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get total cases count");
  }
}

export async function getCasesWithChatCount({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  try {
    const cases = await db
      .select({
        id: caseTable.id,
        title: caseTable.title,
        description: caseTable.description,
        userId: caseTable.userId,
        active: caseTable.active,
        createdAt: caseTable.createdAt,
        updatedAt: caseTable.updatedAt,
        deletedAt: caseTable.deletedAt,
        chatCount: count(chat.id),
      })
      .from(caseTable)
      .leftJoin(chat, eq(chat.caseId, caseTable.id))
      .where(and(eq(caseTable.userId, userId), eq(caseTable.active, true)))
      .groupBy(caseTable.id)
      .orderBy(desc(caseTable.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = cases.length > limit;

    return {
      cases: hasMore ? cases.slice(0, limit) : cases,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get cases with chat count");
  }
}

// CaseFile management functions
export async function createCaseFile({
  caseId,
  filename,
  originalName,
  mimeType,
  size,
  vectorData,
}: {
  caseId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  vectorData?: any;
}) {
  try {
    return await db
      .insert(caseFile)
      .values({
        caseId,
        filename,
        originalName,
        mimeType,
        size,
        vectorData,
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create case file");
  }
}

export async function getCaseFilesByCaseId({
  caseId,
}: {
  caseId: string;
}) {
  try {
    return await db
      .select()
      .from(caseFile)
      .where(eq(caseFile.caseId, caseId))
      .orderBy(desc(caseFile.createdAt));
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get case files");
  }
}

export async function deleteCaseFileById({
  id,
  caseId,
}: {
  id: string;
  caseId: string;
}) {
  try {
    return await db
      .delete(caseFile)
      .where(and(eq(caseFile.id, id), eq(caseFile.caseId, caseId)))
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to delete case file");
  }
}

export async function getCaseFileById({
  id,
  caseId,
}: {
  id: string;
  caseId: string;
}) {
  try {
    const [file] = await db
      .select()
      .from(caseFile)
      .where(and(eq(caseFile.id, id), eq(caseFile.caseId, caseId)));

    return file;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get case file by id");
  }
}
