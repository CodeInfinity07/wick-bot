import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function BotControls() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-bot-controls">Bot Controls</h1>
        <p className="text-muted-foreground mt-1">Manage bot operations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Backend Implementation Required</CardTitle>
          </div>
          <CardDescription>
            Bot control API endpoints need to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Required backend features:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>GET /api/bot/status - Get bot operational status</li>
            <li>POST /api/bot/start - Start the bot</li>
            <li>POST /api/bot/stop - Stop the bot</li>
            <li>POST /api/bot/restart - Restart the bot</li>
            <li>POST /api/bot/clear-cache - Clear bot cache</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
