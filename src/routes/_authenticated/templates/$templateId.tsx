import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/templates/$templateId')({
  component: () => <div className="p-6 border border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground bg-accent/50 min-h-[400px]">Placeholder for templates/$templateId.tsx</div>,
});
