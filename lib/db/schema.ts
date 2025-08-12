import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  index,
  unique,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  // Existing fields (keep unchanged)
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull().unique(),
  password: varchar('password', { length: 64 }),
  
  // Common new fields
  name: varchar('name', { length: 100 }),
  lastname: varchar('lastname', { length: 100 }),
  role: varchar('role', { enum: ['user', 'lawyer', 'admin'] }).notNull().default('user'),
  is_guest: boolean('is_guest').notNull().default(false),
  
  // Lawyer-specific fields (optional)
  lawyer_credential_number: varchar('lawyer_credential_number', { length: 50 }),
  national_id: varchar('national_id', { length: 20 }),
  phone: varchar('phone', { length: 20 }),
  
  // Location fields (optional)
  country_id: uuid('country_id').references(() => country.id),
  depto_state_id: uuid('depto_state_id').references(() => deptoState.id),
  city_municipality_id: uuid('city_municipality_id').references(() => cityMunicipality.id),
  
  // Timestamps
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt'),
  deleted_at: timestamp('deleted_at'),
}, (table) => ({
  // Indexes for performance
  emailIdx: index('user_email_idx').on(table.email),
  roleIdx: index('user_role_idx').on(table.role),
  lawyerCredentialIdx: index('user_lawyer_credential_idx').on(table.lawyer_credential_number),
  nationalIdIdx: index('user_national_id_idx').on(table.national_id),
  countryIdx: index('user_country_idx').on(table.country_id),
  deptoStateIdx: index('user_depto_state_idx').on(table.depto_state_id),
  cityMunicipalityIdx: index('user_city_municipality_idx').on(table.city_municipality_id),
  
  // Unique constraints
  lawyerCredentialUnique: unique('user_lawyer_credential_unique').on(table.lawyer_credential_number),
  nationalIdUnique: unique('user_national_id_unique').on(table.national_id),
}));

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable('Message_v2', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  'Vote_v2',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'Stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chatId: uuid('chatId').notNull(),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  }),
);

export type Stream = InferSelectModel<typeof stream>;

export const passwordResetToken = pgTable('PasswordResetToken', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  token: varchar('token', { length: 8 }).notNull(),
  attempts: varchar('attempts', { length: 1 }).notNull().default('0'),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type PasswordResetToken = InferSelectModel<typeof passwordResetToken>;

export const country = pgTable('Country', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  iso2_code: varchar('iso2_code', { length: 2 }).notNull(),
  iso3_code: varchar('iso3_code', { length: 3 }).notNull(),
  area_code: varchar('area_code', { length: 5 }).notNull(),
  demonym: varchar('demonym', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type Country = InferSelectModel<typeof country>;

export const deptoState = pgTable('DeptoState', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  country_id: uuid('country_id')
    .notNull()
    .references(() => country.id),
  name: varchar('name', { length: 100 }).notNull(),
  zip_code: varchar('zip_code', { length: 10 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type DeptoState = InferSelectModel<typeof deptoState>;

export const cityMunicipality = pgTable('CityMunicipality', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  country_id: uuid('country_id')
    .notNull()
    .references(() => country.id),
  depto_state_id: uuid('depto_state_id')
    .notNull()
    .references(() => deptoState.id),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type CityMunicipality = InferSelectModel<typeof cityMunicipality>;
