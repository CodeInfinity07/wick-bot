import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

//todo: remove mock functionality
const mockLogs = [
  { id: 1, time: "14:32:15", type: "info", message: "Bot connected successfully" },
  { id: 2, time: "14:33:22", type: "success", message: "User 'Alex' joined the club" },
  { id: 3, time: "14:34:10", type: "warning", message: "Spam word detected in message" },
  { id: 4, time: "14:35:45", type: "error", message: "Failed to process message from user 'Bot123'" },
  { id: 5, time: "14:36:12", type: "info", message: "Configuration updated" },
  { id: 6, time: "14:37:30", type: "success", message: "Member removed: Level 2 user" },
  { id: 7, time: "14:38:15", type: "warning", message: "Banned pattern detected: discord.gg" },
  { id: 8, time: "14:39:05", type: "info", message: "Processing 50 messages" },
];

const getLogTypeColor = (type: string) => {
  switch (type) {
    case "info": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-l-blue-500";
    case "success": return "bg-green-500/10 text-green-700 dark:text-green-400 border-l-green-500";
    case "warning": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-amber-500";
    case "error": return "bg-red-500/10 text-red-700 dark:text-red-400 border-l-red-500";
    default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-l-gray-500";
  }
};

const getLogBadgeVariant = (type: string) => {
  switch (type) {
    case "info": return "outline";
    case "success": return "default";
    case "warning": return "secondary";
    case "error": return "destructive";
    default: return "outline";
  }
};

export default function ActivityLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-logs">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Real-time bot activity and events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events and system messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-md border-l-4 ${getLogTypeColor(log.type)}`}
                data-testid={`log-entry-${log.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getLogBadgeVariant(log.type)} className="text-xs uppercase">
                        {log.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono" data-testid={`log-time-${log.id}`}>
                        {log.time}
                      </span>
                    </div>
                    <p className="text-sm break-words" data-testid={`log-message-${log.id}`}>{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
