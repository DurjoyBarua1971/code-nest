## 🧮 Code Nest Admin Dashboard - Developer Documentation

### 1. 📌 Project Overview

This project is an **admin dashboard for "Code Nest"**, a platform to manage coding problems and monitor platform activity. It provides a full-featured interface for administrators to perform **CRUD operations** on coding problems and view **platform analytics** such as user activity, problem distribution, and submission trends. Built with **Next.js (App Router)** and **TypeScript**, it uses **PrimeReact** and **Tailwind CSS** for UI, **Supabase** for authentication, and **json-server** as a mock API for problem data.

### 🔗 Project Repository

[GitHub – Code Nest Admin Dashboard](https://github.com/DurjoyBarua1971/code-nest)

---

### 2. 🚀 Feature List

| Feature | Description |
| --- | --- |
| Authentication | Login via email/password and Google OAuth with route protection under `/dashboard` |
| Analytics Dashboard | Visual cards and charts showing user and problem stats |
| Problem Management | Paginated + sortable table with filters (title, difficulty, date); Create, Edit, Delete functionality |
| Activity Log | Shows all admin actions like problem creation, edits, and deletions with timestamps |
| Toast Feedback | Real-time success/error feedback with PrimeReact's Toast |
| Responsive Layout | Fully responsive layout with Tailwind CSS and skeleton loaders |
| Type Safety | TypeScript interfaces for core entities like `Problem`, `ActivityLogEntry` |
| UI Icons & Components | PrimeReact + custom renderers for dynamic UI elements |
| JSON Server Integration | Simulated backend for problems with pagination support |

---

### 3. 🗂️ File & Folder Structure

| File/Folder | Description |
| --- | --- |
| `app/` | Next.js App Router directory |
| `page.tsx` | Root auth portal (login/register) |
| `app/dashboard/` | Admin dashboard pages |
| `page.tsx` | Dashboard overview (stats + charts) |
| `create-problem/page.tsx` | Form to create or edit a coding problem |
| `problem-bank/page.tsx` | Table for listing and managing problems |
| `activity-log/page.tsx` | Displays a log of all admin activities |
| `lib/` | Core utilities and shared logic |
| `api.ts` | Axios config and helpers for logging actions |
| `action.ts` | Server actions for authentication |
| `types.ts` | TypeScript interfaces |
| `supabase/` | Supabase client config (client/server) |
| `ui/` | Reusable UI components |
| `ProblemTable.tsx` | DataTable with sorting, actions, pagination |
| `ProblemFilter.tsx` | Filtering inputs for problem bank |
| `sidenav.tsx` | Sidebar navigation layout |
| `data/db.json` | Mock problem database for json-server |
| `middleware.ts` | Auth middleware for protecting dashboard routes |
| `package.json` | Dependencies and scripts |

---

### 4. 🧩 Open Source Libraries Used & Customization

- **PrimeReact**:
    - `DataTable` customized with `difficultyBodyTemplate`, `actionBodyTemplate`, etc.
    - `Toast` component for feedback after user actions.
    - Composed UI with `Card`, `InputText`, `Dropdown`, and `Button`.
- **Tailwind CSS**: For layout, spacing, typography, and responsiveness.
- **Supabase**: Auth with email/password and Google OAuth; session-based route protection.
- **json-server**: Used to mock REST API endpoints with pagination and filters.
- **React Hook Form**: Used for problem form validation and input control.
- **Axios**: Configured for client-server API calls.

**Customization Highlights**:

- PrimeReact DataTable is extended with dynamic icon rendering and custom action buttons.
- Authentication flow is split between server-side and client-side using Supabase utilities.
- Admin activity is tracked and logged using a helper API function.

---

### 5. ⏱️ Task Estimation

- **Estimated time for a trainee or beginner (without AI):** 10–15 working days
    
    This includes setting up Supabase, creating CRUD forms, configuring filters, understanding PrimeReact composition, and implementing route protection and analytics.
    
- **Estimated time with AI tools (GitHub Copilot, ChatGPT, Claude):** 3-5 working days
    
    AI support accelerates layout generation, REST API handling, Supabase auth integration, and form validation with libraries like `react-hook-form`.
    

### ⚠️ Challenges

1. **Authentication Flow**: Supabase integration on both client and server requires deep understanding of session management ( backward compatibility issues has been detected).
2. **JSON SERVER:** You have to go through documentation as AI generate outdated code

---

### 6. 🧠 Potential AI Hallucinations / Debugging Notes

| Area | Possible Issue | Debugging Tip |
| --- | --- | --- |
| Supabase Auth | AI might suggest outdated or client-only login methods | Use server-side helpers in `action.ts` for consistent session handling |
| json-server | AI may assume full REST support (e.g., PATCH, nested routes) | Stick to simple query param patterns supported by json-server |
| PrimeReact DataTable | AI could hallucinate props that don't exist (e.g., `columnKey`) | Refer to official PrimeReact DataTable API |

---

### 7. 🌱 Suggested Features

1. **User Management Tab**
    
    Create `/dashboard/users` to list and manage users fetched from Supabase. Include role or status toggling.
    
2. **Bulk Import/Export**
    
    Add CSV/JSON upload to mass-import problems. Also, implement export of filtered problems list.
    
3. **Advanced Analytics**
    
    Add stacked bar charts for problem submission trends by difficulty or timeframe to track platform engagement.