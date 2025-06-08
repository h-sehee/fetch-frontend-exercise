# PawFetch

A React-based dog matching web application built as a Frontend exercise for the Fetch Take Home Test.

---

## Overview

**PawFetch** is a responsive, accessible, and performant single-page application that enables users to browse, filter, and favorite adoptable dogs, then receive a tailored match recommendation.  
This project demonstrates clean code architecture, modular component design, and industry-standard tooling for a scalable frontend codebase.

---

## Features

- **Authentication**: Secure login/logout using Fetch’s API.
- **Dog Listings**: Paginated, filterable, and sortable by breed, age, and name.
- **Intuitive Filtering**: Filter by breed, age range, state, or distance from zip code.
- **Favorites ("Barkmarks")**: Add/remove dogs, persistent in client state.
- **Matching**: "Match" feature recommends a dog from favorites.
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop.
- **Consistent UI**: Built with Chakra UI for a modern look.
- **Clear Feedback**: Loading spinners, empty states, and error toasts.

---

## Implementation Details

- **TypeScript** for type safety and maintainability.
- **Functional Components & Hooks** for modular, reusable logic.
- **Strict linting and formatting** via ESLint and Prettier.
- **Separation of concerns**: API, assets, UI components, context, hooks, and pages are clearly organized.
- **Performance**: Code-splitting, memoization, and lazy loading for fast load times.

---

## Tech Stack

- **Framework**: React (v18+) with Functional Components and Hooks
- **Language**: TypeScript
- **UI Library**: Chakra UI
- **HTTP Client**: Axios with interceptors for error handling and token management
- **State Management**: React Context API with useReducer
- **Routing**: React Router DOM
- **Code Quality**: ESLint, Prettier, Stylelint, Husky (Git hooks)

---

## Project Structure

```
├── public/             # Static assets and HTML template
├── src/
│   ├── api/            # Axios instances and endpoint wrappers
│   ├── assets/         # 
│   ├── components/     # Reusable UI components (Cards, Buttons, Modals)
│   ├── context/        # 
│   ├── hooks/          # Custom React hooks (e.g., useMatch, useFavorites)
│   └── pages/          # Route-level components (Home, DogDetails, Favorites)
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── tailwind.config.js  # Tailwind customization
└── package.json        # Scripts and dependencies
```

## Development Best Practices

- **Modular Design**: Keep components small and focused. Follow the Single Responsibility Principle.
- **Type Safety**: Strict TypeScript settings (`strict: true`) to catch errors at compile time.
- **Reusability**: Abstract repeated logic into custom hooks and shared utilities.
- **Accessibility**: Use semantic HTML and ARIA attributes. Test with screen readers.
- **Performance**: Profile with Lighthouse; aim for FCP < 1s and TTI < 3s.

---

## License

This repository is provided solely for technical evaluation and is not licensed for public distribution.