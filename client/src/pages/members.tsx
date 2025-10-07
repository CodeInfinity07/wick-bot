import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Users, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Member {
  UID: string;
  NM: string;
  LVL: number;
}

interface MembersResponse {
  success: boolean;
  data: {
    members: Member[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    levelStats: {
      total: number;
      lowLevel: number;
      mediumLevel: number;
      highLevel: number;
    };
  };
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkLevel, setBulkLevel] = useState("");
  const [bulkCount, setBulkCount] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { toast } = useToast();

  const buildUrl = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return `/api/jack/members?${params.toString()}`;
  };

  const { data, isLoading, isError } = useQuery<MembersResponse>({
    queryKey: [buildUrl()],
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (uid: string) => {
      return await apiRequest("DELETE", `/api/jack/members/${uid}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jack/members"] });
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    },
  });

  const bulkRemoveMutation = useMutation({
    mutationFn: async (data: { level: number; count: number }) => {
      return await apiRequest("POST", "/api/jack/members/bulk-remove", data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/jack/members"] });
      toast({
        title: "Success",
        description: response.message || "Members removed successfully",
      });
      setBulkLevel("");
      setBulkCount("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove members",
        variant: "destructive",
      });
    },
  });

  const handleRemoveMember = (uid: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      removeMemberMutation.mutate(uid);
    }
  };

  const handleBulkRemove = () => {
    const level = parseInt(bulkLevel);
    const count = parseInt(bulkCount);

    if (isNaN(level) || isNaN(count) || level < 1 || count < 1) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid level and count",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Remove ${count} members at level ${level}?`)) {
      bulkRemoveMutation.mutate({ level, count });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (data && data.data && data.data.totalPages) {
      setPage((prev) => Math.min(data.data.totalPages, prev + 1));
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  const members = data?.data?.members || [];
  const stats = data?.data?.levelStats;
  const currentPage = data?.data?.page || 1;
  const totalPages = data?.data?.totalPages || 1;
  const total = data?.data?.total || 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(1)}
          data-testid="button-page-1"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageClick(i)}
          data-testid={`button-page-${i}`}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(totalPages)}
          data-testid={`button-page-${totalPages}`}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-members">Members</h1>
          <p className="text-muted-foreground mt-1">Manage club members</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading members...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-members">Members</h1>
          <p className="text-muted-foreground mt-1">Manage club members</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Failed to load members. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-members">Members</h1>
        <p className="text-muted-foreground mt-1">Manage club members</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 1-4</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-low-level">{stats?.lowLevel || 0}</div>
            <p className="text-xs text-muted-foreground">Low level members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 5-9</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-medium-level">{stats?.mediumLevel || 0}</div>
            <p className="text-xs text-muted-foreground">Medium level members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 10+</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-high-level">{stats?.highLevel || 0}</div>
            <p className="text-xs text-muted-foreground">High level members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Member Removal</CardTitle>
          <CardDescription>Remove multiple members by level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Level (e.g., 5)"
              value={bulkLevel}
              onChange={(e) => setBulkLevel(e.target.value)}
              min="1"
              max="100"
              data-testid="input-bulk-level"
            />
            <Input
              type="number"
              placeholder="Count (e.g., 10)"
              value={bulkCount}
              onChange={(e) => setBulkCount(e.target.value)}
              min="1"
              max="100"
              data-testid="input-bulk-count"
            />
            <Button
              onClick={handleBulkRemove}
              variant="destructive"
              disabled={bulkRemoveMutation.isPending}
              data-testid="button-bulk-remove"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {bulkRemoveMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
          <CardDescription>
            <span data-testid="text-member-count">{total}</span> total members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-members"
            />
          </div>

          <div className="space-y-3">
            {members.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No members found</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.UID}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                  data-testid={`card-member-${member.UID}`}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{getInitials(member.NM)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold" data-testid={`text-member-name-${member.UID}`}>
                        {member.NM}
                      </h3>
                      <Badge
                        variant={member.LVL >= 10 ? "default" : "secondary"}
                        data-testid={`badge-level-${member.UID}`}
                      >
                        Level {member.LVL}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.UID, member.NM)}
                    disabled={removeMemberMutation.isPending}
                    data-testid={`button-remove-${member.UID}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  data-testid="button-previous-page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {renderPageNumbers()}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}