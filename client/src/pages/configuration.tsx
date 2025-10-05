import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Configuration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-configuration">Configuration</h1>
        <p className="text-muted-foreground mt-1">Configure bot settings and behavior</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Backend Implementation Required</CardTitle>
          </div>
          <CardDescription>
            Bot configuration API endpoints need to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Required backend features:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>GET /api/config - Fetch bot configuration (name, tone, welcome message)</li>
            <li>PUT /api/config - Update bot configuration</li>
            <li>GET /api/config/club - Fetch club information</li>
            <li>PUT /api/config/club - Update club information</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
