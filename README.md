# PawFetch

A React-based dog matching web application built as a Frontend exercise for the Fetch Take Home Test.

## Overview

**PawFetch** is a responsive, accessible, and performant single-page application that enables users to browse, filter, and favorite adoptable dogs, then receive a tailored match recommendation.  
This project demonstrates clean code architecture, modular component design, and industry-standard tooling for a scalable frontend codebase.

## Features

- **Authentication**: Secure login/logout using Fetch’s API.
- **Dog Listings**: Paginated, filterable, and sortable by breed, age, and name.
- **Intuitive Filtering**: Filter by breed, age range, state, or distance from zip code.
- **Favorites ("Barkmarks")**: Add/remove dogs, persistent in client state.
- **Matching**: "Match" feature recommends a dog from favorites.
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop.
- **Consistent UI**: Built with Chakra UI for a modern look.
- **Clear Feedback**: Loading spinners, empty states, and error toasts.

## Implementation Details

- **TypeScript** for type safety and maintainability.
- **Functional Components & Hooks** for modular, reusable logic.
- **Strict linting and formatting** via ESLint and Prettier.
- **Separation of concerns**: API, assets, UI components, context, hooks, and pages are clearly organized.
- **Performance**: Code-splitting, memoization, and lazy loading to reduce load times.

## Tech Stack

- **Framework**: React (v18+) with Functional Components and Hooks
- **Language**: TypeScript
- **UI Library**: Chakra UI
- **HTTP Client**: Fetch API
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Code Quality**: ESLint, Prettier

## Project Structure

```
├── public/                   # Static assets and HTML template
├── src/
│   ├── api/                  # API modules (auth, dog, location)
│   ├── assets/               # Static assets (e.g., images)
│   ├── components/           # Reusable UI components (DogCard, FilterPopover, Pagination, etc.)
│   ├── constants/            # Shared constants and static data (US states)
│   ├── context/              # React Context providers (AuthContext, FavoritesContext)
│   ├── hooks/                # Custom React hooks (useDogLocation, useDogSearch, useUrlSync)
│   ├── pages/                # Route-level components (Login, Search)
│   ├── App.css               # Main app styles
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   ├── index.tsx             # Application entry point
│   └── theme.tsx             # Chakra UI theme configuration
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## License

This repository is provided solely for technical evaluation and is not licensed for public distribution.