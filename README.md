# E-commerce Product Image & Copy Generator

Single-page React prototype for generating draft e-commerce marketing assets from product inputs.

## Overview

This project simulates a B2B creative workflow for e-commerce operators. Users can:

- enter product details
- upload 1 to 3 reference images
- generate mock image and copy variations
- switch between variations
- edit generated text directly
- copy marketing text
- trigger mock image download

The app is frontend-only. All generation is mocked locally with no backend dependency.

## Core Features

- Split-screen layout with input panel and output panel
- Validation for required product data before generation
- Empty, loading, success, and error result states
- Mock async generation flow with reusable generator logic
- Editable generated title, tagline, and description
- Image thumbnail upload with preview and removal
- Toast feedback for copy/download actions
- Responsive layout that stacks on smaller screens
- Material-inspired visual styling

## Input Fields

- Product Name
- Category
- Price
- Brand
- Selling Points
- Description
- Target Audience
- Copy Style
- Image Style
- Image Upload

## Output States

### Empty

Guides the user to complete the form and upload images.

### Loading

Shows a spinner and mock processing state.

### Success

Displays multiple generated variations with:

- preview image
- editable title
- editable short marketing line
- editable description
- copy text action
- regenerate action
- mock download image action

### Error

Displays a retry path if mock generation fails.

## Tech Stack

- React
- TypeScript
- Vite
- CSS

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  App.tsx
  main.tsx
  styles.css
  types.ts
  components/
    FormPanel.tsx
    ResultsPanel.tsx
    Toast.tsx
    ResizableTextarea.tsx
  data/
    mockGenerator.ts
```

## Notes

- `generateMockResults` in `src/data/mockGenerator.ts` keeps generation logic separate from UI code.
- The prototype uses uploaded image previews as stand-ins for generated assets.
- Entering a product name containing `error` triggers the mocked error state.
