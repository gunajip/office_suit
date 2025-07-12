import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, formatStatus } from "@/lib/auth";
import { Edit, Trash2 } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  project?: { id: number; name: string };
  assignedTo?: { id: number; name: string };
  dueDate: string;
}

interface TaskListProps {
  tasks: Task[];
  onStatusUpdate: (taskId: number, status: string) => void;
  onDelete: (taskId: number) => void;
  userRole: string;
  isMyTasks: boolean;
}

export default function TaskList({ tasks, onStatusUpdate, onDelete, userRole, isMyTasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found.</p>
      </div>
    );
  }

  const canManageTasks = userRole === "hr" || userRole === "it";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            {!isMyTasks && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
                <div className="text-sm text-gray-500">{task.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.project?.name || "N/A"}
              </td>
              {!isMyTasks && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.assignedTo?.name || "Unassigned"}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(task.status)}>
                  {formatStatus(task.status)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusUpdate(task.id, task.status)}
                >
                  Update Status
                </Button>
                {canManageTasks && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
