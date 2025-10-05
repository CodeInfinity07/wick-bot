import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Shield, Activity } from "lucide-react";
import { Link } from "wouter";

//todo: remove mock functionality
const mockStats = {
  totalMembers: 156,
  messagesProcessed: 2847,
  spamBlocked: 23,
  activeUsers: 89,
};

const clubInfo = {
  name: "REX SQUAD",
  code: "3029915",
};

//todo: remove mock functionality
const botConfig = {
  name: "Loki",
  tone: "upbeat",
};

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your bot and club statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={mockStats.totalMembers} icon={Users} iconColor="bg-blue-500" />
        <StatCard title="Messages Processed" value={mockStats.messagesProcessed} icon={MessageSquare} iconColor="bg-green-500" />
        <StatCard title="Spam Blocked" value={mockStats.spamBlocked} icon={Shield} iconColor="bg-amber-500" />
        <StatCard title="Active Users" value={mockStats.activeUsers} icon={Activity} iconColor="bg-cyan-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Club Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Club Name</p>
              <p className="text-xl font-semibold" data-testid="text-club-name">{clubInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Club Code</p>
              <p className="text-xl font-semibold" data-testid="text-club-code">{clubInfo.code}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bot Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Bot Name</p>
              <p className="text-lg font-semibold" data-testid="text-bot-name">{botConfig.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bot Tone</p>
              <p className="text-lg font-semibold capitalize" data-testid="text-bot-tone">{botConfig.tone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/members">
              <Button className="w-full" variant="default" data-testid="button-manage-members">
                Manage Members
              </Button>
            </Link>
            <Link href="/configuration">
              <Button className="w-full" variant="outline" data-testid="button-configure-bot">
                Configure Bot
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
