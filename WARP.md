# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- **Start Development Server**: `npm run dev` - Starts Vite dev server with hot reload
- **Build for Production**: `npm run build` - TypeScript compilation + Vite build
- **Preview Production Build**: `npm run preview` - Preview built application locally
- **Lint Code**: `npm run lint` - ESLint with TypeScript support, reports unused disable directives

### Testing Single Components
To test individual components during development:
```bash
# Start dev server and navigate to specific routes
npm run dev
# Then login with test credentials and navigate to component routes
```

### Test User Accounts
The system uses mock authentication with these credentials (all passwords: `12345`):
- `marketing`, `operational`, `hrd`, `pengadaan`, `finance`, `gudang`
- `management`, `qhse`, `accounting`, `tax`, `ga`, `procon`

## Architecture Overview

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS with PostCSS
- **Rich Text Editor**: TinyMCE React, React Quill
- **UI Components**: Lucide React icons, React Icons
- **Forms & Inputs**: React DatePicker, React Modal
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF
- **Notifications**: React Toastify
- **Routing**: React Router DOM v7.9.1

### Application Structure

#### Authentication System
- Role-based authentication with 12 user roles
- Mock user system in `AuthContext.tsx` with predefined credentials
- Route-based navigation tied to user roles
- Default landing pages per role (e.g., operational users go to timesheet dashboard)

#### Main Application Architecture
```
App.tsx (Root)
├── AuthProvider (Context wrapper)
├── Login (Unauthenticated state)
└── Authenticated Layout
    ├── Navbar (Top navigation)
    ├── MenuBar (Role-based sidebar navigation)  
    └── Dashboard (Main content router)
```

#### Dashboard Routing System
The `Dashboard.tsx` component serves as a massive route handler with 200+ imported components, organized by department:

**Core Departments:**
- **Marketing**: Suspect/Prospect management, Sales Orders, Contracts, Penawaran
- **Operations**: Timesheet management, Production processes, Manpower planning  
- **HRD**: Recruitment, Employee management, Training, Payroll, Contracts
- **Finance**: AP/AR, Vouchers, Bank transactions, Reporting, Asset management
- **Procurement**: Vendor management, PO processing, Supplier selection
- **Warehouse**: Inventory management, Stock tracking, Asset monitoring
- **QHSE**: 13+ safety/quality modules (KPI, MCU, Equipment, Compliance)
- **Accounting**: Asset management, PPh21, Jurnal, Trial Balance
- **General Affairs**: Asset handover, Document management

#### QHSE Module Structure
Based on the detailed implementation status, QHSE has 13 main modules:
1. **KPI Department** - Performance tracking dashboard
2. **Kompetensi Perusahaan** - Company certifications with expiry warnings  
3. **QHSE Performance** - Lagging/Leading indicators tracking
4. **Kamera Radiography** - Isotope inventory and monitoring
5. **Daftar Alat Ukur** - Equipment calibration management
6. **Medical Check Up Personil** - Personnel health monitoring
7. **Kompetensi Personil** - Personnel training/certification
8. **APD (Personal Protective Equipment)** - Distribution and quota management
9. **Nomor Report** - Report numbering system
10. **Log Book RAT/TLD** - Personnel logbook systems
11. **ISO System** - Internal document management
12. **Document Management** - External documents and approvals

### Component Architecture Patterns

#### Modal-Based Workflows
Most components follow a consistent pattern:
- Main dashboard with data tables
- Action buttons triggering modals for CRUD operations  
- Form validation and state management within modals
- Toast notifications for user feedback

#### Print Templates
Specialized print template system for documents:
- `ProformaInvoicePrintTemplate.tsx` - Professional invoice printing
- `BASerahTerimaPrintTemplate.tsx` - Asset handover forms
- Print-optimized CSS in `styles/print.css`
- A4 format with company branding

#### State Management
- Component-level state using React hooks
- Authentication context for user session
- No global state management library (Redux/Zustand)
- Direct component-to-component prop passing

### Development Patterns

#### File Organization
- Single large `Dashboard.tsx` as main router (200+ imports)
- Individual component files for each business module
- Shared components like modals and alerts
- Context providers in separate `/context` directory

#### Naming Conventions
- Components: PascalCase with descriptive department prefixes
- Files: Match component names exactly
- CSS: Tailwind utility classes with custom print styles

#### Common Component Structure
```typescript
// Typical dashboard component pattern:
- State hooks for data management
- Modal visibility states  
- CRUD operation handlers
- Search/filter functionality
- Export capabilities (Excel/PDF)
- Responsive table layouts
```

## Key Integration Points

### Authentication Flow
New users must be added to the `mockUsers` array in `AuthContext.tsx` with role assignments that match the MenuBar role checks.

### Adding New Modules
1. Create component in `/src/components/`
2. Import in `Dashboard.tsx` (line ~200)
3. Add routing logic in Dashboard render method
4. Update MenuBar with appropriate navigation items
5. Consider role-based access control

### Print Template Integration
Follow the pattern established in Proforma Invoice and BA Serah Terima:
- Create print template component
- Add print state management to main component
- Import print CSS styles
- Implement modal-based preview system

## Development Notes

### Current System Status
- 54% complete based on QHSE implementation status
- 7 of 13 QHSE modules fully implemented
- Strong foundation with core business modules operational
- Active development on missing QHSE components

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration with React hooks rules
- Vite-optimized development environment
- Print-friendly responsive design

### Performance Considerations
- Large Dashboard component with 200+ imports may impact bundle size
- Consider code splitting for better performance
- Vite handles hot reload efficiently despite large component count
- Lucide React icons excluded from optimization (vite.config.ts)