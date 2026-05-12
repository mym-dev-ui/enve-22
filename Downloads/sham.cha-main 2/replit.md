# Sham Cash Visitor Management System

## Overview
A Next.js 14 visitor management web application migrated from Vercel to Replit.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **Language**: TypeScript

## Project Structure
- `app/` - Next.js App Router pages (dashboard, registration, password-reset)
- `components/` - Shared React components
- `contexts/` - React context providers (VisitorContext)
- `hooks/` - Custom React hooks (useVisitors)
- `lib/` - Shared types and utilities

## Running the App
The app runs on port 5000 with the "Start application" workflow using `npm run dev`.

## Replit Configuration
- Port: 5000 (bound to 0.0.0.0 for Replit preview compatibility)
- Package manager: npm
- Node version: 20
