# ADYPU Practical Submission Report - Website Building

**Student Name:** [Your Name]
**Roll Number:** [Your Roll Number]
**Section:** [Your Section]
**Question Chosen:** Website Building (GoldenTicketHub)

---

## 1. Abstract/Introduction

**Project Name:** GoldenTicketHub

**Overview:**
GoldenTicketHub is a modern, fully responsive movie ticket booking web application designed to provide a seamless user experience for moviegoers. The application allows users to browse currently showing movies, view detailed information (including cast, synopsis, and trailers), select specific seats in a theater layout, and simulate a secure payment process. The project focuses on a clean, aesthetic user interface with smooth transitions and intuitive navigation, mimicking real-world platforms like BookMyShow.

---

## 2. Tools and Technologies Used

**For Website Building:**
*   **Core Framework:** React.js (v19) with Vite (v7) for fast development and optimized building.
*   **Styling:** Vanilla CSS with modern design principles (Flexbox, Grid, CSS Variables) for a custom, premium look.
*   **Routing:** React Router DOM (v7) for client-side navigation.
*   **Icons:** Lucide React for modern, consistent iconography.
*   **Data Management:** Local JSON files to simulate backend data (movies, theaters, bookings).

**For Creating/Refining Prompts:**
*   **AI Tool:** Google Gemini (via Antigravity Agent)
*   **Usage:** Used to generate the initial project structure, component logic, CSS styling strategies, and debugging complex issues like the seat selection algorithm.

---

## 3. Prompts Used

**Primary Prompt for Website Generation:**
> "Build a fully responsive and modern movie ticket booking website called 'GoldenTicketHub' (or 'Golden Seat'), inspired by BookMyShow, with a clean white theme and soft pastel red-orange gradients. The core goals include creating a beautiful UI with smooth transitions, implementing a complete booking flow from home page to ticket confirmation (including seat selection and a dummy payment gateway), and integrating real movie data (posters, trailers, cast). Ensure the design is premium with hover effects and micro-animations."

**Refinement Prompts (Examples):**
*   "Refactor the Navbar component to improve its layout. Shift the logo and navigation to the left, and move the search bar and user profile to the right. Replace the user name with a circular profile avatar."
*   "Implement a dynamic hover effect on movie posters where the hovered poster scales up and adjacent posters shift sideways."
*   "Create a 'Movies' page with a grid layout, language/genre filters, and a search bar."

---

## 4. Architecture and Design Documentation

### Overall System Architecture
The application follows a **Single Page Application (SPA)** architecture.

```mermaid
graph TD
    User[User] -->|Access| Browser[Web Browser]
    Browser -->|Loads| ReactApp[React Application (Vite)]
    ReactApp -->|Routing| Router[React Router]
    Router -->|Renders| Pages[Pages (Home, Movies, Booking, etc.)]
    Pages -->|Uses| Components[Reusable Components (Navbar, MovieCard, etc.)]
    Pages -->|Reads| Data[JSON Data (Movies, Theaters)]
    Pages -->|Manages| State[React State / Context]
```

### Page Structure and Navigation Flow
1.  **Home (`/`)**: Hero Carousel, Now Showing, Recommended Movies.
2.  **Movies (`/movies`)**: Searchable and filterable grid of all movies.
3.  **Movie Details (`/movie/:id`)**: Detailed view with synopsis, cast, and "Book Ticket" CTA.
4.  **Booking (`/book/...`)**: Theater selection (implied) -> Seat Selection Grid.
5.  **Payment (`/payment`)**: Order summary and mock payment form.
6.  **Confirmation (`/confirmation`)**: Booking success message and ticket details.
7.  **User Dashboard**:
    *   **My Bookings (`/bookings`)**: History of booked tickets.
    *   **Profile (`/profile`)**: User settings.
8.  **Support (`/support`)**: FAQ and contact form.

### Component Hierarchy
*   `App.jsx` (Root)
    *   `Navbar` (Global Navigation)
    *   `Routes`
        *   `Home`
            *   `HeroCarousel`
            *   `MovieSection` -> `MovieCard`
        *   `Movies` -> `FilterBar`, `MovieGrid`
        *   `MovieDetails` -> `CastList`, `TrailerModal`
        *   `Booking` -> `SeatGrid`, `Legend`
        *   `Payment` -> `OrderSummary`, `PaymentForm`
    *   `Footer` (Global Footer)

---

## 5. Functionality Description

*   **Dynamic Movie Browsing:** Users can browse movies via a carousel or a grid view. The application supports filtering by language and genre, making discovery easy.
*   **Interactive Seat Selection:** A visual representation of the theater layout allows users to click and select specific seats. The system tracks selected seats, calculates the total price dynamically based on seat tiers (Standard, Premium, VIP), and prevents selecting occupied seats.
*   **Booking Flow:** A step-by-step flow guides users from movie selection -> showtime selection -> seat selection -> payment -> confirmation.
*   **User Accounts:** Simulated login/signup and a "My Bookings" section where users can view their past tickets.
*   **Responsive Design:** The layout adapts seamlessly to desktop, tablet, and mobile screens using CSS media queries.

---

## 6. Output and Demonstration

### Screenshots

**1. Home Page**
*(Insert `home_page.png` here)*
*The main landing page featuring a hero carousel and categorized movie lists.*

**2. Movies Page**
*(Insert `movies_page.png` here)*
*A comprehensive grid view of all available movies with search and filter options.*

**3. Movie Details**
*(Insert `movie_details.png` here)*
*Detailed information about a selected movie, including cast and synopsis.*

**4. Seat Selection**
*(Insert `seat_selection.png` here)*
*Interactive theater map allowing users to choose their preferred seats.*

**5. Seat Selection (Filled)**
*(Insert `seat_selection_filled.png` here)*
*Visual feedback showing selected seats (green) and the calculated total price.*

**6. Payment Page**
*(Insert `payment_page.png` here)*
*The checkout screen displaying the order summary and payment options (login modal shown).*

**7. My Bookings**
*(Insert `my_bookings.png` here)*
*User dashboard showing a history of booked tickets.*

**8. Support Page**
*(Insert `support_page.png` here)*
*Help center with FAQs and contact information.*

### Deployed Link
*   **Local Development Link:** `http://localhost:5173`
*   *(If you have deployed this to Vercel/Netlify, replace this with the live URL)*

---
