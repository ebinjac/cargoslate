import { pgTable, text, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import * as authSchema from './auth-schema';

export const documentTypeEnum = pgEnum('document_type', ['bill_of_lading', 'quotation', 'invoice', 'packing_list', 'shipping_instructions']);
export const templateStatusEnum = pgEnum('template_status', ['draft', 'published', 'archived']);
export const documentStatusEnum = pgEnum('document_status', ['draft', 'generated', 'archived']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['starter', 'professional', 'enterprise']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'trialing', 'past_due', 'canceled']);

export const template = pgTable("template", {
  id: text("id").primaryKey(), 
  organizationId: text("organization_id").notNull(),
  createdById: text("created_by_id").notNull(),
  name: text("name").notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  status: templateStatusEnum("status").notNull().default('draft'),
  schema: jsonb("schema").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const document = pgTable("document", {
  id: text("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  templateId: text("template_id").notNull(),
  createdById: text("created_by_id").notNull(),
  status: documentStatusEnum("status").notNull().default('draft'),
  data: jsonb("data").notNull().default({}),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Re-export auth schema so db/index.ts has everything
export * from './auth-schema';
