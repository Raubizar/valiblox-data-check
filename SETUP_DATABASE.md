# Database Setup Instructions

## Problem Identified
The project creation is failing because the Supabase database schema has not been applied yet. The error shows:
```
❌ Projects table error: relation "public.projects" does not exist
```

## Solution: Apply Database Schema

You need to run the enhanced database schema in your Supabase project. Here's how:

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Navigate to your project: `https://xewxwbngpojfokcaumsx.supabase.co`

2. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Create a new query

3. **Run the Enhanced Schema**
   - Copy the entire contents of `enhanced_supabase_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

### Option 2: Using Supabase CLI (Alternative)

If you have Supabase CLI installed:
```bash
supabase db reset
# Then apply the schema
```

## What the Schema Creates

The enhanced schema will create:

1. **Tables:**
   - `projects` - Main projects table with client, location, status
   - `disciplines` - Lookup table for engineering disciplines
   - `naming_standards` - File storage for naming standards
   - `drawing_lists` - File storage for drawing lists
   - `reports` - Generated reports with discipline tagging

2. **Sample Disciplines:**
   - Architectural (ARC)
   - Structural (STR)
   - Mechanical (MEC)
   - Electrical (ELE)
   - Plumbing (PLB)
   - Fire Protection (FP)
   - Civil (CIV)
   - General (GEN)

3. **Views:**
   - `project_summary` - Aggregated project statistics
   - `discipline_performance` - Performance metrics by discipline

## After Setup

Once the schema is applied:

1. **Test the Connection**
   ```bash
   node test-project-creation.js
   ```
   This should now show ✅ for all tests.

2. **Verify in Dashboard**
   - The Projects tab should now allow creating new projects
   - The error "Failed to create project" should be resolved

## Current Database Configuration

- **URL:** https://xewxwbngpojfokcaumsx.supabase.co
- **Project ID:** xewxwbngpojfokcaumsx
- **API Key:** Already configured in the application

## Next Steps After Schema Setup

1. Create your first project in the dashboard
2. Upload naming standards and drawing lists
3. Generate reports with proper project/discipline context
4. View insights and analytics in the dashboard
