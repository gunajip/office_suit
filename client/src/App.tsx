import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import Projects from "@/pages/projects";
import Tasks from "@/pages/tasks";
import Performance from "@/pages/performance";
import Profile from "@/pages/profile";
import Attendance from "@/pages/attendance";
import Leaves from "@/pages/leaves";
import Payroll from "@/pages/payroll";
import Announcements from "@/pages/announcements";
import Employees from "@/pages/employees";
import Settings from "@/pages/settings";
import Chatbot from "@/pages/chatbot";
import Documents from "@/pages/documents";
import Training from "@/pages/training";
import Goals from "@/pages/goals";
import TimeTracking from "@/pages/timetracking";
import Expenses from "@/pages/expenses";
import Layout from "@/components/layout/layout";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/attendance" component={Attendance} />
        <Route path="/leaves" component={Leaves} />
        <Route path="/payroll" component={Payroll} />
        <Route path="/announcements" component={Announcements} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/documents" component={Documents} />
        <Route path="/training" component={Training} />
        <Route path="/goals" component={Goals} />
        <Route path="/timetracking" component={TimeTracking} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/settings" component={Settings} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/projects" component={Projects} />
        <Route path="/tasks" component={Tasks} />
        {user.role === "hr" && <Route path="/performance" component={Performance} />}
        {user.role === "hr" && <Route path="/employees" component={Employees} />}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
