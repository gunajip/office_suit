export const testCredentials = {
  hr: {
    email: "hr@company.com",
    password: "password",
  },
  it: {
    email: "it@company.com",
    password: "password",
  },
  employee: {
    email: "employee@company.com",
    password: "password",
  },
};

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-red-100 text-red-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-gray-100 text-gray-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "active":
      return "bg-blue-100 text-blue-800";
    case "planning":
      return "bg-yellow-100 text-yellow-800";
    case "on_hold":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function formatStatus(status: string): string {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
