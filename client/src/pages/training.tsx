import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Plus, Calendar, Clock, Users, MapPin, Monitor, Award, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTrainingSchema, insertTrainingEnrollmentSchema, type InsertTraining } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatStatus } from "@/lib/auth";

export default function Training() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("available");

  const form = useForm<InsertTraining>({
    resolver: zodResolver(insertTrainingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "skill",
      duration: 1,
      instructor: "",
      maxParticipants: 20,
      status: "scheduled",
      startDate: new Date(),
      location: "",
      isOnline: false,
      createdById: user?.id || 0,
    },
  });

  const { data: trainings = [], isLoading } = useQuery({
    queryKey: ["/api/trainings"],
    enabled: !!user,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/training-enrollments"],
    enabled: !!user,
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: InsertTraining) => {
      const response = await apiRequest({
        url: "/api/trainings",
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Training program created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create training program",
        variant: "destructive",
      });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (trainingId: number) => {
      const response = await apiRequest({
        url: "/api/training-enrollments",
        method: "POST",
        body: {
          trainingId,
          employeeId: user?.id,
          status: "enrolled",
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-enrollments"] });
      toast({
        title: "Success",
        description: "Successfully enrolled in training",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in training",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTraining) => {
    createTrainingMutation.mutate(data);
  };

  const handleEnroll = (trainingId: number) => {
    enrollMutation.mutate(trainingId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mandatory": return "bg-red-100 text-red-800";
      case "professional": return "bg-blue-100 text-blue-800";
      case "skill": return "bg-green-100 text-green-800";
      case "compliance": return "bg-yellow-100 text-yellow-800";
      case "safety": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const availableTrainings = trainings.filter((training: any) => 
    training.status === "scheduled" || training.status === "ongoing"
  );

  const myEnrollments = enrollments.filter((enrollment: any) => 
    enrollment.employeeId === user?.id
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
            <p className="text-gray-600 mt-1">Enhance your skills with professional training programs</p>
          </div>
          
          {user.role === "hr" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Training
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Training Program</DialogTitle>
                  <DialogDescription>
                    Set up a new training program for employees
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Training Title</Label>
                      <Input
                        id="title"
                        {...form.register("title")}
                        placeholder="Enter training title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => form.setValue("category", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mandatory">Mandatory</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="skill">Skill Development</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      placeholder="Training description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        {...form.register("duration", { valueAsNumber: true })}
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        {...form.register("instructor")}
                        placeholder="Instructor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        {...form.register("maxParticipants", { valueAsNumber: true })}
                        placeholder="20"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        {...form.register("startDate", { valueAsDate: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        {...form.register("location")}
                        placeholder="Conference Room A or Online"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isOnline"
                      {...form.register("isOnline")}
                    />
                    <Label htmlFor="isOnline">Online Training</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTrainingMutation.isPending}>
                      {createTrainingMutation.isPending ? "Creating..." : "Create Training"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={selectedTab === "available" ? "default" : "outline"}
            onClick={() => setSelectedTab("available")}
          >
            Available Trainings
          </Button>
          <Button
            variant={selectedTab === "enrolled" ? "default" : "outline"}
            onClick={() => setSelectedTab("enrolled")}
          >
            My Enrollments
          </Button>
        </div>

        {/* Content */}
        {selectedTab === "available" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTrainings.map((training: any) => (
              <Card key={training.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{training.title}</CardTitle>
                    <Badge className={getCategoryColor(training.category)}>
                      {formatStatus(training.category)}
                    </Badge>
                  </div>
                  <CardDescription>{training.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {training.duration} hours
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(training.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {training.isOnline ? (
                        <>
                          <Monitor className="h-4 w-4" />
                          Online
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          {training.location}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {training.maxParticipants} max participants
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      {training.instructor}
                    </div>
                    <div className="pt-2">
                      <Badge className={getStatusColor(training.status)}>
                        {formatStatus(training.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleEnroll(training.id)}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My Training Enrollments</CardTitle>
              <CardDescription>
                Track your training progress and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myEnrollments.map((enrollment: any) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enrollment.training?.title}</div>
                          <div className="text-sm text-gray-500">{enrollment.training?.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(enrollment.status)}>
                          {formatStatus(enrollment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {enrollment.status === "completed" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {enrollment.status === "completed" ? "100%" : "In Progress"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {enrollment.score ? `${enrollment.score}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {enrollment.certificateIssued ? (
                          <Badge className="bg-green-100 text-green-800">
                            Issued
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Not Issued
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}