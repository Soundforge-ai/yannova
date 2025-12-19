# Requirements Document

## Introduction

Dit document beschrijft de verbeteringen en ontbrekende functionaliteiten voor de Yannova website - een Belgisch bouw- en renovatiebedrijf. De website heeft al een solide basis met homepage, diensten, gevelwerken pagina's, contact formulier en admin dashboard. Dit plan focust op de ontbrekende features en verbeteringen die nodig zijn voor een productie-klare website.

## Glossary

- **Yannova Website**: De React-gebaseerde website voor het Belgische bouw- en renovatiebedrijf
- **Lead**: Een potentiële klant die contact opneemt via het contactformulier
- **Admin Dashboard**: Het beheergedeelte waar leads worden beheerd
- **Google Maps**: Kaartintegratie voor het tonen van de bedrijfslocatie
- **Portfolio**: Galerij met afgeronde projecten en referenties
- **Testimonials**: Klantbeoordelingen en reviews
- **SEO**: Search Engine Optimization voor betere vindbaarheid

## Requirements

### Requirement 1: Google Maps Integratie

**User Story:** Als een bezoeker wil ik de locatie van Yannova op een kaart zien, zodat ik weet waar het bedrijf gevestigd is en hoe ik er kan komen.

#### Acceptance Criteria

1. WHEN a visitor views the contact page THEN the Website SHALL display an interactive Google Maps embed showing the company location
2. WHEN the map loads THEN the Website SHALL display a marker at the exact business address
3. IF the Google Maps API fails to load THEN the Website SHALL display a fallback with the address text and a link to Google Maps

### Requirement 2: Portfolio/Projecten Galerij

**User Story:** Als een bezoeker wil ik afgeronde projecten kunnen bekijken, zodat ik de kwaliteit van het werk van Yannova kan beoordelen.

#### Acceptance Criteria

1. WHEN a visitor navigates to the portfolio page THEN the Website SHALL display a grid of completed projects with images
2. WHEN a visitor clicks on a project THEN the Website SHALL display a detail view with multiple images, beschrijving en projectdetails
3. WHEN viewing the portfolio THEN the Website SHALL allow filtering by project type (gevelwerken, renovatie, isolatie)
4. WHEN a project image is clicked THEN the Website SHALL display a lightbox with full-size image navigation

### Requirement 3: Klantbeoordelingen/Testimonials Sectie

**User Story:** Als een bezoeker wil ik reviews van eerdere klanten lezen, zodat ik vertrouwen krijg in de diensten van Yannova.

#### Acceptance Criteria

1. WHEN a visitor views the homepage THEN the Website SHALL display a testimonials section with customer reviews
2. WHEN displaying testimonials THEN the Website SHALL show customer name, project type, and review text
3. WHEN multiple testimonials exist THEN the Website SHALL provide navigation (carousel or pagination) between reviews

### Requirement 4: Formulier Backend Integratie

**User Story:** Als een bedrijfseigenaar wil ik dat contactformulier submissions daadwerkelijk worden opgeslagen en per email worden verzonden, zodat ik geen leads mis.

#### Acceptance Criteria

1. WHEN a visitor submits the contact form THEN the Website SHALL send the form data to a backend service
2. WHEN form submission succeeds THEN the Website SHALL send a confirmation email to the visitor
3. WHEN form submission succeeds THEN the Website SHALL send a notification email to the business owner
4. IF form submission fails THEN the Website SHALL display an error message and allow retry
5. WHEN a form is submitted THEN the Website SHALL persist the lead data to a database

### Requirement 5: Cookie Consent Verbetering

**User Story:** Als een bezoeker wil ik controle hebben over welke cookies worden gebruikt, zodat mijn privacy wordt gerespecteerd conform GDPR.

#### Acceptance Criteria

1. WHEN a visitor first visits the website THEN the Website SHALL display a cookie consent banner
2. WHEN the cookie banner is shown THEN the Website SHALL provide options for necessary, analytics, and marketing cookies
3. WHEN a visitor makes a cookie choice THEN the Website SHALL persist that choice for future visits
4. WHEN a visitor declines analytics cookies THEN the Website SHALL not load Google Analytics or similar tracking

### Requirement 6: Performance Optimalisatie

**User Story:** Als een bezoeker wil ik dat de website snel laadt, zodat ik niet hoef te wachten en een goede gebruikerservaring heb.

#### Acceptance Criteria

1. WHEN images are loaded THEN the Website SHALL use optimized WebP format with fallbacks
2. WHEN the page loads THEN the Website SHALL lazy-load images below the fold
3. WHEN the hero video loads THEN the Website SHALL provide a poster image for immediate display
4. WHEN building for production THEN the Website SHALL generate optimized bundles with code splitting

### Requirement 7: Admin Dashboard Verbeteringen

**User Story:** Als een admin wil ik leads kunnen verwijderen en notities kunnen toevoegen, zodat ik mijn leads effectief kan beheren.

#### Acceptance Criteria

1. WHEN an admin views a lead THEN the Dashboard SHALL allow adding notes to the lead
2. WHEN an admin wants to delete a lead THEN the Dashboard SHALL show a confirmation dialog before deletion
3. WHEN an admin deletes a lead THEN the Dashboard SHALL remove the lead from the list
4. WHEN viewing leads THEN the Dashboard SHALL allow sorting by date, status, or name

### Requirement 8: Meertaligheid (NL/FR)

**User Story:** Als een Franstalige bezoeker wil ik de website in het Frans kunnen bekijken, zodat ik de inhoud goed begrijp.

#### Acceptance Criteria

1. WHEN a visitor views the website THEN the Website SHALL display a language switcher (NL/FR)
2. WHEN a visitor selects French THEN the Website SHALL display all content in French
3. WHEN a visitor changes language THEN the Website SHALL persist the language preference
4. WHEN the website loads THEN the Website SHALL detect browser language preference as default

### Requirement 9: WhatsApp Integratie Verbetering

**User Story:** Als een bezoeker wil ik direct via WhatsApp contact kunnen opnemen, zodat ik snel een antwoord krijg.

#### Acceptance Criteria

1. WHEN a visitor views any page THEN the Website SHALL display a floating WhatsApp button
2. WHEN a visitor clicks the WhatsApp button THEN the Website SHALL open WhatsApp with a pre-filled message
3. WHEN displaying the WhatsApp button THEN the Website SHALL show it in a non-intrusive position

### Requirement 10: Offerte Calculator

**User Story:** Als een bezoeker wil ik een indicatieve prijsberekening kunnen maken, zodat ik een idee heb van de kosten voordat ik contact opneem.

#### Acceptance Criteria

1. WHEN a visitor uses the calculator THEN the Website SHALL allow selecting project type and entering dimensions
2. WHEN project details are entered THEN the Website SHALL display an indicative price range
3. WHEN a calculation is complete THEN the Website SHALL offer to pre-fill the contact form with the details
4. WHEN displaying prices THEN the Website SHALL clearly indicate that prices are indicatief and subject to inspection
