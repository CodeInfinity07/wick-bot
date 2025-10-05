import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Members() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-members">Members</h1>
        <p className="text-muted-foreground mt-1">Manage club members</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Backend Implementation Required</CardTitle>
          </div>
          <CardDescription>
            Member management API endpoints need to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Required backend features:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>GET /api/members - Fetch all club members</li>
            <li>DELETE /api/members/:id - Remove individual member</li>
            <li>POST /api/members/bulk-remove - Bulk member removal by level</li>
            <li>GET /api/members/stats - Level distribution statistics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
