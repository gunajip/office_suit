import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, getPriorityColor, formatStatus } from "@/lib/auth";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdBy?: { id: number; name: string };
  assignedTo?: { id: number; name: string };
  createdAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onStatusUpdate: (ticketId: number, status: string) => void;
  userRole: string;
}

export default function TicketList({ tickets, onStatusUpdate, userRole }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tickets found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {userRole === "it" ? "Created By" : "Assigned To"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                <div className="text-sm text-gray-500">#{ticket.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(ticket.status)}>
                  {formatStatus(ticket.status)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {userRole === "it" 
                  ? ticket.createdBy?.name || "Unknown"
                  : ticket.assignedTo?.name || "Unassigned"
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {userRole === "it" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate(ticket.id, ticket.status)}
                  >
                    Update Status
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
