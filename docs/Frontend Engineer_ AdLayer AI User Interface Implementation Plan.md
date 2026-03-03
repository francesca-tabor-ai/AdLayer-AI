# Frontend Engineer: AdLayer AI User Interface Implementation Plan

## UI Component Structure

The AdLayer AI frontend will be built using a component-based architecture, leveraging React.js. This approach promotes reusability, maintainability, and scalability. Key components will include:

### Layout Components
*   **`AppLayout`**: Main layout component, including header, sidebar (for navigation), and content area.
*   **`Header`**: Contains logo, user profile, notifications, and global actions.
*   **`Sidebar`**: Navigation links to different sections (Dashboard, Image Upload, Analysis, Exports, Settings).
*   **`Footer`**: Copyright information, links to terms of service/privacy policy.

### Core Application Components
*   **`ImageUploadArea`**: Drag-and-drop zone, file input, and upload progress indicator.
*   **`ImageCard`**: Displays a thumbnail of an uploaded image, its status, and actions (View Analysis, Download, Delete).
*   **`AnalysisView`**: Main component for displaying the structured data of an ad.
    *   **`ElementTable`**: Displays extracted elements in a tabular format with inline editing capabilities.
    *   **`InformationArchitectureTree`**: Visual representation of the ad's IA, potentially an interactive tree view.
    *   **`ImageViewer`**: Displays the ad image with overlayed bounding boxes for detected elements.
*   **`ExportOptions`**: Form for configuring CSV/JSON export parameters.
*   **`DashboardWidgets`**: Small, reusable components displaying key metrics (e.g., 
total images processed, pending exports).

### UI Primitives (Design System)
*   **`Button`**: Primary, secondary, danger, disabled states.
*   **`Input`**: Text, number, file, checkbox, radio.
*   **`Dropdown`**: Select options.
*   **`Modal`**: For confirmations, forms, and detailed views.
*   **`Spinner/Loader`**: For indicating loading states.
*   **`Notification/Toast`**: For user feedback (success, error, info).
*   **`Table`**: Generic table component with sorting and pagination.

## Page Structure

### 1. Login/Registration Page
*   Simple, clean layout with forms for email/password.
*   Links for forgotten password and registration.

### 2. Dashboard Page (`/dashboard`)
*   Overview of user activity and platform status.
*   Widgets displaying: recently processed images, pending tasks, usage statistics, quick links to upload/analysis.

### 3. Image Upload Page (`/upload`)
*   Prominent `ImageUploadArea` component.
*   Instructions for supported file types and maximum file size.
*   List of recently uploaded images with their processing status.

### 4. Image Analysis Page (`/analysis/:image_id`)
*   Central view for a single processed ad image.
*   Left panel: `ImageViewer` displaying the ad with interactive bounding boxes.
*   Right panel: `ElementTable` for detailed data review and editing, `InformationArchitectureTree`.
*   Action buttons: Export, Delete, Re-process.

### 5. Exports Page (`/exports`)
*   List of all past export jobs with status and download links.
*   Options to filter and search exports.

### 6. Settings Page (`/settings`)
*   User profile management.
*   Subscription details and billing information.
*   API key management.

## State Management Approach

We will utilize **React Query** for server state management and **Zustand** (or a similar lightweight global state manager) for client-side UI state. This approach provides:

*   **React Query:** Excellent for data fetching, caching, synchronization, and managing asynchronous operations. It handles loading, error, and success states automatically, reducing boilerplate.
*   **Zustand:** Simple, fast, and scalable for managing local UI state that doesn't need to be persisted or shared across many components (e.g., modal open/close, form input values).
*   **Context API:** For less frequently changing global state like user authentication status or theme preferences.

## API Integration Plan

All API interactions will be handled through a dedicated **API client module** (e.g., using `axios` or `fetch` with wrappers). This module will:

*   **Centralize API calls:** All requests go through this module.
*   **Handle authentication:** Automatically attach JWT tokens to requests.
*   **Error handling:** Intercept API errors and provide consistent error messages to the UI (e.g., using React Query's error handling).
*   **Request/Response Transformation:** Normalize data formats between the frontend and backend.
*   **React Query Integration:** Each data fetching operation will be encapsulated in a React Query hook (e.g., `useImageAnalysis(imageId)`, `useUploadImage()`).

**Example API Integration (Conceptual):**

```javascript
// api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getImageAnalysis = (imageId) => {
  return apiClient.get(`/analysis/${imageId}`);
};

// hooks.js
import { useMutation, useQuery } from 'react-query';
import { uploadImage, getImageAnalysis } from './api';

export const useUploadImage = () => {
  return useMutation(uploadImage);
};

export const useImageAnalysis = (imageId) => {
  return useQuery(['imageAnalysis', imageId], () => getImageAnalysis(imageId));
};
```

## Performance Optimization Strategy

1.  **Code Splitting & Lazy Loading:** Use React.lazy and Suspense to split the application into smaller chunks, loading only the necessary code for the current view.
2.  **Image Optimization:**
    *   Serve optimized image formats (WebP).
    *   Implement responsive images (`srcset`, `sizes`) to deliver appropriate image sizes based on device.
    *   Lazy load images that are not immediately in the viewport.
3.  **Virtualization/Windowing:** For large lists or tables (e.g., `ElementTable`), use libraries like `react-window` or `react-virtualized` to render only visible rows, improving performance.
4.  **Caching:** Leverage React Query's caching mechanisms for API responses to avoid unnecessary data fetches.
5.  **Bundle Analysis:** Regularly analyze the JavaScript bundle size using tools like Webpack Bundle Analyzer to identify and reduce large dependencies.
6.  **Server-Side Rendering (SSR) / Static Site Generation (SSG):** Utilize Next.js capabilities for SSR/SSG where appropriate (e.g., static marketing pages, initial dashboard load) to improve initial load times and SEO.
7.  **CDN for Static Assets:** Serve all static assets (JS, CSS, images) through a Content Delivery Network.
8.  **Debouncing/Throttling:** Apply debouncing to search inputs and throttling to frequently triggered events to reduce unnecessary re-renders and API calls.
9.  **Web Workers:** Explore using Web Workers for computationally intensive client-side tasks (if any) to avoid blocking the main UI thread.

## Prioritize Usability and Clarity

*   **Intuitive Navigation:** Clear and consistent navigation structure.
*   **Visual Hierarchy:** Use typography, spacing, and color to guide the user's eye and highlight important information.
*   **Clear Feedback:** Provide immediate and understandable feedback for user actions (e.g., loading spinners, success messages, error alerts).
*   **Accessibility:** Adhere to WCAG guidelines, ensuring keyboard navigation, proper ARIA attributes, and sufficient color contrast.
*   **Consistent Design System:** Utilize a well-defined design system (e.g., Tailwind CSS with custom components) to ensure visual consistency across the application.
*   **Error Prevention & Recovery:** Implement input validation, clear error messages, and easy ways to recover from mistakes.
*   **Progressive Disclosure:** Show only essential information initially, revealing more details as needed to avoid overwhelming the user.
