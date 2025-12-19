# Design Document: Website Verbeteringen

## Overview

Dit document beschrijft het technische ontwerp voor de verbeteringen aan de Yannova website. De website is gebouwd met React 19, TypeScript, Vite en React Router. De verbeteringen omvatten nieuwe features (portfolio, testimonials, calculator), integraties (Google Maps, backend, i18n), en optimalisaties (performance, cookie consent, admin dashboard).

## Architecture

### Huidige Architectuur
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  App.tsx (Router, State Management)                      │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Pages      │  Components  │   Services   │   Utils    │
│  - Home      │  - Hero      │  (nieuw)     │  - types   │
│  - Contact   │  - Services  │              │  - const   │
│  - Diensten  │  - Admin     │              │            │
│  - Gevel/*   │  - Layout    │              │            │
└──────────────┴──────────────┴──────────────┴────────────┘
```

### Voorgestelde Architectuur
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  App.tsx (Router, Context Providers)                     │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Pages      │  Components  │   Services   │   Hooks    │
│  - Home      │  - Hero      │  - api.ts    │  - useI18n │
│  - Contact   │  - Services  │  - email.ts  │  - useCook │
│  - Portfolio │  - Admin     │              │  - useCalc │
│  - Diensten  │  - Layout    │              │            │
│  - Gevel/*   │  - Portfolio │              │            │
│              │  - Testim.   │              │            │
│              │  - Calcul.   │              │            │
│              │  - CookieBan │              │            │
│              │  - LangSwit  │              │            │
└──────────────┴──────────────┴──────────────┴────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  i18n Context   │         │  Backend API    │
│  (NL/FR)        │         │  (Serverless)   │
└─────────────────┘         └─────────────────┘
```

## Components and Interfaces

### Nieuwe Components

#### 1. GoogleMap Component
```typescript
interface GoogleMapProps {
  address: string;
  coordinates: { lat: number; lng: number };
  zoom?: number;
  onError?: () => void;
}
```

#### 2. Portfolio Components
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  type: 'gevelwerken' | 'renovatie' | 'isolatie' | 'ramen-deuren';
  images: string[];
  completedDate: string;
  location: string;
}

interface PortfolioGridProps {
  projects: Project[];
  filter?: Project['type'] | 'all';
  onProjectClick: (project: Project) => void;
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}
```

#### 3. Testimonials Component
```typescript
interface Testimonial {
  id: string;
  customerName: string;
  projectType: string;
  reviewText: string;
  rating?: number;
  date: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}
```

#### 4. Cookie Consent Component
```typescript
interface CookiePreferences {
  necessary: boolean; // always true
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}
```

#### 5. Language Switcher Component
```typescript
type Locale = 'nl' | 'fr';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}
```

#### 6. Quote Calculator Component
```typescript
interface CalculatorInput {
  projectType: 'gevelwerken' | 'renovatie' | 'isolatie' | 'ramen-deuren';
  surfaceArea: number; // m²
  additionalOptions?: string[];
}

interface PriceRange {
  min: number;
  max: number;
  currency: 'EUR';
}

interface QuoteCalculatorProps {
  onCalculate: (input: CalculatorInput) => PriceRange;
  onRequestQuote: (input: CalculatorInput, priceRange: PriceRange) => void;
}
```

### Extended Lead Interface
```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  date: string;
  status: 'Nieuw' | 'Contact Gehad' | 'Offerte Verzonden' | 'Afgerond';
  // New fields
  notes?: string[];
  calculatorData?: CalculatorInput;
  estimatedPrice?: PriceRange;
  createdAt: Date;
  updatedAt: Date;
}
```

## Data Models

### Translation Structure
```typescript
interface Translations {
  [key: string]: {
    nl: string;
    fr: string;
  };
}

// Example structure
const translations: Translations = {
  'nav.home': { nl: 'Home', fr: 'Accueil' },
  'nav.services': { nl: 'Diensten', fr: 'Services' },
  'hero.title': { nl: 'Kwaliteit...', fr: 'Qualité...' },
  // ...
};
```

### Cookie Storage
```typescript
// Stored in localStorage as JSON
interface StoredCookieConsent {
  preferences: CookiePreferences;
  timestamp: number;
  version: string;
}
```

### Price Calculation Model
```typescript
interface PriceConfig {
  projectType: string;
  basePrice: number; // per m²
  minPrice: number;
  maxMultiplier: number;
}

const PRICE_CONFIG: PriceConfig[] = [
  { projectType: 'gevelwerken', basePrice: 45, minPrice: 500, maxMultiplier: 1.4 },
  { projectType: 'renovatie', basePrice: 150, minPrice: 2000, maxMultiplier: 1.5 },
  { projectType: 'isolatie', basePrice: 35, minPrice: 400, maxMultiplier: 1.3 },
  { projectType: 'ramen-deuren', basePrice: 250, minPrice: 800, maxMultiplier: 1.4 },
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified. After reflection, redundant properties have been consolidated.

### Property 1: Portfolio Filter Correctness
*For any* list of projects and *any* filter type, all projects in the filtered result should match the selected filter type, and no matching projects should be excluded.
**Validates: Requirements 2.3**

### Property 2: Testimonial Display Completeness
*For any* testimonial data object, the rendered output should contain the customer name, project type, and review text.
**Validates: Requirements 3.2**

### Property 3: Cookie Preference Round-Trip
*For any* cookie preference selection, saving the preferences and then loading them should return the exact same preferences.
**Validates: Requirements 5.3**

### Property 4: Image Lazy Loading
*For any* image element below the fold, the element should have the `loading="lazy"` attribute set.
**Validates: Requirements 6.2**

### Property 5: Lead Deletion Correctness
*For any* list of leads and *any* lead ID to delete, after deletion the resulting list should not contain a lead with that ID, and the list length should decrease by exactly one.
**Validates: Requirements 7.3**

### Property 6: Lead Sorting Correctness
*For any* list of leads and *any* sort criteria (date, status, name), the resulting list should be correctly ordered according to that criteria.
**Validates: Requirements 7.4**

### Property 7: Translation Completeness
*For any* translation key used in the application, both Dutch (nl) and French (fr) translations should exist and be non-empty strings.
**Validates: Requirements 8.2**

### Property 8: Language Preference Round-Trip
*For any* language selection, saving the preference and then loading it should return the same language.
**Validates: Requirements 8.3**

### Property 9: Calculator Price Range Validity
*For any* valid calculator input (positive surface area, valid project type), the calculated price range should have min <= max, both values should be positive, and should be within reasonable bounds based on the input.
**Validates: Requirements 10.2**

## Error Handling

### API Errors
- Contact form submission failures: Display user-friendly error message with retry option
- Google Maps load failure: Show fallback with address text and external link
- Image load failures: Show placeholder image with alt text

### Validation Errors
- Form validation: Inline error messages per field
- Calculator validation: Prevent calculation with invalid inputs, show validation messages

### State Management Errors
- localStorage unavailable: Fallback to session-only state
- Invalid stored data: Reset to defaults with user notification

## Testing Strategy

### Unit Testing Framework
- **Framework**: Vitest (already compatible with Vite setup)
- **Testing Library**: @testing-library/react for component testing

### Property-Based Testing Framework
- **Framework**: fast-check
- **Configuration**: Minimum 100 iterations per property test

### Test Categories

#### Unit Tests
- Component rendering tests
- Hook behavior tests
- Utility function tests
- Form validation tests

#### Property-Based Tests
Each correctness property will be implemented as a property-based test using fast-check:

1. **Portfolio Filter Test**: Generate random project lists and filters, verify filter correctness
2. **Testimonial Display Test**: Generate random testimonial data, verify all fields present in output
3. **Cookie Preference Test**: Generate random preferences, verify round-trip consistency
4. **Image Lazy Loading Test**: Generate image lists, verify lazy loading attributes
5. **Lead Deletion Test**: Generate random lead lists and deletion targets, verify correct removal
6. **Lead Sorting Test**: Generate random lead lists and sort criteria, verify ordering
7. **Translation Completeness Test**: Iterate all translation keys, verify both locales exist
8. **Language Preference Test**: Generate random language selections, verify round-trip
9. **Calculator Price Test**: Generate random valid inputs, verify price range validity

#### Integration Tests
- Contact form submission flow
- Admin dashboard lead management flow
- Language switching across pages

### Test File Structure
```
src/
├── __tests__/
│   ├── components/
│   │   ├── PortfolioGrid.test.tsx
│   │   ├── Testimonials.test.tsx
│   │   ├── CookieConsent.test.tsx
│   │   ├── QuoteCalculator.test.tsx
│   │   └── LanguageSwitcher.test.tsx
│   ├── hooks/
│   │   ├── useI18n.test.ts
│   │   └── useCookieConsent.test.ts
│   ├── utils/
│   │   ├── calculator.test.ts
│   │   └── sorting.test.ts
│   └── properties/
│       ├── portfolio.property.test.ts
│       ├── cookies.property.test.ts
│       ├── leads.property.test.ts
│       ├── i18n.property.test.ts
│       └── calculator.property.test.ts
```

### Test Annotations
All property-based tests must include:
```typescript
// **Feature: website-verbeteringen, Property {number}: {property_text}**
// **Validates: Requirements X.Y**
```
