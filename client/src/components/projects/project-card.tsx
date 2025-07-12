import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStatusColor, formatStatus } from "@/lib/auth";
import { Edit, Trash2 } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  manager?: { id: number; name: string };
  startDate: string;
  endDate: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
          <Badge className={getStatusColor(project.status)}>
            {formatStatus(project.status)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{project.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Manager:</span>
            <span className="text-gray-900">{project.manager?.name || "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>
            <span className="text-gray-900">
              {new Date(project.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">End Date:</span>
            <span className="text-gray-900">
              {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(project)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
