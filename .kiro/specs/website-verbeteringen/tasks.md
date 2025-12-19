# Implementation Plan

## Phase 1: Project Setup & Infrastructure

- [x] 1. Setup testing infrastructure
  - [x] 1.1 Install testing dependencies (vitest, @testing-library/react, fast-check, jsdom)
    - Add vitest, @testing-library/react, @testing-library/jest-dom, fast-check to devDependencies
    - Configure vitest.config.ts with jsdom environment
    - _Requirements: Testing Strategy_
  - [ ]* 1.2 Create test utilities and setup files
    - Create test/setup.ts with testing-library configuration
    - Create test utilities for common test patterns
    - _Requirements: Testing Strategy_

- [x] 2. Setup i18n infrastructure
  - [x] 2.1 Create i18n context and hook
    - Create contexts/I18nContext.tsx with locale state
    - Create hooks/useI18n.ts for translation access
    - Implement language detection from browser
    - _Requirements: 8.1, 8.4_
  - [ ]* 2.2 Write property test for language preference round-trip
    - **Property 8: Language Preference Round-Trip**
    - **Validates: Requirements 8.3**
  - [x] 2.3 Create translation files structure
    - Create i18n/nl.json with Dutch translations
    - Create i18n/fr.json with French translations
    - _Requirements: 8.2_
  - [ ]* 2.4 Write property test for translation completeness
    - **Property 7: Translation Completeness**
    - **Validates: Requirements 8.2**

## Phase 2: Core Components

- [x] 3. Implement Cookie Consent
  - [x] 3.1 Create CookieConsent component
    - Create components/CookieConsent.tsx with preference options
    - Implement localStorage persistence
    - Add necessary, analytics, marketing cookie options
    - _Requirements: 5.1, 5.2_
  - [ ]* 3.2 Write property test for cookie preference round-trip
    - **Property 3: Cookie Preference Round-Trip**
    - **Validates: Requirements 5.3**
  - [x] 3.3 Integrate cookie consent with analytics loading
    - Conditionally load analytics scripts based on consent
    - _Requirements: 5.4_

- [x] 4. Implement Language Switcher
  - [x] 4.1 Create LanguageSwitcher component
    - Create components/LanguageSwitcher.tsx
    - Add to Navbar component
    - Persist language choice to localStorage
    - _Requirements: 8.1, 8.3_
  - [x] 4.2 Translate existing content
    - Extract all hardcoded Dutch text to translation keys
    - Add French translations for all content
    - _Requirements: 8.2_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Portfolio Feature

- [-] 6. Implement Portfolio components
  - [x] 6.1 Create Project data model and sample data
    - Add Project interface to types.ts
    - Create sample projects in constants.tsx
    - _Requirements: 2.1_
  - [-] 6.2 Create PortfolioGrid component
    - Create components/portfolio/PortfolioGrid.tsx
    - Implement grid layout with project cards
    - Add filter functionality by project type
    - _Requirements: 2.1, 2.3_
  - [ ]* 6.3 Write property test for portfolio filter correctness
    - **Property 1: Portfolio Filter Correctness**
    - **Validates: Requirements 2.3**
  - [ ] 6.4 Create ProjectDetail component
    - Create components/portfolio/ProjectDetail.tsx
    - Display project details in modal
    - _Requirements: 2.2_
  - [ ] 6.5 Create Lightbox component
    - Create components/portfolio/Lightbox.tsx
    - Implement image navigation
    - _Requirements: 2.4_
  - [ ] 6.6 Create Portfolio page
    - Create pages/Portfolio.tsx
    - Add route to App.tsx
    - Add to navigation
    - _Requirements: 2.1_

## Phase 4: Testimonials Feature

- [ ] 7. Implement Testimonials
  - [ ] 7.1 Create Testimonial data model and sample data
    - Add Testimonial interface to types.ts
    - Create sample testimonials in constants.tsx
    - _Requirements: 3.1_
  - [ ] 7.2 Create TestimonialsCarousel component
    - Create components/TestimonialsCarousel.tsx
    - Implement carousel with navigation
    - Display customer name, project type, review text
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 7.3 Write property test for testimonial display completeness
    - **Property 2: Testimonial Display Completeness**
    - **Validates: Requirements 3.2**
  - [ ] 7.4 Add Testimonials to homepage
    - Import and add TestimonialsCarousel to Home page
    - _Requirements: 3.1_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Quote Calculator

- [ ] 9. Implement Quote Calculator
  - [ ] 9.1 Create calculator utility functions
    - Create utils/calculator.ts with price calculation logic
    - Implement price range calculation based on project type and area
    - _Requirements: 10.2_
  - [ ]* 9.2 Write property test for calculator price range validity
    - **Property 9: Calculator Price Range Validity**
    - **Validates: Requirements 10.2**
  - [ ] 9.3 Create QuoteCalculator component
    - Create components/QuoteCalculator.tsx
    - Add project type selector and dimension inputs
    - Display indicative price range with disclaimer
    - Add "Request Quote" button to pre-fill contact form
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ] 9.4 Integrate calculator with contact form
    - Pass calculator data to contact form
    - Pre-fill project description with calculator details
    - _Requirements: 10.3_

## Phase 6: Google Maps Integration

- [ ] 10. Implement Google Maps
  - [ ] 10.1 Create GoogleMap component
    - Create components/GoogleMap.tsx
    - Implement Google Maps embed with marker
    - Add error handling with fallback UI
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 10.2 Update Contact page with map
    - Replace placeholder with GoogleMap component
    - _Requirements: 1.1_

## Phase 7: Admin Dashboard Improvements

- [ ] 11. Enhance Admin Dashboard
  - [ ] 11.1 Add notes functionality to leads
    - Extend Lead interface with notes array
    - Add notes input and display in lead detail modal
    - _Requirements: 7.1_
  - [ ] 11.2 Implement lead deletion with confirmation
    - Add delete button with confirmation dialog
    - Implement delete functionality
    - _Requirements: 7.2, 7.3_
  - [ ]* 11.3 Write property test for lead deletion correctness
    - **Property 5: Lead Deletion Correctness**
    - **Validates: Requirements 7.3**
  - [ ] 11.4 Implement lead sorting
    - Add sort controls for date, status, name
    - Implement sorting logic
    - _Requirements: 7.4_
  - [ ]* 11.5 Write property test for lead sorting correctness
    - **Property 6: Lead Sorting Correctness**
    - **Validates: Requirements 7.4**

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: Performance & WhatsApp

- [ ] 13. Performance optimizations
  - [ ] 13.1 Implement lazy loading for images
    - Add loading="lazy" to all images below the fold
    - Add poster attribute to hero video
    - _Requirements: 6.2, 6.3_
  - [ ]* 13.2 Write property test for image lazy loading
    - **Property 4: Image Lazy Loading**
    - **Validates: Requirements 6.2**

- [ ] 14. WhatsApp Integration
  - [ ] 14.1 Create floating WhatsApp button
    - Update components/WhatsAppButton.tsx to be floating
    - Add pre-filled message functionality
    - Position in bottom-right corner
    - _Requirements: 9.1, 9.2, 9.3_
  - [ ] 14.2 Add WhatsApp button to Layout
    - Ensure button appears on all pages
    - _Requirements: 9.1_

## Phase 9: Backend Integration (Optional)

- [ ]* 15. Backend form integration
  - [ ]* 15.1 Create API service
    - Create services/api.ts with form submission function
    - Implement error handling and retry logic
    - _Requirements: 4.1, 4.4_
  - [ ]* 15.2 Update contact form to use API
    - Replace mock submission with actual API call
    - Add error handling UI
    - _Requirements: 4.1, 4.4_

## Phase 10: Final Integration

- [ ] 16. Final integration and cleanup
  - [ ] 16.1 Update navigation with new pages
    - Add Portfolio to navigation
    - Ensure all new pages are accessible
    - _Requirements: 2.1_
  - [ ] 16.2 Add translations for all new components
    - Translate Portfolio, Calculator, Testimonials content
    - _Requirements: 8.2_

- [ ] 17. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
