import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Trash2 } from "lucide-react";
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
];

export default function Members() {
  const [members] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const getLevelBadgeVariant = (level: number) => {
    if (level >= 10) return "default";
    if (level >= 5) return "secondary";
    return "outline";
  };

  const filteredMembers = members.filter((member) =>
    member.NM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemove = (uid: string, name: string) => {
    console.log("Remove member:", uid);
    toast({ title: "Member Removed", description: `${name} has been removed from the club` });
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
