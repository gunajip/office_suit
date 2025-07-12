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
import { Timer, Play, Pause, Square, Plus, Clock, Calendar, CheckCircle, XCircle, Filter } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTimeEntrySchema, type InsertTimeEntry } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TimeTracking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const form = useForm<InsertTimeEntry>({
    resolver: zodResolver(insertTimeEntrySchema),
    defaultValues: {
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      billable: false,
      approved: false,
      date: new Date(),
      employeeId: user?.id || 0,
    },
  });

  const { data: timeEntries = [], isLoading } = useQuery({
    queryKey: ["/api/time-entries"],
    enabled: !!user,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });

  const createTimeEntryMutation = useMutation({
    mutationFn: async (data: InsertTimeEntry) => {
      const response = await apiRequest({
        url: "/api/time-entries",
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Time entry logged successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log time entry",
        variant: "destructive",
      });
    },
  });

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStartTime(new Date());
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (timerStartTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - timerStartTime.getTime()) / 1000 / 60); // in minutes
      
      createTimeEntryMutation.mutate({
        description: currentTask,
        startTime: timerStartTime,
        endTime: endTime,
        duration: duration,
        billable: false,
        approved: false,
        date: new Date(),
        employeeId: user?.id || 0,
      });
    }
    
    setIsTimerRunning(false);
    setTimerStartTime(null);
    setCurrentTask("");
    setElapsedTime(0);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const onSubmit = (data: InsertTimeEntry) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
    
    createTimeEntryMutation.mutate({
      ...data,
      duration,
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalHoursToday = timeEntries
    .filter((entry: any) => new Date(entry.date).toDateString() === new Date().toDateString())
    .reduce((total: number, entry: any) => total + (entry.duration || 0), 0);

  const totalHoursWeek = timeEntries
    .filter((entry: any) => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return entryDate >= weekStart;
    })
    .reduce((total: number, entry: any) => total + (entry.duration || 0), 0);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
            <p className="text-gray-600 mt-1">Track your work hours and project time</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
                <DialogDescription>
                  Manually log your work hours
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="What did you work on?"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectId">Project (Optional)</Label>
                    <Select onValueChange={(value) => form.setValue("projectId", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project: any) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taskId">Task (Optional)</Label>
                    <Select onValueChange={(value) => form.setValue("taskId", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map((task: any) => (
                          <SelectItem key={task.id} value={task.id.toString()}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      {...form.register("startTime", { valueAsDate: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      {...form.register("endTime", { valueAsDate: true })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="billable"
                    {...form.register("billable")}
                  />
                  <Label htmlFor="billable">Billable Time</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTimeEntryMutation.isPending}>
                    {createTimeEntryMutation.isPending ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Timer Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Timer</CardTitle>
            <CardDescription>
              Track your current work session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="What are you working on?"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  disabled={isTimerRunning}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-mono">
                  {formatTime(elapsedTime)}
                </div>
                {!isTimerRunning && !timerStartTime && (
                  <Button
                    onClick={startTimer}
                    disabled={!currentTask}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                )}
                {isTimerRunning && (
                  <Button
                    onClick={pauseTimer}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                )}
                {!isTimerRunning && timerStartTime && (
                  <Button
                    onClick={resumeTimer}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Resume
                  </Button>
                )}
                {timerStartTime && (
                  <Button
                    onClick={stopTimer}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(totalHoursToday)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(totalHoursWeek)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeEntries.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Time Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>
              Your logged work hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      {entry.project?.name || "No Project"}
                    </TableCell>
                    <TableCell>{formatTime(entry.duration || 0)}</TableCell>
                    <TableCell>
                      {entry.billable ? (
                        <Badge className="bg-green-100 text-green-800">
                          Billable
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Non-billable
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.approved ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}