import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketForm from "@/components/tickets/ticket-form";
import TicketList from "@/components/tickets/ticket-list";
import { getStatusColor, getPriorityColor, formatStatus } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";

export default function Tickets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(
    new URLSearchParams(location.split('?')[1] || '').get('create') === 'true'
  );

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["/api/tickets"],
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: number; status: string }) => {
      await apiRequest("PATCH", `/api/tickets/${ticketId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Success",
        description: "Ticket status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (ticketId: number, currentStatus: string) => {
    const statusFlow = {
      "open": "in_progress",
      "in_progress": "resolved",
      "resolved": "open"
    };
    
    const newStatus = statusFlow[currentStatus as keyof typeof statusFlow] || "open";
    updateStatusMutation.mutate({ ticketId, status: newStatus });
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    navigate("/tickets");
    queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
  };

  if (!user) return null;

  if (showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketForm
              onSuccess={handleCreateSuccess}
              onCancel={() => {
                setShowCreateForm(false);
                navigate("/tickets");
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = user.role === "it" ? "All Support Tickets" : "My Tickets";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{pageTitle}</CardTitle>
            <div className="flex gap-2">
              {(user.role === "hr" || user.role === "employee") && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Raise New Ticket
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TicketList
              tickets={tickets}
              onStatusUpdate={handleStatusUpdate}
              userRole={user.role}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
