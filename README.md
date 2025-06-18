# Fullstack Interview Test

A modern full-stack web application built with SvelteKit for managing nested menu structures with persistent storage. Features a clean, responsive interface with drag-and-drop functionality for intuitive menu management.

## 📋 Project Overview

This solution implements a complete menu management system with the following approach:

- **Frontend**: SvelteKit 5 with TypeScript for type safety and modern development experience
- **Backend**: SvelteKit API routes providing RESTful endpoints for CRUD operations
- **Database**: SQLite with Drizzle ORM for lightweight, persistent storage
- **UI/UX**: Custom CSS with modern design principles, responsive layout, and smooth animations
- **State Management**: Svelte stores for reactive state management across components

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- [Docker](https://www.docker.com/) (optional)

### Setup Instructions

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd fullstack-interview-test
   bun install
   ```

2. **Set up database**
   ```bash
   export DATABASE_URL="file:./data.db"
   bun run db:push
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```

4. **Seed database**
   ```bash
   curl -X POST http://localhost:5173/api/seed
   ```

5. **Open browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 🔧 Backend Structure

The backend is built using SvelteKit's API routes with the following architecture:

### Database Schema
```sql
menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  parent_id INTEGER REFERENCES menu_items(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
)
```

### API Endpoints
- `GET /api/menu` - Retrieve complete menu tree structure
- `POST /api/menu` - Create new menu item
- `PUT /api/menu` - Update existing menu item
- `DELETE /api/menu` - Delete menu item (cascades to children)
- `POST /api/seed` - Seed database with initial data

### Key Backend Features
- **Hierarchical Data**: Self-referencing foreign keys for parent-child relationships
- **Order Management**: Automatic ordering with `orderIndex` field
- **Cascading Deletes**: Recursive deletion of child items
- **Data Validation**: Input validation and error handling
- **Type Safety**: Full TypeScript support with proper type definitions

## 🎯 Core Features

- **Display Page**: Tree view of nested menu structure
- **Edit Page**: Full CRUD operations (rename, move, delete)
- **Persistent Storage**: SQLite database with Drizzle ORM
- **Responsive Design**: Works on all devices

## 🎨 Bonus Features

### Drag and Drop Functionality
- **Intuitive Interface**: Drag menu items to reorder and change parent relationships
- **Visual Feedback**: Hover states and drop zone indicators
- **Validation**: Prevents invalid moves (e.g., dropping parent into child)
- **Smooth Animations**: CSS transitions for enhanced user experience

### Enhanced UI/UX
- **Modern Design**: Clean, professional interface with consistent styling
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Comprehensive error states with retry options
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Confirmation Dialogs**: Prevents accidental data loss
- **Visual Hierarchy**: Clear distinction between menu levels with indentation

### Technical Enhancements
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **State Management**: Reactive Svelte stores for efficient state updates
- **Component Architecture**: Modular, reusable components


## 🛠️ Tech Stack

- **Frontend**: SvelteKit 5 + TypeScript
- **Backend**: SvelteKit API routes
- **Database**: SQLite + Drizzle ORM
- **Package Manager**: Bun
- **Containerization**: Docker

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # UI components
│   ├── server/db/          # Database setup
│   ├── stores/             # State management
│   └── utils/              # Utility functions
├── routes/
│   ├── +page.svelte        # Display page
│   ├── edit/+page.svelte   # Edit page
│   └── api/                # API endpoints
└── app.css                 # Global styles
```

## 🎯 Usage

1. **View Menu**: Navigate to `/` to see the menu structure
2. **Edit Menu**: Go to `/edit` to modify menu items
3. **Inline Editing**: Click "Edit" to rename items
4. **Drag and Drop Items**: Drag and drop items to change parent
5. **Delete Items**: Click "Delete" (cascades to children)

## 🐳 Docker

### Production Build
```bash
# Build and run production container
docker-compose up --build

# Access at http://0.0.0.0:3000
```

---
