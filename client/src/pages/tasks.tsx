import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "@/components/tasks/task-form";
import TaskList from "@/components/tasks/task-list";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";

export default function Tasks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const isMyTasks = location.includes("my=true") || user?.role === "employee";
  const queryString = isMyTasks ? "?my=true" : "";

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks", queryString],
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
      await apiRequest("PATCH", `/api/tasks/${taskId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (taskId: number, currentStatus: string) => {
    const statusFlow = {
      "pending": "in_progress",
      "in_progress": "completed",
      "completed": "pending"
    };
    
    const newStatus = statusFlow[currentStatus as keyof typeof statusFlow] || "pending";
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleDelete = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(taskId);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  if (!user) return null;

  const pageTitle = isMyTasks ? "My Tasks" : "Task Management";
  const canCreateTasks = user.role === "hr" || user.role === "it";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{pageTitle}</CardTitle>
            {canCreateTasks && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Assign New Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              userRole={user.role}
              isMyTasks={isMyTasks}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
