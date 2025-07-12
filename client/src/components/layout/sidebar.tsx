import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  LayoutDashboard, 
  Ticket, 
  FolderKanban, 
  CheckSquare, 
  BarChart3, 
  LogOut, 
  User,
  Plus,
  DollarSign,
  Clock,
  Calendar,
  Megaphone,
  Settings,
  Users,
  FileText,
  UserCheck,
  Bot,
  BookOpen,
  Target,
  TrendingUp,
  CreditCard,
  Timer,
  UserPlus,
  PieChart,
  Award,
  Globe
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const navigation = [
    {
      name: "My Desk",
      href: "/",
      icon: LayoutDashboard,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: Clock,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Leaves",
      href: "/leaves",
      icon: Calendar,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Payroll",
      href: "/payroll",
      icon: DollarSign,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Announcements",
      href: "/announcements",
      icon: Megaphone,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "All Employees",
      href: "/employees",
      icon: Users,
      roles: ["hr"]
    },
    {
      name: "Performance",
      href: "/performance",
      icon: BarChart3,
      roles: ["hr"]
    },
    {
      name: "All Tickets",
      href: "/tickets",
      icon: Ticket,
      roles: ["it"]
    },
    {
      name: "My Tickets",
      href: "/tickets",
      icon: Ticket,
      roles: ["hr", "employee"]
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderKanban,
      roles: ["hr", "it"]
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      roles: ["hr", "it"]
    },
    {
      name: "My Tasks",
      href: "/tasks?my=true",
      icon: CheckSquare,
      roles: ["employee"]
    },
    {
      name: "AI Chatbot",
      href: "/chatbot",
      icon: Bot,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Training",
      href: "/training",
      icon: BookOpen,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Goals",
      href: "/goals",
      icon: Target,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Time Tracking",
      href: "/timetracking",
      icon: Timer,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: CreditCard,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Reviews",
      href: "/reviews",
      icon: Award,
      roles: ["hr", "it", "employee"]
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: TrendingUp,
      roles: ["hr"]
    },
    {
      name: "Onboarding",
      href: "/onboarding",
      icon: UserPlus,
      roles: ["hr"]
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["hr", "it", "employee"]
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <Building className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Office Hub</span>
        </div>
      </div>
      
      <nav className="mt-5 px-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href === "/" && location === "/") ||
            (item.href !== "/" && location.startsWith(item.href.split("?")[0]));
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}
        
        {user.role === "employee" && (
          <Link href="/tickets?create=true">
            <Button variant="ghost" className="w-full justify-start mb-1">
              <Plus className="h-4 w-4 mr-3" />
              Raise Ticket
            </Button>
          </Link>
        )}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role.toUpperCase()}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
