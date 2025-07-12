import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { testCredentials } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      toast({
        title: "Success",
        description: "Login successful!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    }
  };

  const handleQuickLogin = async (role: keyof typeof testCredentials) => {
    setSelectedRole(role);
    const credentials = testCredentials[role];
    form.setValue("email", credentials.email);
    form.setValue("password", credentials.password);
    
    try {
      await login(credentials);
      toast({
        title: "Success",
        description: "Login successful!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="max-w-md w-full space-y-8 p-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Office Management
            </CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-2"
                  placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="mt-2"
                  placeholder="Enter your password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500 text-center mb-3">
                Quick Login for Testing:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin("hr")}
                  disabled={isLoggingIn}
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {selectedRole === "hr" && isLoggingIn ? "..." : "HR Login"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin("it")}
                  disabled={isLoggingIn}
                  className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  {selectedRole === "it" && isLoggingIn ? "..." : "IT Support"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin("employee")}
                  disabled={isLoggingIn}
                  className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  {selectedRole === "employee" && isLoggingIn ? "..." : "Employee"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
