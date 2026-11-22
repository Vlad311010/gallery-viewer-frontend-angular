# GalleryViewer Frontend (Angular)

An Angular-based frontend for browsing, organizing, and managing image and video collections through the GalleryViewer REST API.

The application provides a responsive media gallery with asset browsing, tagging, group management, and dedicated image and video viewing experiences.

## Features

- Gallery and media asset browsing
- Image and video previews
- Dedicated image and video viewers
- Image tagging — create tags, assign tags to assets, and search by tags
- Gallery and asset group management


## Technologies

- **Angular 22** — frontend framework
- **TypeScript** — application programming language
- **RxJS** — reactive programming and asynchronous data handling
- **TanStack Query for Angular** — server-state management, queries, mutations.
- **SCSS / Sass** — styling
- **HTML5 / CSS3** — templates and layout
- **Angular CLI** — project tooling and builds
- **Node.js / npm** — JavaScript runtime and package management

## API Integration

The frontend communicates with the GalleryViewer backend through its REST API.

The backend exposes an **OpenAPI contract**, which is used by **ng-openapi** to generate a strongly typed TypeScript API client.

Generated API code is committed to the repository and only needs to be regenerated when the API contract changes.


## Architecture

The frontend is built with Angular and follows a component-oriented architecture.

Application logic is organized into reusable components and feature-specific modules or folders, with component templates and styles maintained separately where practical.
****
Server state and API communication are handled through **TanStack Query for Angular**, while **RxJS** is used for reactive programming and asynchronous data handling.


## Getting Started

### Prerequisites

- Node.js
- npm 11.20.0
- Angular CLI 22.2.5

### Installation

```bash
git clone https://github.com/Vlad311010/gallery-viewer-front-angular.git
cd <project-directory>
npm install
```

### Development Configuration

For local development, configure the environment file: `src\environments\environment.development.ts`

```env
apiBaseUrl: <backend_api_url>
```

The `apiBaseUrl` specifies the backend instance used by the application.

### Development

```bash
ng serve
```


The development server will be available at:

```text
http://localhost:5173/
```

## API Client Generation

The TypeScript API client is generated from the backend OpenAPI contract using **ng-openapi**.

```bash
npm run generate-api
```
API source can be configured inside `openapi.config.ts` file. Other settings beside `input` should be left unchanged.

API generation is only required when the backend API contract changes.

## Production Build

```bash
npm run publish <destination_path>

destination_path should be a wwroot folder of publish backend part.
```
The published frontend is served by the GalleryViewer backend.

Since the frontend and API share the same origin in production, a separate API URL is not  required.

## Project Structure


The project follows a component-oriented architecture using Angular components, pages, services, and shared functionality.


## Backend

Backend repository:

**https://github.com/Vlad311010/GalleryViewer**

See the backend README for API setup, database configuration, media synchronization, and deployment instructions.