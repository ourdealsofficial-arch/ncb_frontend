# Frontend Documentation - Franchise Management System

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Directory Structure](#directory-structure)
5. [Setup & Installation](#setup--installation)
6. [Component Library](#component-library)
7. [Pages](#pages)
8. [Routing](#routing)
9. [State Management](#state-management)
10. [Services & API Integration](#services--api-integration)
11. [Hooks](#hooks)
12. [Styling & Theming](#styling--theming)
13. [Authentication Flow](#authentication-flow)
14. [Features](#features)
15. [Configuration](#configuration)
16. [Building for Production](#building-for-production)
17. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a **React-based Frontend Application** for the Franchise Management System. It provides a modern, responsive, and premium UI for managing franchises, food menus, bills, payments, and analytics.

### Key Features
- 🎨 **Premium Design** - Modern, visually appealing interface
- 🔐 **Role-Based Access** - Different dashboards for Super Admin and Franchise Admin
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Performance Optimized** - Lazy loading, code splitting, and optimizations
- 🎯 **User-Friendly** - Intuitive navigation and user experience
- 💳 **Razorpay Integration** - Secure online payment processing
- 📊 **Analytics Dashboard** - Visual data representation with charts
- 🔔 **Real-time Feedback** - Toast notifications and loading states

---

## Technology Stack

### Core Technologies
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Language**: JavaScript (ES6+)
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios 1.13.2

### UI & Styling
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.1.17 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.1.17 | Vite plugin for Tailwind |
| `framer-motion` | ^12.23.24 | Animation library |
| `lucide-react` | ^0.553.0 | Icon library |

### Key Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| `firebase` | ^12.6.0 | File storage & hosting |
| `recharts` | ^3.4.1 | Charts and data visualization |
| `qrcode` | ^1.5.4 | QR code generation |
| `jspdf-autotable` | ^5.0.2 | PDF generation |
| `react-to-pdf` | ^2.0.1 | React component to PDF |
| `react-confetti` | ^6.4.0 | Celebration effects |
| `prop-types` | ^15.8.1 | Runtime type checking |

### Development Tools
- **ESLint** - Code linting
- **@vitejs/plugin-react** - React support for Vite
- **TypeScript Definitions** - Type hints for React

---

## Architecture

### Component Hierarchy

```
App.jsx (Root)
├── ErrorBoundary (Global error handling)
├── AuthProvider (Authentication context)
├── BrowserRouter (Routing)
│   ├── Navbar (Global navigation)
│   └── Suspense (Lazy loading wrapper)
│       └── Routes
│           ├── Public Routes
│           │   ├── LandingPage
│           │   └── LoginPage
│           │
│           ├── Protected Routes
│           │   ├── VerificationPage (OTP)
│           │   ├── Dashboard (Role-based)
│           │   │   ├── SuperAdminDashboard
│           │   │   └── FranchiseAdminDashboard
│           │   │
│           │   ├── Super Admin Only
│           │   │   ├── CreateFranchise
│           │   │   ├── FoodManagementPage
│           │   │   └── FranchiseDetailsPage
│           │   │
│           │   ├── Franchise Admin Only
│           │   │   └── FoodAvailabilityPage
│           │   │
│           │   └── Common (Both Roles)
│           │       ├── BillManagementPage
│           │       ├── PaymentHistoryPage
│           │       ├── AnalyticsPage
│           │       └── ProfilePage
```

### Data Flow Architecture

```
┌──────────────┐
│   User UI    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Components  │ ──▶ User interactions
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Services   │ ──▶ API calls via Axios
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     API      │ ──▶ Backend endpoints
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Context/   │ ──▶ Global state updates
│    State     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Re-render   │ ──▶ UI updates
└──────────────┘
```

---

## Directory Structure

```
frontend_1.0/
├── public/
│   └── vite.svg                # Favicon
│
├── src/
│   ├── assets/                 # Static assets
│   │   └── react.svg
│   │
│   ├── component/              # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Loading.jsx
│   │   ├── Modal.jsx
│   │   ├── NavBar.jsx
│   │   ├── OptimizedImage.jsx
│   │   ├── Pagination.jsx
│   │   ├── PrintableBill.jsx
│   │   ├── PrintableMenu.jsx
│   │   ├── RazorpayCheckout.jsx
│   │   └── Toast.jsx
│   │
│   ├── components/             # Special components
│   │   ├── ErrorBoundary.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── config/                 # Configuration files
│   │   ├── api.js             # Axios instance & interceptors
│   │   ├── firebase.js        # Firebase configuration
│   │   └── Upload.jsx         # File upload component
│   │
│   ├── context/                # React Context
│   │   └── AuthContext.jsx    # Authentication state
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   └── useToast.js
│   │
│   ├── pages/                  # Page components
│   │   ├── AnalyticsPage.jsx
│   │   ├── BillManagementPage.jsx
│   │   ├── CreateFoodPage.jsx
│   │   ├── CreateFranchise.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DashboardRouter.jsx
│   │   ├── DebugPage.jsx
│   │   ├── FoodAvailabilityPage.jsx
│   │   ├── FoodManagementPage.jsx
│   │   ├── FooodPage.jsx
│   │   ├── FranchiseAdminDashboard.jsx
│   │   ├── FranchiseDetailsPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PaymentHistoryPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── SuperAdminDashboard.jsx
│   │   ├── Verification.jsx
│   │   └── ViewBill.jsx
│   │
│   ├── services/               # API service modules
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   ├── billService.js
│   │   ├── foodService.js
│   │   └── franchiseService.js
│   │
│   ├── styles/                 # Additional styles
│   │   └── [style files]
│   │
│   ├── utils/                  # Utility functions
│   │   └── [utility files]
│   │
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
│
├── .gitignore
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package.json               # Dependencies
├── package-lock.json
└── vite.config.js             # Vite configuration
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Backend server running (on http://localhost:5000)

### Installation Steps

**1. Navigate to Frontend Directory**
```bash
cd frontend_1.0
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure API Endpoint**

Edit `src/config/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Change if backend is on different URL
  withCredentials: true,
});
```

**4. Configure Firebase (Optional)**

If using Firebase for image uploads, edit `src/config/firebase.js` with your Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};
```

**5. Start Development Server**
```bash
npm run dev
```

**Output:**
```
VITE v7.2.2  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## Component Library

### 1. Badge Component (`component/Badge.jsx`)

**Purpose:** Display status badges with different colors and styles.

**Usage:**
```jsx
import Badge from '../component/Badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Inactive</Badge>
```

**Props:**
- `variant` - Color theme (success, warning, danger, info)
- `children` - Badge text content

---

### 2. Button Component (`component/Button.jsx`)

**Purpose:** Reusable button with consistent styling.

**Usage:**
```jsx
import Button from '../component/Button';

<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

<Button variant="secondary" disabled>
  Loading...
</Button>
```

**Props:**
- `variant` - Style variant (primary, secondary, danger, success)
- `onClick` - Click handler
- `disabled` - Disabled state
- `loading` - Show loading spinner
- `children` - Button text/content

---

### 3. Card Component (`component/Card.jsx`)

**Purpose:** Container component for content sections.

**Usage:**
```jsx
import Card from '../component/Card';

<Card title="User Profile" subtitle="Manage your account">
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `title` - Card header title
- `subtitle` - Optional subtitle
- `children` - Card body content
- `className` - Additional CSS classes

---

### 4. Input Component (`component/Input.jsx`)

**Purpose:** Form input with label and validation.

**Usage:**
```jsx
import Input from '../component/Input';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  error={errors.email}
  required
/>
```

**Props:**
- `label` - Input label
- `type` - Input type (text, email, password, number, etc.)
- `value` - Input value
- `onChange` - Change handler
- `placeholder` - Placeholder text
- `error` - Error message to display
- `required` - Required field indicator

---

### 5. Loading Component (`component/Loading.jsx`)

**Purpose:** Loading spinner for async operations.

**Usage:**
```jsx
import Loading from '../component/Loading';

// Full screen loading
<Loading fullScreen />

// Inline loading
<Loading size="small" text="Loading..." />
```

**Props:**
- `fullScreen` - Center on entire screen
- `size` - Spinner size (small, medium, large)
- `text` - Loading text

---

### 6. Modal Component (`component/Modal.jsx`)

**Purpose:** Dialog/modal popup for forms and confirmations.

**Usage:**
```jsx
import Modal from '../component/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="medium"
>
  <p>Are you sure you want to delete this item?</p>
  <div className="modal-actions">
    <Button onClick={handleDelete}>Confirm</Button>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  </div>
</Modal>
```

**Props:**
- `isOpen` - Modal visibility state
- `onClose` - Close handler
- `title` - Modal header
- `size` - Modal size (small, medium, large)
- `children` - Modal content

---

### 7. NavBar Component (`component/NavBar.jsx`)

**Purpose:** Global navigation header.

**Features:**
- Responsive navigation
- User authentication status
- Role-based menu items
- Logout functionality
- Mobile hamburger menu

**Auto-renders based on auth state**

---

### 8. Pagination Component (`component/Pagination.jsx`)

**Purpose:** Paginate large lists/tables.

**Usage:**
```jsx
import Pagination from '../component/Pagination';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

**Props:**
- `currentPage` - Current page number
- `totalPages` - Total number of pages
- `onPageChange` - Page change callback

---

### 9. Toast Component (`component/Toast.jsx`)

**Purpose:** Notification messages.

**Usage:**
```jsx
import { useToast } from '../hooks/useToast';

const { showToast } = useToast();

showToast('Success!', 'success');
showToast('Error occurred', 'error');
showToast('Warning message', 'warning');
showToast('Information', 'info');
```

**Types:**
- `success` - Green success message
- `error` - Red error message
- `warning` - Yellow warning message
- `info` - Blue informational message

---

### 10. RazorpayCheckout Component (`component/RazorpayCheckout.jsx`)

**Purpose:** Integrate Razorpay payment gateway.

**Usage:**
```jsx
import RazorpayCheckout from '../component/RazorpayCheckout';

<RazorpayCheckout
  billId={billId}
  amount={totalAmount}
  onSuccess={handlePaymentSuccess}
  onFailure={handlePaymentFailure}
/>
```

**Props:**
- `billId` - Bill ID for payment
- `amount` - Payment amount
- `onSuccess` - Success callback
- `onFailure` - Failure callback

---

### 11. PrintableBill & PrintableMenu Components

**Purpose:** Generate printable/PDF versions of bills and menus.

**Features:**
- QR code for bills
- Formatted layout for printing
- Professional styling

---

## Pages

### Public Pages

#### 1. LandingPage (`pages/LandingPage.jsx`)

**Route:** `/`

**Features:**
- Hero section with premium design
- Feature highlights
- Call-to-action buttons
- Responsive layout
- Modern animations

**Access:** Public (unauthenticated users)

---

#### 2. LoginPage (`pages/LoginPage.jsx`)

**Route:** `/login`

**Features:**
- Email/password login form
- Form validation
- Error handling
- Redirect to dashboard on success
- Link to registration

**Form Fields:**
- Email (required)
- Password (required)

**Flow:**
1. User enters credentials
2. Form validation
3. API call to `/auth/login`
4. Store token and user data
5. Redirect based on verification status

---

#### 3. Verification Page (`pages/Verification.jsx`)

**Route:** `/verify`

**Features:**
- OTP input form
- Resend OTP functionality
- Email verification
- Auto-redirect after verification

**Flow:**
1. Generate OTP (if not sent)
2. User enters 6-digit OTP
3. Verify OTP via API
4. Mark account as verified
5. Redirect to dashboard

---

### Protected Pages

#### 4. Dashboard Router (`pages/DashboardRouter.jsx`)

**Route:** `/dashboard`

**Purpose:** Route to appropriate dashboard based on role.

**Logic:**
```javascript
if (user.role === "SUPER_ADMIN") {
  return <SuperAdminDashboard />
} else if (user.role === "FRANCHISE_ADMIN") {
  return <FranchiseAdminDashboard />
}
```

---

#### 5. Super Admin Dashboard (`pages/SuperAdminDashboard.jsx`)

**Route:** `/dashboard` (for Super Admin)

**Features:**
- Overview statistics (revenue, orders, franchises)
- Quick actions (Create Franchise, Add Food)
- Recent orders table
- Revenue charts
- Franchise list
- System-wide analytics

**Widgets:**
- Total Revenue Card
- Total Franchises Card
- Total Orders Card
- Top Selling Items Chart
- Revenue Trend Graph
- Franchise Performance Table

---

#### 6. Franchise Admin Dashboard (`pages/FranchiseAdminDashboard.jsx`)

**Route:** `/dashboard` (for Franchise Admin)

**Features:**
- Franchise-specific statistics
- Today's orders
- Revenue overview
- Quick access to bills
- Food availability management
- Payment history

**Widgets:**
- Today's Revenue
- Today's Orders
- Pending Payments
- Top Items (Franchise-specific)
- Recent Bills Table

---

#### 7. Create Franchise (`pages/CreateFranchise.jsx`)

**Route:** `/create-franchise`

**Access:** Super Admin Only

**Features:**
- Two-step form (Franchise Details + Admin Details)
- Form validation
- Address fields (city, state, pincode, country)
- Auto-create franchise admin user
- Success feedback

**Form Fields:**

**Franchise Details:**
- Business Name
- Owner Name
- Email
- Phone
- Address
- City
- State
- Pincode
- Country

**Admin Details:**
- Name
- Email
- Password
- Mobile Number

---

#### 8. Food Management Page (`pages/FoodManagementPage.jsx`)

**Route:** `/food-management`

**Access:** Super Admin Only

**Features:**
- View all food items
- Create new food items
- Edit existing items
- Delete items
- Filter by category
- Search functionality
- Image upload (Firebase)

**Food Categories:**
- Starters
- Main Course
- Beverages
- Desserts
- Snacks
- Chaat

---

#### 9. Food Availability Page (`pages/FoodAvailabilityPage.jsx`)

**Route:** `/food-availability`

**Access:** Franchise Admin Only

**Features:**
- Toggle food item availability
- View current availability status
- Filter by category
- Bulk availability updates

**Use Case:**
Franchise admins can mark items as unavailable if they're out of stock for the day.

---

#### 10. Bill Management Page (`pages/BillManagementPage.jsx`)

**Route:** `/bills`

**Access:** Both Roles (filtered by franchise for Franchise Admin)

**Features:**
- View all bills
- Create new bills
- Search by bill number
- Filter by date, payment status
- Print bill (PDF)
- Payment status tracking
- Delete bills

**Bill Details:**
- Bill number
- Customer name/phone
- Order items
- Subtotal
- Discount
- Total amount
- Payment method
- Payment status
- Date/time

---

#### 11. Payment History Page (`pages/PaymentHistoryPage.jsx`)

**Route:** `/payment-history`

**Access:** Both Roles

**Features:**
- List all payments
- Filter by date range
- Search by bill number
- Payment method breakdown
- Total revenue summary
- Export to PDF/Excel
- Razorpay transaction details

---

#### 12. Analytics Page (`pages/AnalyticsPage.jsx`)

**Route:** `/analytics`

**Access:** Both Roles

**Features:**
- Revenue charts (Recharts)
- Sales trends
- Top-selling items
- Category-wise breakdown
- Date range filters
- Comparative analytics
- Export reports

**Chart Types:**
- Line Chart (Revenue Trend)
- Bar Chart (Category Sales)
- Pie Chart (Payment Methods)
- Area Chart (Order Volume)

---

#### 13. Profile Page (`pages/ProfilePage.jsx`)

**Route:** `/profile`

**Access:** Authenticated Users

**Features:**
- View user details
- Edit profile information
- Change password
- View franchise details (for Franchise Admin)
- Account settings

---

#### 14. Franchise Details Page (`pages/FranchiseDetailsPage.jsx`)

**Route:** `/franchise/:id`

**Access:** Super Admin Only

**Features:**
- View franchise information
- Edit franchise details
- View associated admin
- Activate/deactivate franchise
- View franchise performance
- List franchise orders

---

## Routing

### Route Configuration

Routes are defined in `App.jsx`:

```jsx
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />

  {/* Protected Routes */}
  <Route 
    path="/verify" 
    element={
      <ProtectedRoute requireVerification={false}>
        <VerificationPage />
      </ProtectedRoute>
    } 
  />

  {/* Role-Based Routes */}
  <Route 
    path="/create-franchise" 
    element={
      <ProtectedRoute 
        requiredRole="SUPER_ADMIN" 
        requireVerification={true}
      >
        <FranchiseRegister />
      </ProtectedRoute>
    } 
  />

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Protected Route Component

Located in `components/ProtectedRoute.jsx`:

**Features:**
- Authentication check
- Role-based access control
- Verification requirement
- Auto-redirect to login
- Loading states

**Usage:**
```jsx
<ProtectedRoute 
  requiredRole="SUPER_ADMIN" 
  requireVerification={true}
>
  <ComponentToProtect />
</ProtectedRoute>
```

---

## State Management

### Global State (Context API)

#### AuthContext (`context/AuthContext.jsx`)

**Purpose:** Manage authentication state globally.

**State:**
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    role: "SUPER_ADMIN" | "FRANCHISE_ADMIN",
    franchiseId: string,
    isVerified: boolean,
    isActive: boolean
  },
  token: string,
  isAuthenticated: boolean,
  loading: boolean
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear auth state
- `updateUser(userData)` - Update user info

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Persistence:**
- Token stored in `localStorage`
- Auto-restore on page refresh
- Auto-logout on token expiry (24 hours)
- Periodic token validation (every 5 minutes)

---

### Local State (Component State)

Most components use React `useState` for local state management:

```jsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [error, setError] = useState(null);
```

---

## Services & API Integration

### API Configuration (`config/api.js`)

**Axios Instance:**
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});
```

**Request Interceptor:**
- Automatically adds JWT token to Authorization header
- Reads token from localStorage

**Response Interceptor:**
- Transforms MongoDB `_id` to `id` for consistency
- Handles 401 (Unauthorized) - Auto logout
- Handles 403 (Forbidden) - Permission errors
- Handles network errors

---

### Service Modules

#### 1. Auth Service (`services/authService.js`)

**Methods:**
```javascript
// Register new admin
authService.register(userData)

// Login user
authService.login(email, password)

// Generate OTP
authService.generateOTP(email)

// Verify OTP
authService.verifyOTP(email, otp)

// Get user profile
authService.getProfile()

// Create franchise with admin
authService.createFranchise(franchiseData, adminData)
```

---

#### 2. Food Service (`services/foodService.js`)

**Methods:**
```javascript
// Get all food items
foodService.getAllFoods()

// Create food item
foodService.createFood(foodData)

// Update food item
foodService.updateFood(id, foodData)

// Delete food item
foodService.deleteFood(id)

// Toggle availability
foodService.toggleAvailability(id)
```

---

#### 3. Bill Service (`services/billService.js`)

**Methods:**
```javascript
// Get all bills
billService.getAllBills(filters)

// Get bill by ID
billService.getBillById(id)

// Create new bill
billService.createBill(billData)

// Update bill
billService.updateBill(id, billData)

// Delete bill
billService.deleteBill(id)

// Create Razorpay order
billService.createRazorpayOrder(billId)

// Verify payment
billService.verifyPayment(paymentData)

// Get payment history
billService.getPaymentHistory()
```

---

#### 4. Analytics Service (`services/analyticsService.js`)

**Methods:**
```javascript
// Get dashboard stats
analyticsService.getDashboardStats()

// Get revenue trend
analyticsService.getRevenueTrend(startDate, endDate)

// Get top items
analyticsService.getTopItems()

// Franchise comparison
analyticsService.compareFranchises()
```

---

#### 5. Franchise Service (`services/franchiseService.js`)

**Methods:**
```javascript
// Get all franchises
franchiseService.getAllFranchises()

// Get franchise details
franchiseService.getFranchiseDetails(id)

// Toggle franchise status
franchiseService.toggleStatus(id)

// Update franchise
franchiseService.updateFranchise(id, data)
```

---

## Hooks

### Custom Hooks

#### 1. useAuth Hook

**Location:** `context/AuthContext.jsx`

**Purpose:** Access authentication state and methods.

**Usage:**
```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

---

#### 2. useToast Hook (`hooks/useToast.js`)

**Purpose:** Show toast notifications.

**Usage:**
```jsx
import { useToast } from '../hooks/useToast';

const { showToast } = useToast();

// Show success message
showToast('Operation successful!', 'success');

// Show error message
showToast('Something went wrong', 'error');
```

---

#### 3. useDebounce Hook (`hooks/useDebounce.js`)

**Purpose:** Debounce input values (for search).

**Usage:**
```jsx
import useDebounce from '../hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  // API call with debounced value
  searchAPI(debouncedSearchTerm);
}, [debouncedSearchTerm]);
```

---

#### 4. usePagination Hook (`hooks/usePagination.js`)

**Purpose:** Handle pagination logic.

**Usage:**
```jsx
import usePagination from '../hooks/usePagination';

const {
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToPage,
  paginatedData
} = usePagination(data, itemsPerPage);
```

---

## Styling & Theming

### Tailwind CSS

**Configuration:** `tailwind.config.js` (auto-generated)

**Usage:**
```jsx
<div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>
```

**Common Utilities:**
- Layout: `flex`, `grid`, `container`
- Spacing: `p-4`, `m-2`, `gap-3`
- Colors: `bg-blue-500`, `text-white`
- Typography: `text-xl`, `font-bold`
- Borders: `rounded-lg`, `border-2`
- Shadows: `shadow-md`, `shadow-lg`

---

### Global Styles (`index.css`)

**Features:**
- CSS reset
- Custom CSS variables
- Base typography
- Custom animations
- Responsive breakpoints

**Example:**
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --background: #f9fafb;
}
```

---

### Framer Motion Animations

**Usage:**
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h1>Animated Content</h1>
</motion.div>
```

**Common Animations:**
- Fade in/out
- Slide transitions
- Scale effects
- Stagger animations for lists

---

## Authentication Flow

### Complete Authentication Journey

```
1. User Registration (Super Admin only)
   ↓
2. Email/Password Login
   ↓
3. Check Verification Status
   ├─ Not Verified → Redirect to /verify
   │   ↓
   │   Generate & Send OTP
   │   ↓
   │   User Enters OTP
   │   ↓
   │   Verify OTP
   │   ↓
   │   Mark as Verified
   │   ↓
   └─ Verified → Redirect to Dashboard
       ↓
   4. Role-Based Dashboard
       ├─ SUPER_ADMIN → SuperAdminDashboard
       └─ FRANCHISE_ADMIN → FranchiseAdminDashboard
```

### Token Management

**Storage:**
```javascript
localStorage.setItem('token', jwtToken);
localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('tokenExpiry', expiryTimestamp);
```

**Validation:**
- Token sent in Authorization header for all API requests
- Auto-logout on 401 response
- Periodic expiry check (every 5 minutes)
- 24-hour token validity

---

## Features

### 1. Razorpay Payment Integration

**Flow:**
1. Create bill with `paymentMethod: "RAZORPAY"`, `paymentStatus: "PENDING"`
2. Click "Pay Now" button
3. Frontend calls `createRazorpayOrder()` API
4. Backend creates Razorpay order, returns `orderId`
5. Frontend opens Razorpay checkout modal
6. User completes payment
7. Razorpay returns payment details
8. Frontend calls `verifyPayment()` API
9. Backend verifies signature
10. Bill status updated to "COMPLETED"

**Component:**
```jsx
<RazorpayCheckout
  billId={bill._id}
  amount={bill.totalAmount}
  onSuccess={(paymentData) => {
    console.log('Payment successful:', paymentData);
    refreshBills();
  }}
  onFailure={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

---

### 2. PDF Generation & Printing

**Bill PDF:**
- Uses `react-to-pdf` library
- QR code with bill number
- Formatted layout
- Customer details
- Item-wise breakdown

**Menu PDF:**
- Category-wise listing
- Prices
- Descriptions
- Print-ready format

---

### 3. Image Upload (Firebase)

**Configuration:** `config/firebase.js`

**Component:** `config/Upload.jsx`

**Usage:**
```jsx
<Upload
  onUploadSuccess={(imageUrl) => {
    setFoodImage(imageUrl);
  }}
  onUploadError={(error) => {
    console.error('Upload failed:', error);
  }}
/>
```

**Storage:**
- Images uploaded to Firebase Storage
- URL saved in database
- Optimized image loading

---

### 4. Charts & Analytics (Recharts)

**Available Charts:**
- Line Chart - Revenue trends
- Bar Chart - Category sales
- Pie Chart - Payment distribution
- Area Chart - Order volume

**Example:**
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart data={revenueData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
</LineChart>
```

---

### 5. Error Handling

**Error Boundary:**
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Try-Catch Pattern:**
```javascript
try {
  setLoading(true);
  const response = await billService.createBill(billData);
  showToast('Bill created successfully!', 'success');
} catch (error) {
  const errorMessage = error.response?.data?.message || 'Failed to create bill';
  showToast(errorMessage, 'error');
} finally {
  setLoading(false);
}
```

---

### 6. Lazy Loading & Code Splitting

**Lazy-loaded Pages:**
```jsx
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/DashboardPage'));

<Suspense fallback={<Loading fullScreen />}>
  <Routes>
    <Route path="/" element={<LandingPage />} />
  </Routes>
</Suspense>
```

**Benefits:**
- Faster initial load
- Smaller bundle size
- Better performance

---

## Configuration

### Environment-Specific Setup

**Development:**
```javascript
// config/api.js
baseURL: 'http://localhost:5000/api/v1'
```

**Production:**
```javascript
// config/api.js
baseURL: 'https://your-backend-api.com/api/v1'
```

**Environment Variables (if needed):**

Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
VITE_FIREBASE_API_KEY=your_firebase_key
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Building for Production

### Build Commands

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
```

**Output:** `dist/` folder with optimized static files

**Preview Production Build:**
```bash
npm run preview
```

---

### Deployment

**Static Hosting (Vercel, Netlify):**
```bash
# Build command
npm run build

# Output directory
dist

# Install command
npm install
```

**Server Configuration:**

For React Router to work with client-side routing, configure redirects:

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify (`netlify.toml`):**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Troubleshooting

### Common Issues

#### 1. API Connection Error
```
Error: Network Error
```

**Solutions:**
- Ensure backend server is running on port 5000
- Check `baseURL` in `config/api.js`
- Verify CORS settings on backend
- Check firewall/antivirus settings

---

#### 2. Authentication Issues
```
Error: 401 Unauthorized
```

**Solutions:**
- Check if token exists in localStorage
- Verify token hasn't expired
- Re-login to get fresh token
- Check backend JWT_SECRET configuration

---

#### 3. Razorpay Integration Fails
```
Error: Razorpay is not defined
```

**Solutions:**
- Ensure Razorpay script is loaded in `index.html`
- Check Razorpay key_id configuration
- Verify payment amount is in paise (multiply by 100)
- Check backend Razorpay credentials

---

#### 4. Images Not Loading
```
Error: Failed to load image
```

**Solutions:**
- Check Firebase configuration
- Verify Firebase Storage rules
- Check image URL format
- Ensure CORS is enabled on Firebase

---

#### 5. Build Errors
```
Error: Module not found
```

**Solutions:**
- Run `npm install` to install dependencies
- Clear node_modules: `rm -rf node_modules && npm install`
- Check import paths (case-sensitive)
- Verify all dependencies are in package.json

---

## Performance Optimization

### Best Practices

1. **Code Splitting** ✅
   - Lazy loading pages
   - Dynamic imports

2. **Image Optimization**
   - Use OptimizedImage component
   - Lazy loading images
   - WebP format when possible

3. **Memoization**
   - Use `React.memo()` for expensive components
   - `useMemo()` for expensive calculations
   - `useCallback()` for callback functions

4. **Bundle Size**
   - Tree shaking (automatic with Vite)
   - Remove unused dependencies
   - Analyze bundle: `npm run build -- --analyze`

5. **API Calls**
   - Debounce search inputs
   - Cache responses
   - Pagination for large lists

---

## Testing Strategy

### Recommended Testing Approach

**Unit Testing:**
- Test utility functions
- Test custom hooks
- Test service modules

**Component Testing:**
- Test component rendering
- Test user interactions
- Test form validation

**Integration Testing:**
- Test authentication flow
- Test API integrations
- Test routing

**E2E Testing:**
- Test complete user journeys
- Test critical paths (login, create bill, payment)

**Tools:**
- Jest (unit tests)
- React Testing Library (component tests)
- Cypress or Playwright (E2E tests)

---

## Security Best Practices

### Implemented Security

1. ✅ **JWT Authentication** - Secure token-based auth
2. ✅ **Protected Routes** - Role-based access control
3. ✅ **Input Validation** - Form validation on frontend
4. ✅ **XSS Protection** - React auto-escapes content
5. ✅ **HTTPS** - Use in production
6. ✅ **Secure Storage** - Sensitive data not in localStorage

### Recommendations

- Never store sensitive data in localStorage
- Use environment variables for API keys
- Implement HTTPS in production
- Use Content Security Policy (CSP)
- Regular dependency updates (`npm audit`)
- Sanitize user inputs

---

## Browser Compatibility

**Supported Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile Browsers:**
- iOS Safari
- Chrome Mobile
- Samsung Internet

---

## Accessibility (a11y)

**Best Practices:**
- Semantic HTML elements
- ARIA labels for icons
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

---

## Future Enhancements

### Potential Features
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Offline mode with service workers
- [ ] Push notifications
- [ ] Advanced filtering & sorting
- [ ] Export data (Excel, CSV)
- [ ] Real-time updates (WebSocket)
- [ ] Customer-facing ordering page
- [ ] Mobile app (React Native)
- [ ] Enhanced analytics dashboards
- [ ] Email reports
- [ ] Inventory management

---

## Development Workflow

### Typical Development Cycle

1. **Create New Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop Feature**
   - Create/modify components
   - Add service methods
   - Update routing if needed

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

6. **Deploy**
   - Merge to main branch
   - Auto-deploy via CI/CD

---

## Useful Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/docs/intro)
- [Razorpay](https://razorpay.com/docs/)

---

## Contact & Support

### Getting Help
- Review code comments
- Check browser console for errors
- Use React DevTools for debugging
- Review network tab for API issues

### Code Conventions
- Use functional components with hooks
- Follow React best practices
- Consistent naming conventions
- PropTypes for type checking
- Comments for complex logic

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Framework:** React 19.2.0
**Build Tool:** Vite 7.2.2
