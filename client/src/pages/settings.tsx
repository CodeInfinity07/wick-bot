import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-settings">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure club and moderation settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Backend Implementation Required</CardTitle>
          </div>
          <CardDescription>
            Club settings API endpoints need to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Required backend features:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>GET /api/settings - Fetch club settings (avatars, guest IDs, ban level)</li>
            <li>PUT /api/settings - Update club settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
