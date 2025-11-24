# Admin Authentication System

A complete authentication system for the Home Service SaaS platform with login, forgot password, and 2FA flows.

## Features

- ✅ **Login with email/password** - Secure authentication with validation
- ✅ **Forgot password flow** - Email-based password reset
- ✅ **Two-Factor Authentication (2FA)** - 6-digit OTP verification
- ✅ **Dark glassmorphism design** - Premium dark theme with hexagonal motifs
- ✅ **Split-pane layout** - Desktop: brand panel + auth card, Mobile: stacked layout
- ✅ **Responsive design** - Mobile-first with collapsible brand panel
- ✅ **Accessibility** - WCAG 2.1 AA compliant with ARIA labels and keyboard navigation
- ✅ **Loading states** - Animated loading indicators with Framer Motion
- ✅ **Error handling** - User-friendly error messages
- ✅ **Form validation** - Client-side validation with Zod schemas

## Tech Stack

- **React 19** + **TypeScript**
- **Next.js 15** (App Router)
- **Tailwind CSS 4.1** - Utility-first styling
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Framer Motion** - Animations
- **React Aria** - Accessibility

## Routes

- `/auth/login` - Main authentication page

## Project Structure

```
src/
├── app/
│   └── auth/
│       └── login/
│           └── page.tsx                    # Auth page route
├── components/
│   └── auth/
│       ├── auth-container.tsx              # Main auth orchestrator
│       ├── auth-layout.tsx                 # Split-pane layout
│       ├── brand-panel.tsx                 # Marketing/brand panel
│       ├── login-form.tsx                  # Login form component
│       ├── forgot-password-form.tsx        # Password reset form
│       ├── two-factor-form.tsx             # 2FA verification form
│       └── otp-input.tsx                   # 6-digit OTP input
├── hooks/
│   └── use-auth-mutations.ts               # TanStack Query mutations
├── lib/
│   ├── api/
│   │   └── auth.ts                         # Auth API client (mock)
│   └── validations/
│       └── auth.ts                         # Zod validation schemas
├── stores/
│   └── auth-store.ts                       # Zustand state management
└── providers/
    └── query-provider.tsx                  # TanStack Query provider
```

## Getting Started

### 1. Start the development server

```bash
cd /home/saas/home-service-saas/apps/web
pnpm dev
```

### 2. Navigate to the login page

Open your browser and go to: http://localhost:3000/auth/login

### 3. Test the authentication flows

#### Test Login (Without 2FA)
- **Email:** `user@example.com`
- **Password:** `password123`
- **Result:** Direct login, redirects to `/app/dashboard`

#### Test Login (With 2FA)
- **Email:** `admin@example.com`
- **Password:** `password123`
- **Result:** Prompts for 2FA code
- **2FA Code:** `123456`

#### Test Forgot Password
1. Click "Forgot password?" link
2. Enter any email address
3. See success message (email is not revealed for security)

## Key Components

### AuthContainer

The main orchestrator component that manages the authentication flow based on the current step (login, forgot-password, 2fa).

**Location:** `src/components/auth/auth-container.tsx`

### AuthLayout

Split-pane layout component with brand panel on the left (desktop) and auth card on the right.

**Location:** `src/components/auth/auth-layout.tsx`

**Features:**
- Responsive: Brand panel hidden on mobile
- Glass morphism: Backdrop blur with transparency
- Animated gradients: Subtle moving orbs

### LoginForm

Email and password login form with validation and loading states.

**Location:** `src/components/auth/login-form.tsx`

**Features:**
- Email validation
- Password strength requirements
- Show/hide password toggle
- "Forgot password?" link

### ForgotPasswordForm

Password reset request form with success state.

**Location:** `src/components/auth/forgot-password-form.tsx`

**Features:**
- Email validation
- Success message after submission
- Back to login button

### TwoFactorForm

6-digit OTP verification with auto-submit and resend timer.

**Location:** `src/components/auth/two-factor-form.tsx`

**Features:**
- Auto-submit when all 6 digits entered
- Resend code with 60-second countdown
- Keyboard navigation (arrow keys, backspace)
- Paste support

### OTPInput

Segmented 6-digit code input component.

**Location:** `src/components/auth/otp-input.tsx`

**Features:**
- Auto-focus next field on input
- Backspace to previous field
- Arrow key navigation
- Paste entire code
- Validation states (error, disabled)

## State Management

### Zustand Store

**Location:** `src/stores/auth-store.ts`

```typescript
interface AuthState {
    step: "login" | "forgot-password" | "2fa";
    isSubmitting: boolean;
    email: string;
    setStep: (step: AuthStep) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setEmail: (email: string) => void;
    reset: () => void;
}
```

### TanStack Query Mutations

**Location:** `src/hooks/use-auth-mutations.ts`

- `useLoginMutation()` - Login with email/password
- `useForgotPasswordMutation()` - Request password reset
- `useVerify2FAMutation()` - Verify 2FA code
- `useResend2FAMutation()` - Resend 2FA code

## Validation Schemas

**Location:** `src/lib/validations/auth.ts`

### Login Schema
```typescript
{
    email: string (email format),
    password: string (min 8 characters)
}
```

### Forgot Password Schema
```typescript
{
    email: string (email format)
}
```

### Two-Factor Schema
```typescript
{
    code: string (exactly 6 digits)
}
```

## API Integration

**Location:** `src/lib/api/auth.ts`

Currently uses mock API responses. In production, replace with actual API calls.

### Endpoints to implement:

1. **POST /api/auth/login**
   - Request: `{ email, password }`
   - Response: `{ success, requires2FA?, token?, user? }`

2. **POST /api/auth/forgot-password**
   - Request: `{ email }`
   - Response: `{ success, message }`

3. **POST /api/auth/verify-2fa**
   - Request: `{ code }`
   - Response: `{ success, token, user }`

4. **POST /api/auth/resend-2fa**
   - Request: `{}`
   - Response: `{ success }`

## Accessibility Features

- ✅ Semantic HTML with proper landmarks (`<main>`, `<form>`)
- ✅ ARIA labels on all inputs
- ✅ ARIA live regions for error announcements
- ✅ Keyboard navigation support
- ✅ Focus management (auto-focus first field)
- ✅ Screen reader friendly
- ✅ High contrast focus rings
- ✅ Proper label associations

## Responsive Design

### Desktop (lg: 1024px+)
- Split-pane layout (50/50)
- Brand panel visible with animations
- Auth card centered in right pane

### Mobile (< 1024px)
- Stacked layout
- Brand panel hidden
- Mobile logo at top
- Full-width auth card

## Design Tokens

### Colors
- Background: `slate-950/80` (dark with transparency)
- Cards: `slate-900/60` with backdrop blur
- Primary: `sky-400` to `blue-600` gradient
- Borders: `sky-500/10` (subtle)

### Typography
- Headings: `font-bold` with `tracking-tight`
- Body: `text-slate-200` to `text-slate-400`
- Links: `text-sky-400` with hover states

### Spacing
- Card padding: `p-8`
- Form spacing: `space-y-5`
- Section gaps: `gap-6` to `gap-8`

## Animations

All animations use Framer Motion:

- **Form transitions:** Fade + slide on step changes
- **Loading states:** Spinning indicators on buttons
- **Error alerts:** Height + opacity animations
- **Brand panel:** Subtle gradient orbs pulsing
- **Feature list:** Staggered fade-in

## Security Considerations

### Current Implementation (Mock)
- Passwords sent in plain text (development only)
- Tokens stored in localStorage (not secure for production)
- No rate limiting
- No CSRF protection

### Production Requirements
- ✅ Use HTTPS only
- ✅ Hash passwords with bcrypt/argon2
- ✅ Use HTTP-only secure cookies for tokens
- ✅ Implement rate limiting (max 5 attempts per IP per minute)
- ✅ Add CSRF tokens
- ✅ Implement account lockout after failed attempts
- ✅ Use secure session management
- ✅ Add security headers (CSP, HSTS, etc.)

## Next Steps

### To complete the authentication system:

1. **Backend Integration**
   - Replace mock API with real endpoints
   - Implement secure token storage
   - Add rate limiting and CSRF protection

2. **Additional Features**
   - Email verification on signup
   - Magic link login
   - Social authentication (Google, Microsoft)
   - Remember me functionality
   - Session management

3. **Security Enhancements**
   - Implement proper token refresh flow
   - Add device fingerprinting
   - Audit logging for auth events
   - Suspicious activity detection

4. **User Experience**
   - Remember last logged-in email
   - Password strength meter
   - Biometric authentication support
   - Multi-language support

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials (without 2FA)
- [ ] Login with valid credentials (with 2FA)
- [ ] Login with invalid credentials
- [ ] Forgot password flow
- [ ] 2FA verification with valid code
- [ ] 2FA verification with invalid code
- [ ] Resend 2FA code
- [ ] Form validation (empty fields)
- [ ] Form validation (invalid email)
- [ ] Form validation (short password)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Keyboard navigation (tab through forms)
- [ ] Error messages display correctly
- [ ] Loading states work correctly
- [ ] Auto-redirect after successful login

### Automated Testing

Add tests for:
- Component rendering
- Form validation
- State management
- API integration
- Accessibility (axe-core)

## Troubleshooting

### Server won't start
```bash
# Clear cache and reinstall dependencies
rm -rf .next node_modules
pnpm install
pnpm dev
```

### TypeScript errors
```bash
# Check for type errors
pnpm tsc --noEmit
```

### Styles not applying
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in layout
- Verify class names are correct

## Support

For issues or questions:
1. Check the project documentation in `/home/saas/home-service-saas/`
2. Review the component code for implementation details
3. Test with the provided mock credentials

---

**Built with ❤️ for Home Service SaaS Platform**
