# Slack Clone Implementation Plan

## Database Setup
- [x] Step 1: Create database schema
  - **Task**: Define the database schema for profiles, channels, messages, threads, and reactions using Drizzle ORM.
  - **Files**:
    - `db/schema/profiles.ts`: Define profiles table schema (not for authentication, just for user data)
    - `db/schema/channels.ts`: Define channels table schema
    - `db/schema/messages.ts`: Define messages table schema
    - `db/schema/reactions.ts`: Define message reactions table schema
    - `db/schema/index.ts`: Export all schema definitions
  - **Step Dependencies**: None
  - **User Instructions**: Ensure your Supabase database is created and the DATABASE_URL is properly set in .env.local file

- [x] Step 2: Create seed data for profiles and channels
  - **Task**: Create a seed script to populate the database with initial profiles and channels
  - **Files**:
    - `db/seed.ts`: Script to seed the database with initial data
    - `scripts/seed.ts`: Entry point for running the seed script
    - `package.json`: Add a script to run the seed command
  - **Step Dependencies**: Step 1
  - **User Instructions**: After setting up the schema, run `npm run db:seed` to populate the database with initial data

- [x] Step 3: Set up database migrations
  - **Task**: Generate and run migrations for the defined schema
  - **Files**:
    - `db/migrations/`: Generated migration files
  - **Step Dependencies**: Steps 1, 2
  - **User Instructions**: After generating the schema, run `npm run db:generate` to create migrations and `npm run db:migrate` to apply them

## UI Components
- [ ] Step 4: Create basic UI components using shadcn/ui
  - **Task**: Set up the foundational UI components needed for the application
  - **Files**:
    - `components/ui/button.tsx`: Button component
    - `components/ui/input.tsx`: Input component
    - `components/ui/textarea.tsx`: Textarea component
    - `components/ui/avatar.tsx`: Avatar component
    - `components/ui/dropdown-menu.tsx`: Dropdown menu component
  - **Step Dependencies**: None
  - **User Instructions**: None

- [ ] Step 5: Create application-specific UI components
  - **Task**: Create custom components specific to our messaging application
  - **Files**:
    - `components/message-item.tsx`: Component for rendering individual messages
    - `components/message-list.tsx`: Component for rendering a list of messages
    - `components/channel-item.tsx`: Component for rendering channel items in the sidebar
    - `components/channel-list.tsx`: Component for rendering the list of channels
    - `components/message-input.tsx`: Component for composing new messages
  - **Step Dependencies**: Step 4
  - **User Instructions**: None

## Profile Selection
- [ ] Step 6: Create profile selection functionality
  - **Task**: Since we're not doing authentication, create a component to select which profile to use
  - **Files**:
    - `components/profile-selector.tsx`: Component for selecting a profile
    - `lib/profile.ts`: Utility functions for managing the current profile
  - **Step Dependencies**: Steps 1, 2, 3
  - **User Instructions**: None

## Layout and Navigation
- [ ] Step 7: Create application layout
  - **Task**: Create the main application layout with sidebar and content area
  - **Files**:
    - `app/(main)/layout.tsx`: Main application layout with sidebar
    - `components/sidebar.tsx`: Sidebar component displaying channels and users
    - `components/sidebar/sidebar-nav.tsx`: Navigation component for the sidebar
    - `components/sidebar/sidebar-section.tsx`: Section component for the sidebar
    - `components/sidebar/profile-display.tsx`: Component to display the current profile
  - **Step Dependencies**: Steps 4, 5, 6
  - **User Instructions**: None

## Core Functionality
- [ ] Step 8: Implement server actions for channels
  - **Task**: Create server actions for creating and fetching channels
  - **Files**:
    - `app/actions/channels.ts`: Server actions for channel operations
    - `lib/helpers.ts`: Helper functions for server actions
  - **Step Dependencies**: Steps 1, 2, 3
  - **User Instructions**: None

- [ ] Step 9: Create channels page
  - **Task**: Implement the channels page that displays a list of channels and allows creating new ones
  - **Files**:
    - `app/(main)/channels/page.tsx`: Channels listing page
    - `components/forms/create-channel-form.tsx`: Form for creating new channels
  - **Step Dependencies**: Steps 7, 8
  - **User Instructions**: None

- [ ] Step 10: Implement server actions for messages
  - **Task**: Create server actions for creating, fetching, editing, and deleting messages
  - **Files**:
    - `app/actions/messages.ts`: Server actions for message operations
  - **Step Dependencies**: Steps 1, 2, 3
  - **User Instructions**: None

- [ ] Step 11: Create individual channel page
  - **Task**: Create the channel page showing messages for a specific channel
  - **Files**:
    - `app/(main)/channels/[channelId]/page.tsx`: Individual channel page
    - `components/message-container.tsx`: Container for messages in a channel
  - **Step Dependencies**: Steps 7, 10
  - **User Instructions**: None

## Message Features
- [ ] Step 12: Implement message threads
  - **Task**: Add support for threaded conversations
  - **Files**:
    - `app/actions/threads.ts`: Server actions for thread operations
    - `components/thread-item.tsx`: Component for displaying thread items
    - `components/thread-list.tsx`: Component for displaying a list of thread messages
    - `app/(main)/channels/[channelId]/threads/[messageId]/page.tsx`: Thread view page
  - **Step Dependencies**: Steps 10, 11
  - **User Instructions**: None

- [ ] Step 13: Implement message reactions
  - **Task**: Add support for adding emoji reactions to messages
  - **Files**:
    - `app/actions/reactions.ts`: Server actions for reaction operations
    - `components/message-reactions.tsx`: Component for displaying message reactions
    - `components/reaction-picker.tsx`: Component for picking a reaction
  - **Step Dependencies**: Steps 10, 11
  - **User Instructions**: None

- [ ] Step 14: Implement message editing and deletion
  - **Task**: Add support for editing and deleting messages
  - **Files**:
    - `components/message-actions.tsx`: Component for message actions (edit, delete)
    - `components/forms/edit-message-form.tsx`: Form for editing messages
  - **Step Dependencies**: Steps 10, 11
  - **User Instructions**: None

## Direct Messaging
- [ ] Step 15: Implement direct messaging
  - **Task**: Add support for direct messaging between profiles
  - **Files**:
    - `app/actions/direct-messages.ts`: Server actions for direct message operations
    - `app/(main)/messages/[profileId]/page.tsx`: Direct message page
    - `components/profile-list.tsx`: Component for listing profiles for direct messaging
  - **Step Dependencies**: Steps 1, 2, 3, 7
  - **User Instructions**: None

## Polish and Refinements
- [ ] Step 16: Implement optimistic updates
  - **Task**: Add optimistic updates for better user experience when sending messages
  - **Files**:
    - `lib/optimistic.ts`: Helpers for optimistic updates
    - Update relevant components to support optimistic updates
  - **Step Dependencies**: Steps 10, 11, 12, 13, 14, 15
  - **User Instructions**: None

- [ ] Step 17: Add loading states and error handling
  - **Task**: Implement loading states and error handling throughout the application
  - **Files**:
    - `components/ui/loading-spinner.tsx`: Loading spinner component
    - `components/error-message.tsx`: Error message component
    - Update relevant components with loading and error states
  - **Step Dependencies**: All previous steps
  - **User Instructions**: None

- [ ] Step 18: Update metadata and finalize styling
  - **Task**: Update metadata, favicon, and finalize the application styling
  - **Files**:
    - `app/layout.tsx`: Update metadata
    - `app/globals.css`: Finalize global styles
    - Update various components for consistent styling
  - **Step Dependencies**: All previous steps
  - **User Instructions**: None

- [ ] Step 19: Create landing page
  - **Task**: Create a landing page that introduces the application and allows selecting a profile
  - **Files**:
    - `app/page.tsx`: Update the landing page with profile selection
    - `components/home/hero.tsx`: Hero component for the landing page
  - **Step Dependencies**: Steps 6, 18
  - **User Instructions**: None