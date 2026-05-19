// CSS module declarations for TypeScript
declare module "*.css" {
  const content: Record<string, string>
  export default content
}

// Also declare side-effect CSS imports (used in layout.tsx)
declare module "./globals.css"
declare module "../globals.css"
