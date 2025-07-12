import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin, Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";

export default function Attendance() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const attendanceData = [
    { date: "2024-01-15", status: "present", clockIn: "09:00", clockOut: "17:30", hours: "8.5", location: "Office" },
    { date: "2024-01-14", status: "present", clockIn: "09:15", clockOut: "17:45", hours: "8.5", location: "Remote" },
    { date: "2024-01-13", status: "late", clockIn: "09:30", clockOut: "17:30", hours: "8.0", location: "Office" },
    { date: "2024-01-12", status: "present", clockIn: "08:45", clockOut: "17:30", hours: "8.75", location: "Office" },
    { date: "2024-01-11", status: "absent", clockIn: "-", clockOut: "-", hours: "0", location: "-" },
  ];

  const handleClockIn = () => {
    setIsCheckedIn(true);
  };

  const handleClockOut = () => {
    setIsCheckedIn(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-green-500">Present</Badge>;
      case "late":
        return <Badge variant="secondary" className="bg-yellow-500">Late</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track your daily attendance and work hours
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Clock In/Out */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Attendance
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCheckedIn ? (
                <Button onClick={handleClockIn} className="w-full" size="lg">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Clock In
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Clocked in at</p>
                    <p className="text-2xl font-bold">9:00 AM</p>
                  </div>
                  <Button onClick={handleClockOut} variant="outline" className="w-full" size="lg">
                    <XCircle className="mr-2 h-4 w-4" />
                    Clock Out
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium">Location</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Office
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Attendance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>January 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Days</span>
                <span className="text-sm">22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Present</span>
                <span className="text-sm text-green-600 font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Late</span>
                <span className="text-sm text-yellow-600 font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Absent</span>
                <span className="text-sm text-red-600 font-semibold">2</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Total Hours</span>
                <span className="text-sm font-semibold">144.5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>
              Your attendance history for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Clock In</p>
                      <p className="font-medium">{record.clockIn}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Clock Out</p>
                      <p className="font-medium">{record.clockOut}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-medium">{record.hours}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Location</p>
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {record.location}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}