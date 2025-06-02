# Valiblox Data Check

## Overview

Valiblox is a SaaS platform that automates validation of engineering documents, drawings, and deliverables. It helps engineering teams save time by automating manual validation processes.

### Key Features

- **Naming Standard Validator**: Verify file naming conventions for engineering documents
- **Deliverables Tracker**: Track project deliverables against requirements
- **Quality Checker**: Validate document quality standards

## File Naming Validator

The File Naming Validator helps ensure that all your project files follow the standardized naming convention.

### How to Use the Naming Validator

1. **Download Template**: Get the standard naming convention template Excel file
2. **Customize Template**: Fill in your project-specific naming rules
3. **Upload Template**: Upload your completed naming convention file
4. **Select Files**: Choose files or folders to validate
5. **Review Results**: See validation results and export reports

### Template Format

The naming convention template requires the following structure:

- **Row 1**: Contains basic configuration
  - Cell B1: Number of parts in filename
  - Cell D1: Delimiter character (e.g., "_" or "-")
- **Row 2+**: Contains allowed values for each filename part
  - Each column represents a part of the filename
  - Each row in a column represents an allowed value for that part

### Validation Logic

- Files are validated against the defined naming convention
- Parts are checked for compliance with allowed values
- Results show compliant and non-compliant files with details

## Project Setup

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Core Validation Modules

### src/lib/naming.ts

The `naming.ts` module provides file naming validation:

```typescript
import { validateName, NamingRules } from "@/lib/naming";

// Define naming rules
const rules: NamingRules = {
  partsCount: 3,
  delimiter: "-",
  partRules: [
    ["PRJ", "TEST"],           // First part options
    ["001", "002", "003"],     // Second part options
    ["Description"]            // Third part is any description
  ]
};

// Validate a filename
const result = validateName("PRJ-001-MainDrawing.pdf", rules);
console.log(result.compliance); // 'Ok' or 'Wrong'
```

### src/lib/drawingList.ts

The `drawingList.ts` module compares drawing lists against actual files:

```typescript
import { compare } from "@/lib/drawingList";

const drawingList = ["Drawing 001", "Drawing 002", "Drawing 003"];
const files = ["Drawing 001.pdf", "Drawing 002.pdf", "Extra File.pdf"];

const result = compare(drawingList, files);
console.log(`Found ${result.matchedCount} of ${result.totalListItems} items`);
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2a8908ab-c027-4935-9665-5a35284336ec) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
