const fs = require('fs');
const path = require('path');

const routes = [
  'dashboard.tsx',
  'documents/index.tsx',
  'documents/new.tsx',
  'documents/$documentId.tsx',
  'templates/index.tsx',
  'templates/new.tsx',
  'templates/$templateId.tsx',
  'settings/workspace.tsx',
  'settings/branding.tsx',
  'settings/team.tsx',
  'settings/billing.tsx'
];

routes.forEach(route => {
  const fullPath = path.join(__dirname, 'src', 'routes', '_authenticated', route);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Generate route path string for TanStack router
  let routeStr = '/_authenticated/' + route.replace('.tsx', '').replace(/\/index$/, '/').replace(/index$/, '/');
  if (routeStr.endsWith('/') && routeStr !== '/_authenticated/') routeStr = routeStr.slice(0, -1);
  
  // Format component name safely
  const componentName = route.replace(/[^a-zA-Z0-9]/g, '');

  const content = `import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('${routeStr}')({
  component: () => <div className="p-6 border border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground bg-accent/50 min-h-[400px]">Placeholder for ${route}</div>,
});
`;

  fs.writeFileSync(fullPath, content);
  console.log('Created', fullPath);
});
