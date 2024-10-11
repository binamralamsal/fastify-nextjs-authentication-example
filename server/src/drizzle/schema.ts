import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const emailsTable = pgTable(
  "emails",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueEmailIndex: uniqueIndex("email_idx").on(sql`lower(${table.email})`),
  }),
);

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  valid: boolean("valid").notNull().default(true),
  userAgent: text("user_agent"),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const authenticatorSecretsTable = pgTable("authenticator_secrets", {
  id: serial("id").primaryKey(),
  secret: text("secret").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
  token: text("token")
    .notNull()
    .default(sql`gen_random_uuid()`),
  expiresAt: timestamp("expires_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 day'`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  email: one(emailsTable, {
    fields: [usersTable.id],
    references: [emailsTable.userId],
  }),
  authenticatorSecret: one(authenticatorSecretsTable, {
    fields: [usersTable.id],
    references: [authenticatorSecretsTable.userId],
  }),
  sessions: many(sessionsTable),
  passwordResetTokens: one(passwordResetTokensTable, {
    fields: [usersTable.id],
    references: [passwordResetTokensTable.userId],
  }),
}));

export const emailsRelations = relations(emailsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [emailsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const passwordResetTokensRelations = relations(
  passwordResetTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [passwordResetTokensTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const authenticatorSecretsRelations = relations(
  authenticatorSecretsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [authenticatorSecretsTable.userId],
      references: [usersTable.id],
    }),
  }),
);
