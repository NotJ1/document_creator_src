
Welcome to Document Creator - A Collaborative Real-time Editor

This is a full-stack, real-time collaborative document editor, similar to Google Docs, built with a modern tech stack. It allows users to create, edit, manage, and share documents in real-time, both for personal use and within organisations.

## Features

-   **Real-time Collaborative Editing**: Multiple users can edit the same document simultaneously, with live cursor tracking and presence avatars, powered by Liveblocks.
-   **Rich Text Editor**: A comprehensive Tiptap-based editor supporting:
    -   Headings, paragraphs, and various font families.
    -   Font size and line height adjustments.
    -   Bold, italic, underline, and strikethrough formatting.
    -   Text alignment, color customization, and highlighting.
    -   Bullet, numbered, and task lists.
    -   Tables, hyperlinks, and image embedding (from URL or upload) with resizing.
-   **Authentication & Authorization**: Secure user and organization management provided by Clerk, allowing for both personal and team-based document ownership.
-   **Document Management**: A dashboard to view, search, create, rename, and delete documents.
-   **Template Gallery**: Start new documents quickly from a variety of templates like resumes, proposals, and letters.
-   **Commenting System**: Add and resolve threaded comments directly within the document for seamless feedback and discussion.
-   **Export Options**: Print documents to PDF or save them as HTML, JSON, or plain text.
-   **Responsive Design**: A clean, modern UI that works seamlessly on both desktop and mobile devices, built with Shadcn/UI and Tailwind CSS.
-   **Real-time Backend**: Convex powers the backend, providing a real-time database and serverless functions for all document operations.

## Tech Stack
-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Backend & Database**: Convex
-   **Real-time Collaboration**: Liveblocks
-   **Authentication**: Clerk
-   **Text Editor**: Tiptap
-   **Styling**: Tailwind CSS
-   **UI Components**: Shadcn/UI
-   **State Management**: Zustand
-   **URL State Management**: Nuqs 

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You will need to create accounts and projects on the following platforms:
-   [Convex](https://convex.dev)
-   [Clerk](https://clerk.com)
-   [Liveblocks](https://liveblocks.io)

### 1. Clone the Repository

```bash
git clone https://github.com/notj1/document_creator_src.git
cd document_creator_src
```

### 2. Install Dependencies

Dependencies are managed with npm (use npm install when installing these) and you may have to use --force or --legacy-peer-deps if you encounter issues during installation and are locked via package-lock.json for consistent installs.

### 3. Set Up Environment Variables

Create a file named `.env.local` in the root of your project and add the following environment variables. You'll get these values from the services you set up in the prerequisites.

```env
# Convex
NEXT_PUBLIC_CONVEX_URL= # Found in your Convex project settings

# Clerk
# Found in your Clerk project's API Keys section
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Liveblocks
LIVEBLOCKS_SECRET_KEY= # Found in your Liveblocks project settings
```

### 4. Configure Convex with Clerk

In your Convex project dashboard, navigate to `Settings -> Auth` and configure a new provider for Clerk using the `CLERK_JWT_ISSUER_DOMAIN` value from your `.env.local` file.

### 5. Run the Application

You need to run two processes in separate terminals: one for the Convex backend and one for the Next.js frontend.

1.  **Start the Convex development server:**
    This command will sync your backend schema and functions with the Convex cloud. Follow the CLI prompts to link your project.

    ```bash
    npx convex dev
    ```

2.  **Start the Next.js development server:**

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can now sign up and start creating documents!

## How to customise the convex schema 
https://docs.convex.dev/database/schemas - Link to the convex database documentation 

To edit the schema navigate to [`convex/schema.ts`](./convex/schema.ts) 

Below is the schema for my project
```
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(), // Dcoument Name
    initialContent: v.optional(v.string()), //Template text
    ownerId: v.string(), //User ID of the document owner
    roomId: v.optional(v.string()), //Liveblocks room ID for collaboration
    organisationId: v.optional(v.string()), //Org the document belongs to
  })

  .index("by_owner_id", ["ownerId"])//Query documents by owner
  .index("by_organisation_id", ["organisationId"]) //Query documents by org
  .searchIndex("search_title", {  
    searchField: "title", //Full text search on document titles
    filterFields: ["ownerId", "organisationId"], //Scope search for documents to individual owner or org
  }), 
});
```

### Known issues 
When a user from the same organisation attempts to view a document created by a user in the same organisation liveblocks will sometimes return an 404 user is not authorised message.

When a user creates a document that is meant to have a pre defined template the document is blank instead of showing the template 
