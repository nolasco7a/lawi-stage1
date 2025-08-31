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
  integer,
  jsonb,
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
  
  // Stripe integration
  customer_id: varchar('customer_id', { length: 100 }),
  
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
  customerIdIdx: index('user_customer_id_idx').on(table.customer_id),
  
  // Unique constraints
  lawyerCredentialUnique: unique('user_lawyer_credential_unique').on(table.lawyer_credential_number),
  nationalIdUnique: unique('user_national_id_unique').on(table.national_id),
}));

export type User = InferSelectModel<typeof user>;

export const caseTable = pgTable('Case', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
}, (table) => ({
  userIdIdx: index('case_user_id_idx').on(table.userId),
  activeIdx: index('case_active_idx').on(table.active),
}));

export type Case = InferSelectModel<typeof caseTable>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  caseId: uuid('caseId').references(() => caseTable.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
}, (table) => ({
  caseIdIdx: index('chat_case_id_idx').on(table.caseId),
}));

export type Chat = InferSelectModel<typeof chat>;

export const caseFile = pgTable('CaseFile', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  caseId: uuid('caseId')
    .notNull()
    .references(() => caseTable.id),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('originalName', { length: 255 }).notNull(),
  mimeType: varchar('mimeType', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  vectorData: jsonb('vectorData'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  caseIdIdx: index('case_file_case_id_idx').on(table.caseId),
}));

export type CaseFile = InferSelectModel<typeof caseFile>;

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

// Subscription management tables
export const subscription = pgTable('Subscription', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => user.id),
  subscription_id: varchar('subscription_id', { length: 100 }).notNull().unique(),
  customer_id: varchar('customer_id', { length: 100 }).notNull(),
  status: varchar('status', { 
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'paused'] 
  }).notNull(),
  plan_type: varchar('plan_type', { enum: ['basic', 'pro'] }).notNull(),
  current_period_start: timestamp('current_period_start').notNull(),
  current_period_end: timestamp('current_period_end').notNull(),
  cancel_at_period_end: boolean('cancel_at_period_end').notNull().default(false),
  canceled_at: timestamp('canceled_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('subscription_user_idx').on(table.user_id),
  statusIdx: index('subscription_status_idx').on(table.status),
  subscriptionIdIdx: index('subscription_subscription_id_idx').on(table.subscription_id),
  customerIdIdx: index('subscription_customer_id_idx').on(table.customer_id),
}));

export type Subscription = InferSelectModel<typeof subscription>;

export const subscriptionEvent = pgTable('SubscriptionEvent', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  subscription_id: uuid('subscription_id')
    .notNull()
    .references(() => subscription.id),
  event_id: varchar('event_id', { length: 100 }).notNull().unique(),
  event_type: varchar('event_type', { length: 100 }).notNull(),
  event_data: jsonb('event_data').notNull(),
  processed_at: timestamp('processed_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  subscriptionIdx: index('subscription_event_subscription_idx').on(table.subscription_id),
  eventTypeIdx: index('subscription_event_type_idx').on(table.event_type),
  eventIdIdx: index('subscription_event_event_id_idx').on(table.event_id),
}));

export type SubscriptionEvent = InferSelectModel<typeof subscriptionEvent>;

export const invoice = pgTable('Invoice', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  subscription_id: uuid('subscription_id')
    .notNull()
    .references(() => subscription.id),
  invoice_id: varchar('invoice_id', { length: 100 }).notNull().unique(),
  amount_paid: integer('amount_paid').notNull(), // in cents
  currency: varchar('currency', { length: 3 }).notNull().default('usd'),
  status: varchar('status', { 
    enum: ['paid', 'open', 'void', 'draft', 'uncollectible'] 
  }).notNull(),
  invoice_pdf: varchar('invoice_pdf', { length: 500 }),
  period_start: timestamp('period_start').notNull(),
  period_end: timestamp('period_end').notNull(),
  due_date: timestamp('due_date'),
  paid_at: timestamp('paid_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  subscriptionIdx: index('invoice_subscription_idx').on(table.subscription_id),
  statusIdx: index('invoice_status_idx').on(table.status),
  invoiceIdIdx: index('invoice_invoice_id_idx').on(table.invoice_id),
  paidAtIdx: index('invoice_paid_at_idx').on(table.paid_at),
}));

export type Invoice = InferSelectModel<typeof invoice>;
