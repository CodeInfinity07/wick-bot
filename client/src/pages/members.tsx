import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality
const mockMembers = [
  { UID: "1", NM: "Alex Johnson", LVL: 15 },
  { UID: "2", NM: "Sarah Chen", LVL: 8 },
  { UID: "3", NM: "Mike Davis", LVL: 22 },
  { UID: "4", NM: "Emma Wilson", LVL: 5 },
  { UID: "5", NM: "Chris Brown", LVL: 12 },
  { UID: "6", NM: "Lisa Anderson", LVL: 3 },
  { UID: "7", NM: "John Smith", LVL: 2 },
  { UID: "8", NM: "Maria Garcia", LVL: 18 },
];

export default function Members() {
  const [members] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkLevel, setBulkLevel] = useState("");
  const [bulkCount, setBulkCount] = useState("");
  const { toast } = useToast();

  const getLevelBadgeVariant = (level: number) => {
    if (level >= 10) return "default";
    if (level >= 5) return "secondary";
    return "outline";
  };

  const filteredMembers = members.filter((member) =>
    member.NM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levelStats = {
    low: members.filter(m => m.LVL >= 1 && m.LVL <= 4).length,
    medium: members.filter(m => m.LVL >= 5 && m.LVL <= 9).length,
    high: members.filter(m => m.LVL >= 10).length,
  };

  const handleRemove = (uid: string, name: string) => {
    console.log("Remove member:", uid);
    toast({ title: "Member Removed", description: `${name} has been removed from the club` });
  };

  const handleBulkRemove = () => {
    const level = parseInt(bulkLevel);
    const count = parseInt(bulkCount);
    
    if (!level || !count) {
      toast({ 
        title: "Invalid Input", 
        description: "Please enter valid level and count values",
        variant: "destructive" 
      });
      return;
    }

    console.log("Bulk remove:", { level, count });
    toast({ 
      title: "Bulk Removal Initiated", 
      description: `Removing ${count} members at level ${level}` 
    });
    setBulkLevel("");
    setBulkCount("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-members">Members</h1>
          <p className="text-muted-foreground mt-1">Manage club members</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-members"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-level-1-4">{levelStats.low}</p>
                <p className="text-sm text-muted-foreground">Level 1-4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-level-5-9">{levelStats.medium}</p>
                <p className="text-sm text-muted-foreground">Level 5-9</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-level-10-plus">{levelStats.high}</p>
                <p className="text-sm text-muted-foreground">Level 10+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Member Removal</CardTitle>
          <CardDescription>Remove multiple members by level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="bulk-level">Level</Label>
              <Input
                id="bulk-level"
                type="number"
                placeholder="Enter level (e.g., 5)"
                value={bulkLevel}
                onChange={(e) => setBulkLevel(e.target.value)}
                min={1}
                max={100}
                data-testid="input-bulk-level"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="bulk-count">Count</Label>
              <Input
                id="bulk-count"
                type="number"
                placeholder="Number to remove (e.g., 10)"
                value={bulkCount}
                onChange={(e) => setBulkCount(e.target.value)}
                min={1}
                max={100}
                data-testid="input-bulk-count"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleBulkRemove} 
                variant="destructive"
                className="w-full sm:w-auto"
                data-testid="button-bulk-remove"
              >
                Remove Members
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
          <CardDescription>{filteredMembers.length} members found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div
                key={member.UID}
                className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                data-testid={`member-card-${member.UID}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.NM.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold" data-testid={`member-name-${member.UID}`}>{member.NM}</p>
                    <Badge variant={getLevelBadgeVariant(member.LVL)} className="mt-1" data-testid={`member-level-${member.UID}`}>
                      Level {member.LVL}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(member.UID, member.NM)}
                  data-testid={`button-remove-${member.UID}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
