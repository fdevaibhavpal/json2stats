# JsonDash - Product Roadmap

## Vision
Transform arbitrary JSON into beautiful, searchable, sortable, paginated tables and dashboards. Bridge the gap between machine output and human action.

## Why This Idea is Great

* **JSON is everywhere but humans read tables** - This tool bridges machine output → human action
* **Low friction**: paste JSON → instant structure, filters, charts, exports
* **Helps decisions faster**: marketers, product managers, analysts, creators, devs all get value
* **Makes creators more engaging**: convert scraped leads or analytics into actionable lists, segments, and visuals

## Problems It Solves

* Removes manual data-cleanup / Excel copy-paste steps
* Makes ad-hoc API/chat outputs instantly actionable
* Provides fast exploration (search, filter, sort, paginate) for non-technical users
* Ships insights (charts, counts, trends) alongside raw data
* Standardizes reporting across teams (one source-of-truth view & exports)

## Target Users

* **Founders / small businesses**: leads, invoices, product metrics
* **Freelancers / agencies**: client lists, proposals, campaign data
* **Creators**: audience lists, content metadata, performance metrics
* **Analysts / PMs**: quick dataset exploration before loading into BI
* **Developers / QA**: API responses, logs, test outputs
* **Anyone using ChatGPT** who pastes JSON and wants instant tables & charts

## Core Features (MVP)

### 1. Data Input
- [x] Paste JSON input
- [x] Upload JSON files
- [x] Support arrays of objects & newline-delimited JSON
- [x] Auto-detect schema with type inference

### 2. Table View
- [x] Default page size 20 (user-adjustable: 10/20/50/100)
- [x] Pagination controls (first/prev/next/last + jump-to-page)
- [x] Column resizing and show/hide columns
- [x] Responsive design with mobile-friendly layout

### 3. Search & Filter
- [x] Global fuzzy search (search across all visible fields)
- [x] Column-specific search
- [x] Debounced search (300ms)
- [x] Type-aware filters (range for numbers/dates, multi-select for categories)
- [x] Filter by category with quick left panel
- [x] Save filter presets

### 4. Sorting
- [x] Single & multi-column sorts (asc/desc)
- [x] Stable sort for predictable ordering
- [x] Visual sort indicators

### 5. Export & Actions
- [x] Export CSV, XLSX, JSON (filtered & sorted)
- [x] Copy row functionality
- [x] Open URL fields
- [x] Call-to-action buttons

### 6. Analytics
- [x] Basic aggregation/stat cards
- [x] Count, sum/avg for numeric columns
- [x] Min/max, distinct count for columns

### 7. Accessibility
- [x] Keyboard navigation
- [x] Screen reader friendly
- [x] ARIA labels and roles

## Delightful Extras (Stage 2)

### Charts & Visualization
- [ ] Bar/line/pie charts built from selected fields
- [ ] Interactive drill-down from charts to table
- [ ] Pivot table functionality

### AI & Automation
- [ ] Auto-insights: short textual summary of dataset
- [ ] Anomaly detection
- [ ] Suggested segments and filters

### Collaboration & Sharing
- [ ] Saved views & sharing
- [ ] Generate sharable links with current filters & columns
- [ ] Embed code for dashboards

### Advanced Features
- [ ] Scheduled reports (email/Slack)
- [ ] Row-level actions (bulk-edit, bulk-delete, send emails)
- [ ] Custom columns / formulas
- [ ] Data validation rules
- [ ] Theme & branding for white-labeling

## Integrations

### Data Sources
- [ ] Google Sheets import/export + two-way sync
- [ ] Airtable / Notion / Coda connectors
- [ ] CSV / Excel upload & parsing
- [ ] Google Analytics / Meta Ads API connectors

### Automation
- [ ] Webhooks + Zapier / Make integration
- [ ] Slack / Email notifications
- [ ] Scheduled exports

### Authentication & Storage
- [ ] Google/GitHub SSO
- [ ] Keycloak for enterprise
- [ ] S3 or DB for saved datasets
- [ ] Stripe integration for pro features

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Table**: TanStack Table (react-table v8)
- **State**: Zustand + React Query
- **Search**: Fuse.js (fuzzy search)
- **Charts**: Recharts
- **File Processing**: PapaParse + SheetJS

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Fastify/Express
- **Database**: PostgreSQL or MongoDB
- **Storage**: S3 for files
- **Auth**: NextAuth.js
- **Hosting**: Vercel + serverless functions

### Performance Considerations
- Client-side pagination for < 10k rows
- Server-side pagination for larger datasets
- Virtualized rows for smooth UI
- Precomputed aggregates on upload
- Debounced search and filters

## Data Behavior Specifications

### Default Settings
- **Page size**: 20 items (user-adjustable)
- **Search**: Fuzzy match using Fuse.js with field weighting
- **Pagination**: Client-side for < 10k rows, server-side for larger
- **Sort**: Multi-column support with stable sort
- **Nested fields**: Flatten on upload with collapse option

### Security & Privacy
- Ephemeral datasets for non-logged users (auto-delete after X hours)
- Auth-required for saving datasets & sharing links
- Optional encryption for stored datasets
- Role-based access for team features

## MVP Roadmap

### Phase 1: Core Table (Weeks 1-2)
- [x] JSON parsing and schema detection
- [x] Basic table with pagination
- [x] Search and sort functionality
- [x] Export to CSV

### Phase 2: Usability (Weeks 3-4)
- [x] Column controls (show/hide, resize)
- [x] Advanced filters
- [x] Category chips
- [x] Responsive design

### Phase 3: Analytics (Weeks 5-6)
- [x] Stat cards and aggregations
- [x] Basic charts
- [x] Data insights

### Phase 4: Integrations (Weeks 7-8)
- [x] CSV/Excel import
- [x] Google Sheets sync
- [x] Webhook integrations

### Phase 5: AI & Automation (Weeks 9-10)
- [x] Dataset summaries
- [x] Anomaly detection
- [x] Scheduled reports

## Business Model

### Freemium Tier
- Basic paste + 20 rows + exports
- Limited saved views
- Community support

### Pro Tier ($19/month)
- Unlimited rows
- Saved datasets
- Scheduled reports
- Google Sheets sync
- AI insights
- Priority support

### Team/Enterprise ($99/month)
- SSO integration
- Role-based access
- Private hosting
- Custom branding
- Dedicated support

## Success Metrics

### User Engagement
- Time to first table creation
- Export frequency
- Return usage rate
- Feature adoption rate

### Business Metrics
- Monthly active users
- Conversion rate (free → paid)
- Customer lifetime value
- Churn rate

## Example Use Cases

### Marketing
Paste ad-report JSON → segment high-converting audiences → export to ad platform

### Sales
Paste leads JSON → filter by location/industry → export to CRM

### Creators
Paste comment/engagement JSON → find top fans, export for outreach

### Developers
Paste API response → inspect nested objects, convert to flat table to debug

## Next Steps

1. **Immediate**: Set up development environment
2. **Week 1**: Build core JSON parsing and table components
3. **Week 2**: Implement search, sort, and filter functionality
4. **Week 3**: Add export capabilities and responsive design
5. **Week 4**: Polish UI/UX and add dark/light mode
6. **Week 5**: Begin analytics and chart features
7. **Week 6**: Test with real-world datasets
8. **Week 7**: Prepare for beta launch
9. **Week 8**: Gather feedback and iterate

---

*Last updated: [Current Date]*
*Version: 1.0*
