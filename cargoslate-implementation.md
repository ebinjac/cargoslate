# CargoSlate — Implementation Plan

> **The modern operating system for maritime and freight documentation.**

**Date:** March 17, 2026
**Project Type:** WEB (Full-Stack TanStack Start SaaS)

---

## Current State (Already Completed)

| Item | Status | Details |
| --- | --- | --- |
| TanStack Start scaffold | ✅ Done | File-based routing, SSR, devtools configured |
| Drizzle ORM + Neon | ✅ Done | `src/db/index.ts`, `drizzle.config.ts`, `db:push`/`db:migrate` scripts |
| Better Auth (barebones) | ✅ Done | Email/password enabled, TanStack Start cookies plugin, API handler at `/api/auth/$` |
| shadcn/ui | ✅ Done | 55 components installed (base-nova style, olive/teal palette, Outfit font) |
| Theme system | ✅ Done | Dark/light with FOUC-prevention script, custom scrollbar, animations |
| TanStack Query | ✅ Done | Provider + devtools integrated in `__root.tsx` |

**What Does NOT Exist Yet:** Database schema (only a placeholder `todos` table), organizations, RBAC, any application routes, layouts, sidebar, form builder, PDF generation, billing — everything below needs to be built.

---

## Phase 1 — Database Schema & Auth Foundation

> **Goal:** Define the multi-tenant data model and configure Better Auth with Organization + RBAC support so every subsequent feature has a solid data and auth layer to build on.

### Task 1.1: Define the Complete Drizzle Schema

**Files:** `src/db/schema.ts`

Replace the placeholder `todos` table with the full CargoSlate data model:

- **`organization`** — `id` (UUID), `name`, `slug` (unique), `logoUrl`, `brandSettings` (JSONB for header/footer/address/accentColor), `polarCustomerId`, `subscriptionTier` (enum: starter/professional/enterprise), `subscriptionStatus` (enum: active/trialing/past_due/canceled), `createdAt`
- **`user`** — Managed by Better Auth (auto-creates `user`, `session`, `account`, `verification` tables). No custom user table needed.
- **`member`** — Better Auth Organization plugin creates this. Stores `userId`, `organizationId`, `role` (owner/manager/clerk), `joinedAt`.
- **`invitation`** — Better Auth Organization plugin handles invitations. Fields: `organizationId`, `email`, `role`, `status`, `expiresAt`.
- **`template`** — `id` (UUID), `organizationId` (FK), `createdById` (FK → user), `name`, `documentType` (enum: bill_of_lading/quotation/invoice/packing_list/shipping_instructions), `status` (enum: draft/published/archived), `schema` (JSONB — ordered array of field block definitions), `createdAt`, `updatedAt`
- **`document`** — `id` (UUID), `referenceNumber` (unique, auto-generated), `organizationId` (FK), `templateId` (FK), `createdById` (FK → user), `status` (enum: draft/generated/archived), `data` (JSONB — field key→value map), `pdfUrl`, `createdAt`, `updatedAt`

**Enums (Drizzle `pgEnum`):**
- `documentTypeEnum` — `bill_of_lading`, `quotation`, `invoice`, `packing_list`, `shipping_instructions`
- `templateStatusEnum` — `draft`, `published`, `archived`
- `documentStatusEnum` — `draft`, `generated`, `archived`
- `subscriptionTierEnum` — `starter`, `professional`, `enterprise`
- `subscriptionStatusEnum` — `active`, `trialing`, `past_due`, `canceled`

**Verify:** Run `npm run db:push`, open `npm run db:studio`, confirm all tables and columns exist in Neon.

---

### Task 1.2: Configure Better Auth for Organizations & RBAC

**Files:** `src/lib/auth.ts`, `src/lib/auth-client.ts`

Extend the existing barebones Better Auth config:

1. **Add the `organization` plugin** — This auto-creates `organization`, `member`, and `invitation` tables that Better Auth manages internally. Link to Drizzle adapter so it uses the Neon database.
2. **Add the Drizzle adapter** — Connect Better Auth to the existing Drizzle/Neon instance (`src/db/index.ts`) via `drizzleAdapter`.
3. **Configure roles** — Define `owner`, `manager`, `clerk` as the RBAC roles. Owner is created automatically when an org is created.
4. **Enable Google OAuth** — Add `socialProviders: { google: { clientId, clientSecret } }` (env vars `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
5. **Update `auth-client.ts`** — Add the `organizationClient` plugin to the client so org/member/invite methods are available on the frontend.
6. **Generate Better Auth schema for Drizzle** — Run `npx @better-auth/cli generate` to get the Drizzle-compatible schema for the auth tables, then merge into `src/db/schema.ts`.

**Verify:** Start dev server → Register a user → Call `authClient.organization.create({ name: "Test Co", slug: "test-co" })` from the browser console → Verify `organization` and `member` rows appear in `db:studio`.

---

### Task 1.3: Create Auth Server Functions & Session Helper

**Files:** `src/server/functions/auth.functions.ts`, `src/lib/server/session.ts`

1. **`getSession` server function** — A reusable `createServerFn` that reads the session from the request headers using `auth.api.getSession()`. Returns the full user + active organization context. This is the single source of truth used by every protected route loader.
2. **`getOrganizationRole` helper** — Given a session, returns the user's role in the active organization. Used for RBAC checks.
3. **`requireAuth` middleware wrapper** — Validates session exists, throws redirect to `/login` if not. Used in route `beforeLoad`.
4. **`requireRole` middleware wrapper** — Validates session + role meets minimum level (clerk < manager < owner). Throws 403 if insufficient.

**Verify:** Call `getSession` from a test route loader → Confirm it returns `{ user, session, organization, role }` when logged in, and redirects to `/login` when not.

---

## Phase 2 — Application Shell & Navigation

> **Goal:** Build the authenticated app shell with sidebar navigation, theme toggle, org switcher, and role-based menu visibility. After this phase, the app has a fully navigable skeleton.

### Task 2.1: Create the Authenticated Layout Route

**Files:** `src/routes/_authenticated.tsx`

1. Create a **pathless layout route** `_authenticated.tsx` that wraps all protected app routes.
2. In `beforeLoad`, call `requireAuth()` — redirects to `/login` if no session.
3. In `loader`, fetch the user session + active org data using `getSession`.
4. The component renders the **sidebar** + a main content `<Outlet />` area.
5. Use shadcn `SidebarProvider` + `SidebarInset` for the layout structure.

**Verify:** Navigate to any `/_authenticated/*` route while unauthenticated → Redirected to `/login`. Log in → See the sidebar layout with `<Outlet />`.

---

### Task 2.2: Build the Login & Registration Pages

**Files:** `src/routes/login.tsx`, `src/routes/register.tsx`

1. **Login page** — Email + password form using shadcn `Input`, `Button`, `Card`. Calls `authClient.signIn.email()`. Link to register page. "Sign in with Google" button calling `authClient.signIn.social({ provider: "google" })`.
2. **Register page** — Name, email, password form. Calls `authClient.signUp.email()`. After signup, redirect to `/onboarding` to create their first organization.
3. **Design:** Centered card layout, minimal, dark-mode-first. CargoSlate logo/wordmark at top. No decorative chrome per PRD design philosophy.

**Verify:** Register a new user → Verify redirect to onboarding. Log in with existing user → Verify redirect to `/dashboard`.

---

### Task 2.3: Build the Onboarding Flow

**Files:** `src/routes/onboarding.tsx`

1. **Step 1: Create Organization** — Form with company name and slug. Calls `authClient.organization.create()`.
2. **Step 2: Invite Team (optional)** — Add team member emails + roles. Calls `authClient.organization.inviteMember()`. "Skip" button available.
3. **Step 3: Branding Setup (optional)** — Logo upload + company address. "Skip for now" button.
4. After completing, redirect to `/dashboard`.

**Verify:** Complete onboarding → Organization exists in DB → User is `owner` → Redirected to `/dashboard`.

---

### Task 2.4: Implement the Sidebar Navigation

**Files:** `src/components/layout/app-sidebar.tsx`, `src/components/layout/org-switcher.tsx`, `src/components/layout/user-nav.tsx`

Build the sidebar matching the PRD navigation structure:

```
CargoSlate
├── Dashboard
├── Documents
│   ├── All Documents
│   └── New Document
├── Templates
│   ├── All Templates
│   └── New Template         [Manager / Owner only]
├── Settings
│   ├── Workspace
│   ├── Branding             [Manager / Owner only]
│   ├── Team Members         [Owner only]
│   └── Billing              [Owner only]
└── [User Avatar → Profile / Logout]
```

**Implementation Details:**
- Use shadcn `Sidebar`, `SidebarMenu`, `SidebarMenuItem`, `SidebarGroup` components.
- **Role-based visibility** — Read the user's role from the route loader context. Conditionally render menu items based on role (e.g., `if (role === "owner" || role === "manager")` for template creation).
- **Org Switcher** — Dropdown at the top of the sidebar showing the active org. Calls `authClient.organization.setActive()` to switch. Lists all orgs the user belongs to.
- **User Nav** — Avatar + name at the sidebar footer. Dropdown with "Profile", "Theme Toggle", "Logout".
- **Lucide icons** — Use `LayoutDashboard`, `FileText`, `FolderOpen`, `Settings`, `Building2`, `Palette`, `Users`, `CreditCard` etc.
- **Collapsible groups** — Documents and Templates sections are collapsible `SidebarGroup` items.

**Verify:** Log in as Owner → See all nav items. Log in as Clerk → "New Template", "Branding", "Team Members", "Billing" are hidden.

---

### Task 2.5: Create Placeholder Route Files

**Files:** Multiple route files under `src/routes/_authenticated/`

Create the file-based routing skeleton (empty components with page title):

```
src/routes/_authenticated/
├── dashboard.tsx
├── documents/
│   ├── index.tsx        (All Documents)
│   └── new.tsx          (New Document)
├── templates/
│   ├── index.tsx        (All Templates)
│   ├── new.tsx          (New Template – Builder)
│   └── $templateId.tsx  (Edit Template)
├── settings/
│   ├── workspace.tsx
│   ├── branding.tsx
│   ├── team.tsx
│   └── billing.tsx
```

Each file exports a `createFileRoute` with a simple component rendering the page name. Add `beforeLoad` role guards where needed (e.g., `new.tsx` for templates requires `manager`+).

**Verify:** Navigate to each route → See the placeholder page title. Clerk trying to access `/templates/new` → Redirected with error.

---

## Phase 3 — Workspace Settings & Branding

> **Goal:** Let Owners and Managers configure their organization's branding (logo, address, header/footer text) which will later be injected into generated PDFs.

### Task 3.1: Cloudflare R2 Integration for File Uploads

**Files:** `src/server/functions/upload.functions.ts`, `src/lib/server/r2.ts`

1. **R2 client setup** — Use the `@aws-sdk/client-s3` package (R2 is S3-compatible). Configure with `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` env vars.
2. **`uploadFile` server function** — Accepts a file (logo image), validates type (PNG/SVG) and size (max 2MB), uploads to R2 with a unique key (`orgs/{orgId}/logo/{timestamp}.{ext}`), returns the R2 object key.
3. **`getSignedUrl` server function** — Given an R2 object key, returns a short-lived signed URL (1 hour expiry) for secure file access.
4. **`deleteFile` server function** — Deletes an R2 object by key. Used when replacing a logo.

**Verify:** Upload a test PNG via the server function → Verify object exists in R2 bucket → Generate a signed URL → Open in browser → See the image.

---

### Task 3.2: Workspace Settings Page

**Files:** `src/routes/_authenticated/settings/workspace.tsx`, `src/server/functions/organization.functions.ts`

1. **Page layout** — `Card` with sections for "Organization Name", "Slug" (read-only), "Created On".
2. **Update Org Name** — Inline edit form, calls a `updateOrganization` server function.
3. **Danger Zone** — "Delete Organization" button (Owner only) with confirmation dialog.

**Verify:** Change org name → Refresh → See updated name in sidebar and settings.

---

### Task 3.3: Branding Settings Page

**Files:** `src/routes/_authenticated/settings/branding.tsx`, `src/server/functions/branding.functions.ts`

1. **Logo Upload** — Drag-and-drop area or file picker. Preview of current logo. Calls `uploadFile` then saves the R2 key to `organization.logoUrl`.
2. **Company Details** — Registered company name, registered address (textarea).
3. **PDF Header Text** — Custom text that appears in the header of every generated PDF.
4. **PDF Footer Text** — Custom text (e.g., bank details, disclaimers) for the PDF footer.
5. **Accent Color** — Color picker for PDF heading color. Defaults to the org's primary brand color.
6. All fields save to `organization.brandSettings` (JSONB column) via a `updateBrandSettings` server function.

**Verify:** Upload a logo → See preview. Fill all fields → Save → Refresh → All values persist. Check `db:studio` → `brandSettings` JSON is populated.

---

### Task 3.4: Team Members Management Page

**Files:** `src/routes/_authenticated/settings/team.tsx`, `src/server/functions/team.functions.ts`

1. **Members Table** — List all org members with name, email, role, joined date. Uses shadcn `Table`.
2. **Invite Member** — Dialog with email input + role `Select` (Manager / Clerk). Calls `authClient.organization.inviteMember()`.
3. **Change Role** — Dropdown on each member row to change role (Owner only). Cannot change own role.
4. **Remove Member** — Button with confirmation dialog. Calls `authClient.organization.removeMember()`.
5. **Pending Invitations** — Section showing pending invites with "Resend" and "Revoke" actions.

**Verify:** Invite a user via email → Check `invitation` table for pending record. Accept invite in another browser → User appears in members list. Change their role → Verify in DB.

---

## Phase 4 — Dynamic Form Builder (The Core Product)

> **Goal:** Build the visual drag-and-drop template builder that lets Managers compose document templates from pre-built logistics field blocks. This is the heart of CargoSlate.

### Task 4.1: Define the Template Schema Type System

**Files:** `src/lib/builder/types.ts`, `src/lib/builder/field-blocks.ts`

1. **TypeScript types** for the template schema JSON:
   ```
   FieldType = "short_text" | "long_text" | "number" | "date" | "dropdown" | "checkbox" | "table" | "calculated" | "display_text"

   FieldDefinition = {
     id: string (UUID)
     type: FieldType
     label: string
     placeholder?: string
     required: boolean
     defaultValue?: string | number | boolean
     options?: string[]  // for dropdown
     columns?: ColumnDef[]  // for table type
     formula?: string  // for calculated type
     displayText?: string  // for display_text type
   }

   FieldBlock = {
     id: string (UUID)
     name: string
     description: string
     icon: string (Lucide icon name)
     fields: FieldDefinition[]
   }

   TemplateSchema = FieldBlock[]
   ```

2. **Pre-built logistics blocks** — Define as constants matching the PRD:
   - Shipper & Consignee Block
   - Vessel & Voyage Block
   - Port Information Block
   - Container Table Block
   - Cargo Details Block
   - Weight & Measurement Block
   - Freight & Charges Block
   - Dates & References Block

**Verify:** Import the types in a test file → TypeScript compiles without errors. Each pre-built block has the correct fields per PRD section 6.5.

---

### Task 4.2: Build the Form Builder Canvas (Drag & Drop)

**Files:** `src/components/builder/builder-canvas.tsx`, `src/components/builder/block-palette.tsx`, `src/components/builder/field-block-card.tsx`

Use `@dnd-kit/core` and `@dnd-kit/sortable` for the drag-and-drop system:

1. **Block Palette (Left Panel)** — Scrollable list of all pre-built logistics blocks. Each block shows name, description, icon. Draggable.
2. **Canvas (Center)** — Drop zone where blocks are placed. Sortable — blocks can be reordered. Each dropped block renders as a `FieldBlockCard`.
3. **FieldBlockCard** — Shows the block name, its fields in a compact preview, drag handle, delete button, and "Configure" button.
4. **State Management** — Use React `useState` for the template schema array. Drag from palette → adds block to canvas array. Drag within canvas → reorders. Delete → removes from array.

**Verify:** Drag "Shipper & Consignee" from palette to canvas → Block appears. Drag another block → Reorder. Delete a block → Removed. State updates correctly.

---

### Task 4.3: Build the Field Configuration Panel

**Files:** `src/components/builder/field-config-panel.tsx`, `src/components/builder/field-editor.tsx`

1. **Field Config Panel (Right Panel)** — When a block on the canvas is selected, this panel shows all its fields with edit controls.
2. **Field Editor** — For each field in the block:
   - Edit label (text input)
   - Edit placeholder (text input)
   - Toggle required/optional (switch)
   - Set default value (type-appropriate input)
   - For dropdowns: manage options list (add/remove/reorder)
   - For tables: manage column definitions
   - For calculated fields: define formula referencing other field IDs
3. **Layout** — Use shadcn `Sheet` or a resizable panel (react-resizable-panels is already installed).

**Verify:** Click a block on canvas → Right panel shows its fields. Edit a field label → Canvas updates in real time. Toggle required → State reflects.

---

### Task 4.4: Template Builder Page Integration

**Files:** `src/routes/_authenticated/templates/new.tsx`, `src/routes/_authenticated/templates/$templateId.tsx`

1. **New Template Page** — Step 1: Select document type (Bill of Lading, Quotation, etc.) + enter template name. Step 2: Open the full builder (palette + canvas + config panel) in a three-panel layout using `react-resizable-panels`.
2. **Edit Template Page** — Load existing template from DB, hydrate the canvas with its schema, allow editing.
3. **Toolbar** — "Save as Draft", "Publish", "Preview", "Duplicate" buttons. Status indicator (Draft/Published/Archived).
4. **Preview Mode** — Toggle that renders the template as it would appear in fill mode (read-only form).
5. **Route Guard** — `beforeLoad` checks that user is Manager or Owner. Clerk access → redirected.

**Verify:** Create a new BL template → Drag blocks → Configure fields → Save as Draft → Navigate to "All Templates" → See it listed. Edit → Change a field → Save → Verify changes persist in DB.

---

### Task 4.5: Template Server Functions

**Files:** `src/server/functions/template.functions.ts`

1. **`createTemplate`** — Validates input (name, documentType, schema JSON). Inserts into `template` table with `status: "draft"`, `organizationId` from session. Returns the new template ID.
2. **`updateTemplate`** — Updates name, schema, or status. Only the owning org's Managers/Owners can update. Validate that published templates can't be edited (must archive first, then duplicate).
3. **`publishTemplate`** — Changes status from `draft` to `published`. Validates schema is non-empty.
4. **`archiveTemplate`** — Changes status to `archived`. Existing documents remain accessible.
5. **`duplicateTemplate`** — Creates a copy with `(Copy)` appended to name, status set to `draft`.
6. **`getTemplates`** — Lists all templates for the org, filterable by status and documentType.
7. **`getTemplateById`** — Returns a single template with full schema. Scoped to org.

**Verify:** Create → Publish → Archive → Duplicate. List shows correct statuses. Cross-org access blocked.

---

### Task 4.6: Templates List Page

**Files:** `src/routes/_authenticated/templates/index.tsx`

1. **Table View** — Name, document type, status (badge), created by, last updated.
2. **Filters** — Status filter (All/Draft/Published/Archived), document type filter.
3. **Actions** — Edit (Draft only), Duplicate, Archive, "Use Template" (Published only — links to `/documents/new?templateId=X`).
4. **Empty State** — "No templates yet. Create your first template to get started." with CTA button.

**Verify:** See listed templates. Filter by status → Only matching templates shown. Click "Use Template" → Navigates to document creation with template pre-selected.

---

## Phase 5 — Document Generation & PDF Engine

> **Goal:** Enable Clerks to select a published template, fill in the form, preview the document, and generate a pixel-perfect, branded PDF.

### Task 5.1: Document Fill Mode UI

**Files:** `src/routes/_authenticated/documents/new.tsx`, `src/components/documents/fill-form.tsx`

1. **Template Selection** — If no `templateId` query param, show a grid of published templates to choose from (card layout with document type icon, name, field count).
2. **Fill Form** — Dynamically render form fields based on the template schema:
   - `short_text` → shadcn `Input`
   - `long_text` → shadcn `Textarea`
   - `number` → shadcn `Input[type=number]`
   - `date` → shadcn `Calendar` / `DatePicker`
   - `dropdown` → shadcn `Select`
   - `checkbox` → shadcn `Checkbox`
   - `table` → Dynamic rows with add/remove row buttons, each row has inputs per column definition
   - `calculated` → Read-only input, value derived from formula
   - `display_text` → Read-only paragraph/heading
3. **Validation** — Required fields must be filled. Number fields validate numeric input. Show inline errors.
4. **Auto-save** — Debounced save to `document` table as `status: "draft"` every 30 seconds. Clerk can navigate away and return.
5. **Actions Bar** — "Save Draft", "Preview PDF", "Generate PDF" buttons.

**Verify:** Select template → Form renders all fields correctly. Fill required fields → "Generate PDF" enabled. Leave required field empty → Validation error shown. Navigate away → Return → Draft data restored.

---

### Task 5.2: Document Server Functions

**Files:** `src/server/functions/document.functions.ts`

1. **`createDocument`** — Creates a new document record with `status: "draft"`, auto-generated `referenceNumber` (format: `CS-{ORG_SLUG}-{YYYYMMDD}-{SEQUENTIAL}`), links to template.
2. **`updateDocument`** — Updates the `data` JSON (form values). Only drafts can be updated.
3. **`getDocuments`** — Lists documents for the org. Managers/Owners see all; Clerks see only their own. Filterable by status, type, date range, creator.
4. **`getDocumentById`** — Returns document with full data + template schema + org branding.
5. **`archiveDocument`** — Sets status to `archived`.

**Verify:** Create document → Auto-generated ref number. Update data → Verify JSON. Clerk sees only own documents. Manager sees all.

---

### Task 5.3: PDF Generation Engine

**Files:** `src/server/functions/pdf.functions.ts`, `src/lib/server/pdf-renderer.ts`

1. **PDF Renderer** — Use `@react-pdf/renderer` or `puppeteer` to generate PDFs server-side:
   - Load the template schema + filled data + org branding
   - Render a React component (or HTML template) with the document layout
   - Inject: org logo (from R2 signed URL), header text, footer text, accent color
   - A4 format, print-ready margins
   - Auto-stamp the document reference number
2. **`generatePDF` server function** — Accepts document ID. Renders PDF → Uploads to R2 → Updates `document.pdfUrl` → Sets status to `generated`. Returns the signed download URL.
3. **PDF layout per document type** — Fixed layout templates for BL, Quotation, Invoice, Packing List, SI. Each type has a specific field arrangement following industry conventions.
4. **Immutability** — Once a PDF is generated, the document status is `generated` and data cannot be edited. To make changes, the user must create a new version.

**Verify:** Generate a BL PDF → Download → Verify org logo appears, header/footer text is correct, all field values match, A4 format is correct, reference number stamped.

---

### Task 5.4: PDF Preview Component

**Files:** `src/components/documents/pdf-preview.tsx`

1. **In-app preview** — Render the PDF layout as a React component within the app (same layout as the actual PDF but rendered as HTML/React, not as a PDF embed).
2. **Side-by-side view** — Left: fill form, Right: live preview updating as the user types.
3. **Mobile consideration** — On smaller screens, preview is a modal/drawer triggered by "Preview" button.

**Verify:** Fill form fields → Preview updates in real time. All branding elements visible. Layout matches the generated PDF output.

---

### Task 5.5: Documents List Page

**Files:** `src/routes/_authenticated/documents/index.tsx`

1. **Table View** — Reference number, document type, template name, created by, date, status (badge).
2. **Filters** — Document type, status (Draft/Generated/Archived), date range, created by (Manager/Owner only).
3. **Row Actions** — "Edit" (Draft), "Download PDF" (Generated), "View" (all), "Archive".
4. **Search** — Search by reference number.
5. **Empty State** — "No documents yet. Create your first document." CTA.

**Verify:** Documents listed with all columns. Filter by type → Correct results. Click "Download PDF" → PDF downloads. Clerk sees only own docs.

---

## Phase 6 — Dashboard & Analytics

> **Goal:** Build the dashboard overview page with key metrics and quick actions.

### Task 6.1: Dashboard Page

**Files:** `src/routes/_authenticated/dashboard.tsx`, `src/server/functions/dashboard.functions.ts`

1. **Stats Cards** — Documents generated (this month), Active templates, Team members, Subscription plan.
2. **Recent Documents** — Last 5 documents with quick actions.
3. **Quick Actions** — "New Document", "New Template" (Manager+), "Invite Member" (Owner).
4. **Usage Progress** — If on Starter/Professional plan, show usage bars (Documents: X/50, Templates: X/5, Members: X/3).
5. **Activity Feed** — Recent activity (document created, template published, member joined).

**Verify:** Dashboard loads with real data. Stats reflect actual counts. Quick actions navigate correctly. Usage bars show accurate progress.

---

## Phase 7 — Subscription & Billing (Polar Integration)

> **Goal:** Integrate Polar for checkout, customer portal, and webhook-based plan management.

### Task 7.1: Polar Checkout Integration

**Files:** `src/server/functions/billing.functions.ts`, `src/routes/_authenticated/settings/billing.tsx`

1. **Billing Page** — Shows current plan, usage counters, "Upgrade" and "Manage Subscription" buttons.
2. **`createCheckoutSession` server function** — Calls the Polar API to create a checkout session for the selected plan. Returns the Polar checkout URL.
3. **`getCustomerPortalUrl` server function** — Returns the Polar customer portal URL where users can manage their subscription.
4. **Upgrade Prompts** — In-app banners/toasts when usage hits 80% and 100% of plan limits.

**Verify:** Click "Upgrade" → Redirected to Polar checkout. Complete checkout → Return to app → Plan updated.

---

### Task 7.2: Polar Webhook Handler

**Files:** `src/routes/api/webhooks/polar.ts`

1. **Webhook endpoint** — API route that receives Polar webhook events.
2. **Signature verification** — Validate the webhook signature using the Polar webhook secret.
3. **Event Handlers:**
   - `subscription.created` → Update org `subscriptionStatus` to `active`, set `subscriptionTier`.
   - `subscription.updated` → Update tier/status.
   - `subscription.canceled` → Set `subscriptionStatus` to `canceled`.
   - `checkout.completed` → Link Polar customer ID to org.
4. **Usage enforcement** — Application-layer checks before document generation, template creation, and member invitation that validate against plan limits.

**Verify:** Send a mock webhook → Verify org `subscriptionTier` and `subscriptionStatus` update in DB. Try to exceed plan limits → Blocked with upgrade prompt.

---

### Task 7.3: Plan Limit Enforcement Middleware

**Files:** `src/lib/server/plan-limits.ts`

1. **`checkPlanLimit` function** — Takes org ID and action type (create_document, create_template, invite_member). Queries current usage counts and compares against plan limits.
2. **Limit definitions:**
   - Starter: 50 docs/month, 5 templates, 3 members
   - Professional: 500 docs/month, unlimited templates, 15 members
   - Enterprise: unlimited
3. **Integration** — Called in `createDocument`, `createTemplate`, and `inviteMember` server functions before creating the resource.

**Verify:** On Starter plan → Create 5 templates → 6th attempt blocked. Upgrade to Professional → 6th attempt succeeds.

---

## Phase 8 — Email Integration (Resend)

> **Goal:** Transactional emails for team invites and document sharing.

### Task 8.1: Resend Email Integration

**Files:** `src/lib/server/email.ts`, `src/server/functions/email.functions.ts`

1. **Resend client setup** — Configure with `RESEND_API_KEY` env var.
2. **Invitation email** — Sent when a member is invited. Contains the org name, inviter name, role, and a link to accept the invitation.
3. **Document share email** — Sent when a user shares a document via email. Contains a signed URL to download the PDF (valid for 7 days).
4. **Email templates** — Clean, minimal HTML emails matching CargoSlate branding. Org logo dynamically included.

**Verify:** Invite a member → Email received with correct link. Share a document → Email with PDF download link received.

---

## Phase 9 — Polish, Performance & Pre-Deploy

> **Goal:** Final polish pass — error handling, loading states, accessibility, performance optimization.

### Task 9.1: Global Error & Loading States

**Files:** Various route and component files

1. **Route error boundaries** — Add `errorComponent` to all routes for graceful error display.
2. **Loading skeletons** — Add `pendingComponent` with shadcn `Skeleton` to all route files.
3. **Toast notifications** — Use `sonner` (already installed) for success/error feedback on all mutations.
4. **Empty states** — Add illustrated empty states for all list views (Documents, Templates, Team Members).

---

### Task 9.2: Accessibility & Keyboard Navigation

1. **Form builder** — Ensure drag-and-drop is accessible via keyboard (dnd-kit supports this).
2. **Focus management** — Proper focus trapping in modals/dialogs.
3. **ARIA labels** — All interactive elements have descriptive labels.
4. **Color contrast** — Verify WCAG 2.1 AA compliance for the olive/teal color palette.

---

### Task 9.3: SEO & Meta Tags

**Files:** Route `head()` functions

1. Update `title` and `meta` tags for each route.
2. Add proper `<h1>` hierarchy on every page.
3. Semantic HTML throughout (`<nav>`, `<main>`, `<section>`, `<article>`).

---

## Phase X — Verification Checklist

> **Run AFTER all phases are complete.**

- [ ] **Lint & Types:** `npm run lint && npx tsc --noEmit`
- [ ] **Security Scan:** `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] **UX Audit:** `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] **Build:** `npm run build` succeeds with zero errors
- [ ] **Lighthouse:** `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000`
- [ ] **Manual Test:** Complete onboarding → Create template → Generate PDF → Download → Verify
- [ ] **RBAC Test:** Owner/Manager/Clerk all see correct UI and are blocked from unauthorized actions
- [ ] **Cross-tenant Test:** Org A cannot see Org B's templates or documents
- [ ] **Socratic Gate Respected:** ✅
- [ ] **No purple/violet hex codes:** ✅

---

## Dependency Graph

```
Phase 1 (Schema + Auth)
  └──> Phase 2 (App Shell + Nav)
         ├──> Phase 3 (Settings/Branding)
         │      └──> Phase 5 (PDF needs branding data)
         ├──> Phase 4 (Form Builder)
         │      └──> Phase 5 (Doc Gen needs templates)
         └──> Phase 6 (Dashboard needs data)

Phase 7 (Billing) ← can start after Phase 1
Phase 8 (Email) ← can start after Phase 1
Phase 9 (Polish) ← after all features done
Phase X (Verification) ← final
```

---

## Packages to Install

| Package | Purpose | Phase |
| --- | --- | --- |
| `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` | Drag and drop for form builder | 4 |
| `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` | Cloudflare R2 file uploads/downloads | 3 |
| `@react-pdf/renderer` OR `puppeteer` | Server-side PDF generation | 5 |
| `resend` | Transactional email | 8 |
| `zod` | Schema validation for server functions | 1 |
| `framer-motion` | Micro-animations (drag, modals) | 4 |
