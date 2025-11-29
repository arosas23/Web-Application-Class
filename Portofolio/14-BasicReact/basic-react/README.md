# Star Wars Movie Gallery

A React application showcasing Star Wars episodes with an interactive movie gallery. Browse iconic characters, view episode details, like/dislike movies, and leave comments on your favorite scenes.

## Project Structure

```
src/
├── index.js           # React app entry point
├── App.jsx            # Main component with movie grid layout
├── data.js            # Star Wars episode data
├── styles.css         # Custom styles (Bootstrap integration)
└── components/
    ├── MovieCard.jsx      # Card display for each movie with like/dislike
    └── MovieDetail.jsx    # Detailed view with character info and comments
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
# Navigate to project directory
cd basic-react

# Install dependencies
npm install

# Start development server
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode with hot reload.

### `npm run build`
Builds the app for production in the `build/` folder.

### `npm test`
Launches the test runner in watch mode.

