import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, MapPin, Calendar, DollarSign, Building, UserCheck } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal information and employment details
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Personal Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user.name} readOnly />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} readOnly />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value="+1-555-0123" readOnly />
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" value={`${user.role.toUpperCase()}001`} readOnly />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value="123 Main Street, City, State 12345" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input id="emergency" value="Jane Doe" readOnly />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input id="emergencyPhone" value="+1-555-0124" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Employee Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <Badge variant="secondary">{user.role.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Department</span>
                <span className="text-sm">{user.role === 'hr' ? 'Human Resources' : user.role === 'it' ? 'IT' : 'Operations'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employment Details
              </CardTitle>
              <CardDescription>
                Your role and employment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" value={user.role === 'hr' ? 'HR Manager' : user.role === 'it' ? 'IT Support' : 'Operations Associate'} readOnly />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={user.role === 'hr' ? 'Human Resources' : user.role === 'it' ? 'Information Technology' : 'Operations'} readOnly />
                </div>
                <div>
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input id="hireDate" value="January 15, 2023" readOnly />
                </div>
                <div>
                  <Label htmlFor="manager">Manager</Label>
                  <Input id="manager" value={user.role === 'hr' ? 'N/A' : 'Sarah Johnson'} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Update Contact Info
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Change Address
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Update Emergency Contact
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}