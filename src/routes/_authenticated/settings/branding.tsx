import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { authClient } from '../../../lib/auth-client';
import { useState, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/settings/branding')({
  component: BrandingSettingsPage,
});

function BrandingSettingsPage() {
  const router = useRouter();
  const { data: orgData, isPending } = authClient.useActiveOrganization();
  const [loading, setLoading] = useState(false);
  
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [accentColor, setAccentColor] = useState('#0d9488'); // Default teal

  useEffect(() => {
    // @ts-expect-error brandSettings is dynamically injected
    if (orgData?.brandSettings) {
      try {
        // @ts-expect-error brandSettings is dynamically injected
        const parsed = JSON.parse(orgData.brandSettings as string);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.headerText) setHeaderText(parsed.headerText);
        if (parsed.footerText) setFooterText(parsed.footerText);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
      } catch (e) {
        console.error("Failed to parse brand settings", e);
      }
    }
  }, [orgData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgData?.id) return;
    
    setLoading(true);
    const brandSettingsStr = JSON.stringify({
      companyName,
      address,
      headerText,
      footerText,
      accentColor
    });

    await authClient.organization.update({
        organizationId: orgData.id,
        data: { 
          // @ts-expect-error dynamically added schema property
          brandSettings: brandSettingsStr 
        },
    });
    setLoading(false);
    router.invalidate();
  };

  if (isPending) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Branding Identity</h2>
        </div>
        <Card className="max-w-2xl animate-pulse">
            <CardHeader className="h-24 bg-muted/50 rounded-t-xl" />
            <CardContent className="h-48" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Branding Identity</h2>
      </div>

      <div className="grid gap-6">
        <Card className="max-w-2xl">
          <form onSubmit={handleUpdate}>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how your documents look when generated into PDFs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label>Organization Logo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <UploadCloud className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Upload new photo</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    PNG or SVG, Max 2MB (Feature simulated locally)
                  </p>
                  <Button variant="outline" size="sm" type="button">Select File</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Registered Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Logistics Partners LLC"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Registered Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Ocean Drive, Suite 400..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headerText">PDF Header Text</Label>
                  <Input
                    id="headerText"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="CONFIDENTIAL DOCUMENT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerText">PDF Footer Text / Disclaimers</Label>
                  <Input
                    id="footerText"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="Bank Details: ACME / 1234..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Document Accent Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="accentColor"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-24 p-1 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-muted-foreground uppercase">{accentColor}</span>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <p className="text-sm text-muted-foreground">
                These settings take effect on newly generated documents.
              </p>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save brand settings'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
