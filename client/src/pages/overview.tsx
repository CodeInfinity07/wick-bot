import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your bot and club statistics</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Backend Implementation Required</CardTitle>
          </div>
          <CardDescription>
            No API endpoints have been implemented yet. Please implement the backend routes to enable dashboard functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The following features require backend implementation:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Club statistics and member counts</li>
            <li>Bot configuration management</li>
            <li>Member data and level tracking</li>
            <li>Protection settings and spam filters</li>
            <li>Activity logs and monitoring</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
