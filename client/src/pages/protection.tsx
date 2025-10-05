import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Protection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-protection">Protection</h1>
        <p className="text-muted-foreground mt-1">Manage spam filters and security settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Backend Implementation Required</CardTitle>
          </div>
          <CardDescription>
            Protection settings API endpoints need to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Required backend features:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>GET /api/protection/spam-words - Fetch spam word list</li>
            <li>PUT /api/protection/spam-words - Update spam word list (textarea format)</li>
            <li>GET /api/protection/banned-patterns - Fetch banned patterns</li>
            <li>POST /api/protection/banned-patterns - Add banned pattern</li>
            <li>DELETE /api/protection/banned-patterns/:id - Remove banned pattern</li>
            <li>GET /api/protection/admins - Fetch admin list</li>
            <li>POST /api/protection/admins - Add admin</li>
            <li>DELETE /api/protection/admins/:id - Remove admin</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
