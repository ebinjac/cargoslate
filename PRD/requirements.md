# CargoSlate — Product Requirements Document

> **The modern operating system for maritime and freight documentation.**

**Version:** 1.1
**Status:** In Review
**Last Updated:** March 2026

---

## Table of Contents

1. [Brand Identity & Design System](#1-brand-identity--design-system)
2. [Executive Summary](#2-executive-summary)
3. [Problem Statement](#3-problem-statement)
4. [Target Audience & User Personas](#4-target-audience--user-personas)
5. [User Stories](#5-user-stories)
6. [Core Features — Phase 1](#6-core-features--phase-1)
7. [Document Types Specification](#7-document-types-specification)
8. [Subscription Tiers](#8-subscription-tiers)
9. [Technical Stack](#9-technical-stack)
10. [Data Model](#10-data-model)
11. [Application Navigation & UX Flows](#11-application-navigation--ux-flows)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Security & Compliance](#13-security--compliance)
14. [Success Metrics](#14-success-metrics)
15. [Constraints & Assumptions](#15-constraints--assumptions)
16. [Future Extensibility — Phase 2 & Beyond](#16-future-extensibility--phase-2--beyond)
17. [Glossary](#17-glossary)

---

## 1. Brand Identity & Design System

### Product Name
**CargoSlate**

### Tagline
*The modern operating system for maritime and freight documentation.*

### Design Philosophy
A strictly minimalistic interface where every element earns its place. The UI maximizes whitespace (or dark space) and maintains undivided focus on data and forms. No decorative chrome, no distracting gradients, no unnecessary motion — just the document, the data, and the task at hand.

### Color Palette

| Role | Value | Usage |
|---|---|---|
| Background | `#0A0A0A` | App shell, page backgrounds |
| Surface | `#111111` | Cards, modals, sidebars |
| Border | `#1F1F1F` | Dividers, input outlines |
| Text Primary | `#FAFAFA` | Headings, labels |
| Text Secondary | `#A1A1AA` | Descriptions, metadata |
| Accent | `#FFFFFF` | CTAs, active states |
| Destructive | `#EF4444` | Errors, delete actions |

> Dark mode is the default and only supported mode in Phase 1. Light mode is a Phase 2 consideration.

### Typography

| Role | Font | Weight |
|---|---|---|
| UI & Body | `Inter` or `Geist` | 400, 500 |
| Headings | `Inter` or `Geist` | 600, 700 |
| Monospace / Data | `Geist Mono` | 400 |

### Iconography
Lucide Icons — minimal, consistent line-weight icons that align with the shadcn/ui component library.

---

## 2. Executive Summary

CargoSlate is a **B2B SaaS platform** built specifically for shipping companies, freight forwarders, and logistics providers. It replaces manual, error-prone documentation workflows with a structured, template-driven system — enabling teams to create, fill, and export industry-standard shipping documents with speed, accuracy, and consistency.

The platform is built around a **Dynamic Form Builder** at its core, complemented by a white-labeling engine, a PDF generation pipeline, role-based access control, and a subscription billing system — delivering a complete documentation operating system from day one.

---

## 3. Problem Statement

Freight and logistics documentation today is fragmented, repetitive, and dangerously error-prone:

- **Manual re-entry** of the same shipment data across multiple document types (Bill of Lading, Packing List, Commercial Invoice) is the norm — leading to costly mistakes.
- **No standardization** across teams — different clerks use different Word/Excel templates, producing inconsistent outputs.
- **Branding is an afterthought** — most freight forwarders send plain documents with no professional formatting or company identity.
- **No audit trail** — there is no way to track who created, modified, or approved a document.
- **PDF exports are unreliable** — manually formatted Word documents break layout when exported, creating unprintable documents.

CargoSlate solves this by making **template-based, brand-consistent, audit-tracked document generation** the default — not the exception.

---

## 4. Target Audience & User Personas

### Persona 1 — The Operations Manager
**Name:** Ravi, Logistics Operations Manager
**Company size:** 20–80 employees
**Pain point:** His team of 8 clerks each has their own version of a Bill of Lading Excel template. Errors are frequent, formatting is inconsistent, and he has no visibility into what's been sent to clients.
**Goal:** Standardize all documentation across the team, reduce errors, and review documents before they leave the company.

### Persona 2 — The Documentation Clerk
**Name:** Priya, Shipping Documentation Clerk
**Company size:** Any
**Pain point:** She spends 40% of her day copy-pasting shipment details from emails and spreadsheets into Word documents, then reformatting them before saving as PDF.
**Goal:** Fill in shipment details quickly using a clean form UI and generate a professional PDF in one click.

### Persona 3 — The Freight Forwarder / Business Owner
**Name:** Ahmed, NVOCC Owner
**Company size:** 5–15 employees
**Pain point:** His company's documents look unprofessional compared to larger competitors. He also has no control over subscription costs as his team grows.
**Goal:** Present branded, professional documents to clients and control which team members have access to billing and settings.

---

## 5. User Stories

### Authentication & Onboarding
- As a new user, I can sign up and create a new Organization (Workspace) for my company.
- As an Owner, I can invite team members via email and assign them a role.
- As a team member, I can accept an invite and immediately access the Workspace.
- As a returning user, I can log in via email/password or an OAuth provider (Google).

### Role-Based Access
- As an Owner, I can change any team member's role or remove them from the Workspace.
- As a Manager, I can create and publish document templates but cannot access billing settings.
- As a Clerk, I can fill and generate documents from published templates but cannot create or edit templates.

### Branding
- As an Owner or Manager, I can upload my company logo and set my registered address in Workspace Settings.
- As an Owner or Manager, I can define a custom header and footer text that appears on all generated PDFs.

### Form Builder
- As a Manager, I can create a new document template by selecting a base document type.
- As a Manager, I can drag pre-built logistics field blocks onto a canvas to compose the template.
- As a Manager, I can mark specific fields as required, optional, or auto-calculated.
- As a Manager, I can save a template as a Draft or publish it to make it available to Clerks.
- As a Manager, I can archive a template to prevent new documents being created from it.

### Document Generation
- As a Clerk, I can select a published template and fill in the form fields.
- As a Clerk, I can preview the document before generating the final PDF.
- As a Clerk, I can generate a PDF and download it or share a link directly.
- As a Clerk, I can save a partially filled document and return to it later.

### Billing
- As an Owner, I can view my current subscription plan and usage.
- As an Owner, I can upgrade, downgrade, or cancel my subscription via the Polar customer portal.
- As an Owner, I receive an in-app notification when my organization approaches a usage limit.

---

## 6. Core Features — Phase 1

### 6.1 Multi-Tenant Authentication
Secure login with **Organization (Workspace)** isolation built on **Better Auth** — an open-source, self-hosted, fully TypeScript-native auth library. Each Organization is a fully isolated tenant. Users belong to exactly one Organization in Phase 1.

Supported auth methods:
- Email + Password
- Google OAuth

### 6.2 Role-Based Access Control (RBAC)

| Role | Billing | Settings | Template Builder | Document Generation | Member Management |
|---|---|---|---|---|---|
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ❌ | Partial | ✅ | ✅ | ❌ |
| **Clerk** | ❌ | ❌ | ❌ | ✅ | ❌ |

Every route and API action is guarded by role. Clerks accessing template builder routes are redirected with an appropriate error.

### 6.3 White-Labeling & Branding Engine
A dedicated **Workspace Settings → Branding** module:

- Company logo upload (PNG/SVG, max 2MB)
- Registered company name and address
- Custom PDF header text
- Custom PDF footer text (e.g., bank details, disclaimers)
- Optional accent color for PDF headings

All branding is stored per Organization and dynamically injected at PDF generation time — not baked into templates.

### 6.4 Dynamic Form Builder *(The Core Product)*
A visual, drag-and-drop canvas for building reusable document templates.

**Builder Capabilities:**
- Select a base document type (Bill of Lading, Quotation, Invoice, Packing List)
- Drag pre-built logistics field blocks from a left-hand panel onto the canvas
- Reorder, group, and delete fields
- Configure each field: label, placeholder, type, required/optional, default value
- Preview the template as it would appear in fill mode
- Save as Draft (not visible to Clerks) or Publish (live for Clerks)
- Archive published templates (frozen — no new documents, old ones remain accessible)
- Duplicate an existing template as a starting point

**Field Types Supported:**

| Field Type | Description |
|---|---|
| Short Text | Single-line text input |
| Long Text | Multi-line textarea |
| Number | Integer or decimal numeric input |
| Date Picker | Calendar date selector |
| Dropdown | Static options or pre-seeded logistics data |
| Checkbox / Toggle | Boolean field |
| Table | Dynamic rows (e.g., container lists, cargo line items) |
| Calculated Field | Derived from other numeric fields (e.g., Total CBM) |
| Display Text | Read-only labels, section headers, legal boilerplate |

### 6.5 Pre-built Logistics Blocks
Ready-to-use field group blocks that can be dropped onto any template canvas:

| Block Name | Contents |
|---|---|
| **Shipper & Consignee** | Shipper name/address, Consignee name/address, Notify party |
| **Vessel & Voyage** | Vessel name, Voyage number, Flag |
| **Port Information** | Port of Loading, Port of Discharge, Place of Delivery, Place of Receipt |
| **Container Table** | Container number, Seal number, Size/type, Tare weight (dynamic rows) |
| **Cargo Details** | Description of goods, HS Code selector, Marks & numbers |
| **Weight & Measurement** | Gross weight (KG), Net weight (KG), Volume (CBM), Package count, Package type |
| **Freight & Charges** | Freight terms (Prepaid/Collect), Charge descriptions, Currency, Amount |
| **Dates & References** | BL Number, Booking reference, Invoice number, Issue date |

### 6.6 PDF Generation Engine
- Pixel-perfect, print-ready PDF output at A4 size
- Company branding (logo, address, header/footer) injected dynamically at generation time
- Standardized layout per document type — consistent across all clerks and all documents
- Unique document reference number auto-stamped on each PDF
- Generated PDFs are stored in Cloudflare R2 and accessible from the document history view
- PDFs are immutable once generated — edits require creating a new document version

### 6.7 Document Management
A searchable, filterable **Documents** table as the operational home for all Clerks and Managers.

- Filter by: document type, template, date range, created by, status
- Each document record shows: reference number, document type, template name, creator, creation date, status
- Document statuses: `Draft`, `Generated`, `Archived`
- Owners and Managers can view all documents in the Workspace; Clerks see only their own

### 6.8 Subscription & Billing Management
Managed through **Polar** — an open-source, developer-first billing platform.

- Subscription management via the Polar-hosted customer portal (no custom billing UI required in Phase 1)
- Webhook-driven — subscription state is synced to the Organization record in the database in real time
- Usage counters tracked in-app (documents generated this billing period, active team members)
- Hard limits enforced at the application layer based on the active plan
- In-app upgrade prompts shown when limits are approached (80%) or hit (100%)

---

## 7. Document Types Specification

### 7.1 Bill of Lading (BL)
The primary contract of carriage between shipper and carrier. Fields include shipper, consignee, notify party, vessel, voyage, ports, container details, cargo description, weight, and freight terms. Legally significant — must be rendered with typographic precision.

### 7.2 Quotation / Rate Sheet
A commercial offer from the freight forwarder to their client. Fields include origin/destination, validity period, cargo description, rate breakdown per container type, and applicable surcharges.

### 7.3 Commercial Invoice
Used in customs clearance. Fields include seller, buyer, invoice number, date, HS codes, item descriptions, unit prices, total value, and currency.

### 7.4 Packing List
Accompanies the Commercial Invoice for customs. Fields include package count, package type, marks & numbers, net/gross weight per line, and total measurements.

### 7.5 Shipping Instructions (SI)
Internal document sent by the shipper to the freight forwarder with cargo details to prepare the Bill of Lading. Fields mirror the BL structure but are in draft/instruction format.

---

## 8. Subscription Tiers

| Feature | **Starter** | **Professional** | **Enterprise** |
|---|---|---|---|
| Team members | Up to 3 | Up to 15 | Unlimited |
| Documents / month | 50 | 500 | Unlimited |
| Templates | 5 | Unlimited | Unlimited |
| Document types | BL + Quotation | All 5 types | All 5 types + custom |
| White-labeling | Basic (logo only) | Full branding engine | Full + custom PDF fonts |
| PDF storage retention | 30 days | 1 year | Unlimited |
| Priority support | ❌ | ❌ | ✅ |
| Custom domain (Client Portal) | ❌ | ❌ | ✅ (Phase 2) |
| **Price** | $29 / month | $99 / month | Custom |

> All tiers include a **14-day free trial** with no credit card required, powered by Polar.

---

## 9. Technical Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | TanStack Start | Full-stack TypeScript, file-based routing, server functions — ideal for form-heavy, data-dense applications |
| **Database** | Neon (Serverless Postgres) | Serverless scaling, database branching per PR, PgBouncer connection pooling — purpose-built for multi-tenant SaaS |
| **ORM** | Drizzle ORM | Zero-abstraction TypeScript queries, predictable SQL output, native Neon compatibility, lightweight bundle |
| **UI Components** | Tailwind CSS + shadcn/ui | Accessible, unstyled primitives composed into a custom dark-mode design system |
| **Animations** | Framer Motion | Targeted micro-interactions on drag-and-drop, modal transitions, and state changes only |
| **Authentication** | Better Auth | Open-source, self-hosted, Drizzle-native — organizations, RBAC, and OAuth supported out of the box |
| **Payments** | Polar | Open-source billing with built-in checkout, customer portal, webhook events, and usage-based limits |
| **File Storage** | Cloudflare R2 | S3-compatible object storage for PDFs and logo uploads — zero egress fees |
| **Email** | Resend | Transactional email for invitations, document share links, and subscription alerts |

---

## 10. Data Model

```
Organization
├── id                      UUID, primary key
├── name                    string
├── slug                    string, unique (used in URLs)
├── logoUrl                 string | null
├── brandSettings           JSON (header, footer, address, accentColor)
├── polarCustomerId         string | null
├── subscriptionTier        enum (starter | professional | enterprise)
├── subscriptionStatus      enum (active | trialing | past_due | canceled)
└── createdAt               timestamp

User
├── id                      UUID, primary key
├── email                   string, unique
├── name                    string
├── avatarUrl               string | null
└── createdAt               timestamp

OrganizationMember          (join table — User ↔ Organization)
├── id                      UUID, primary key
├── userId                  → User
├── organizationId          → Organization
├── role                    enum (owner | manager | clerk)
└── joinedAt                timestamp

Template
├── id                      UUID, primary key
├── organizationId          → Organization
├── createdBy               → User
├── name                    string
├── documentType            enum (bill_of_lading | quotation | invoice | packing_list | shipping_instructions)
├── status                  enum (draft | published | archived)
├── schema                  JSON (ordered array of field block definitions)
└── createdAt / updatedAt   timestamps

Document
├── id                      UUID, primary key
├── referenceNumber         string, unique (auto-generated)
├── organizationId          → Organization
├── templateId              → Template
├── createdBy               → User
├── status                  enum (draft | generated | archived)
├── data                    JSON (field key → value map)
├── pdfUrl                  string | null (populated after generation)
└── createdAt / updatedAt   timestamps

Invitation
├── id                      UUID, primary key
├── organizationId          → Organization
├── invitedBy               → User
├── email                   string
├── role                    enum (manager | clerk)
├── status                  enum (pending | accepted | expired)
├── expiresAt               timestamp
└── createdAt               timestamp
```

---

## 11. Application Navigation & UX Flows

### Sidebar Navigation Structure

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

### Key User Flows

**Onboarding:**
`Sign Up → Create Organization → Invite Team → Branding Setup → Create First Template`

**Document Generation:**
`Documents → New Document → Select Template → Fill Form → Preview → Generate PDF → Download / Share`

**Template Creation:**
`Templates → New Template → Select Document Type → Drag & Drop Blocks → Configure Fields → Preview → Publish`

**Team Invitation:**
`Settings → Team Members → Invite by Email → Assign Role → Member Accepts via Email Link → Joins Workspace`

**Subscription Upgrade:**
`Settings → Billing → View Plan & Usage → Click Upgrade → Polar Checkout → Webhook Updates Org Tier`

---

## 12. Non-Functional Requirements

### Performance
- Initial page load under 2 seconds on standard broadband
- PDF generation completed within 5 seconds for standard documents
- Form builder interactions (drag, drop, reorder) must feel instantaneous — under 100ms

### Availability
- Target uptime: **99.9%** (less than 8.7 hours downtime per year)
- Neon's serverless architecture handles database scaling automatically

### Scalability
- Data model must support thousands of Organizations with full tenant isolation
- No cross-tenant data leakage is acceptable under any condition
- PDF storage on Cloudflare R2 scales independently of the database

### Accessibility
- All interactive UI components must meet **WCAG 2.1 AA** standards
- Full keyboard navigation support across form builder and document fill views
- shadcn/ui primitives (Radix UI) provide accessible foundations by default

### Browser Support
- Chromium-based browsers (Chrome, Edge, Arc) — primary target
- Firefox — fully supported
- Safari — supported
- Mobile browsers — read-only document viewing in Phase 1; form builder is desktop-only

---

## 13. Security & Compliance

### Authentication Security
- All sessions managed by Better Auth with secure, HTTP-only cookies
- OAuth tokens are never stored — only session references
- Invitation tokens are single-use and expire after 48 hours

### Data Isolation
- Every database query is scoped to the authenticated user's `organizationId`
- No shared state or data leakage between tenants is permitted at the application or database layer

### File Security
- PDFs and logo uploads stored in private Cloudflare R2 buckets
- Files accessed via short-lived signed URLs — never exposed as public static assets

### Data Retention
- PDF files retained per active subscription tier (30 days / 1 year / unlimited)
- On cancellation, Organizations receive a 30-day grace period to export data before deletion

### Compliance
- GDPR-ready — Organization Owners can request full data erasure
- All data stored in compliant infrastructure (Neon, Cloudflare)
- No PII shared with third-party analytics services in Phase 1

---

## 14. Success Metrics

### Acquisition
- New Organizations created per month
- Trial-to-paid conversion rate — target: **>25%**

### Activation
- % of new Organizations that publish their first template within 7 days — target: **>60%**
- % of new Organizations that generate their first PDF within 14 days — target: **>70%**

### Retention
- Monthly Active Organizations (MAO)
- Monthly churn rate — target: **<3%**
- Documents generated per active Organization per month (engagement depth)

### Revenue
- Monthly Recurring Revenue (MRR)
- Average Revenue Per Organization (ARPO)
- Upgrade rate: Starter → Professional

### Quality
- PDF generation error rate — target: **<0.5%**
- Average time from template selection to PDF download

---

## 15. Constraints & Assumptions

### Constraints
- Phase 1 is desktop-first. Mobile form-building is out of scope.
- A User belongs to a single Organization in Phase 1. Cross-org membership is Phase 2.
- PDF layout is fixed per document type in Phase 1. Full layout customization is Phase 2.
- All monetary transactions are handled by Polar — CargoSlate never stores card data.

### Assumptions
- Target users are comfortable with English-language interfaces. Localization is not in Phase 1 scope.
- Organizations will primarily generate A4-format documents. US Letter support is a future option.
- HS Code data will be pre-seeded from a publicly available customs tariff dataset.
- Port of Loading/Discharge dropdowns will be seeded from the UN/LOCODE dataset.

---

## 16. Future Extensibility — Phase 2 & Beyond

### Client Portal
A secure, branded portal where the freight forwarder's end clients can log in to view quotes, approve them digitally, and track the status of their Bills of Lading — without requiring a CargoSlate account.

### AI-Powered Document Extraction
Upload a legacy PDF Bill of Lading or scanned document. An AI pipeline extracts all structured fields and pre-populates a CargoSlate form — eliminating manual re-entry of historical document data.

### Workflow Approvals & E-Signatures
Multi-step approval chains where a Manager or Owner must review and digitally sign off on a document before it is dispatched to a client. Full audit log of all approval actions.

### Reusable Address Book
A shared, Organization-wide directory of Shippers, Consignees, and Notify Parties — selectable and auto-fillable into any form to eliminate repetitive address entry.

### Document Versioning
Full version history per Document — track every edit, who made it, and when. Ability to restore a previous version or compare two versions side by side.

### API & ERP Integrations
A public REST API and webhooks to push finalized document data directly into ERP systems (SAP, Oracle) or shipment tracking platforms — enabling CargoSlate to function as a structured data source, not just a document generator.

### Light Mode
A light mode design variant as a user preference toggle, maintaining the same minimalistic aesthetic in a white/off-white environment.

---

## 17. Glossary

| Term | Definition |
|---|---|
| **BL / Bill of Lading** | A legally binding document issued by a carrier acknowledging receipt of cargo for shipment |
| **NVOCC** | Non-Vessel Operating Common Carrier — a freight forwarder that issues Bills of Lading but does not operate vessels |
| **CBM** | Cubic Meter — the standard unit of measurement for cargo volume |
| **HS Code** | Harmonized System Code — an international nomenclature for classifying traded products in customs |
| **UN/LOCODE** | United Nations Code for Trade and Transport Locations — a standard list of port and location codes |
| **Freight Forwarder** | A company that organizes shipments on behalf of importers/exporters |
| **Organization / Workspace** | A single company account in CargoSlate containing all its users, templates, and documents |
| **Template** | A reusable document structure created by a Manager using the Form Builder |
| **Document** | A filled instance of a Template, resulting in a generated PDF |
| **RBAC** | Role-Based Access Control — restricting system access based on a user's assigned role |
| **Polar** | Open-source billing platform managing CargoSlate's SaaS subscriptions |
| **Better Auth** | Open-source authentication library managing CargoSlate's user sessions and organizations |
| **Neon** | Serverless Postgres database provider used as CargoSlate's primary data store |
| **Drizzle ORM** | TypeScript-native ORM used to interact with the Neon Postgres database |
| **Cloudflare R2** | S3-compatible object storage for PDFs and uploaded assets |