import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  insertTicketSchema, 
  insertProjectSchema, 
  insertTaskSchema, 
  insertLeaveSchema,
  insertAttendanceSchema,
  insertAnnouncementSchema,
  insertPayrollSchema,
  insertDocumentSchema,
  insertTrainingSchema,
  insertTrainingEnrollmentSchema,
  insertGoalSchema,
  insertTimeEntrySchema,
  insertExpenseSchema
} from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  session: Request['session'] & {
    userId?: number;
    user?: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Check for test credentials first for role-based testing
      const testCredentials = [
        { email: "hr@company.com", password: "password", role: "hr", name: "HR Manager" },
        { email: "it@company.com", password: "password", role: "it", name: "IT Support" },
        { email: "employee@company.com", password: "password", role: "employee", name: "Employee" }
      ];
      
      const testUser = testCredentials.find(u => u.email === email && u.password === password);
      
      if (testUser) {
        // For test users, create or get existing user
        let user = await storage.getUserByEmail(email);
        if (!user) {
          user = await storage.createUser({
            email: testUser.email,
            password: testUser.password,
            name: testUser.name,
            role: testUser.role as "hr" | "it" | "employee"
          });
        }
        
        // Store user session
        req.session.userId = user.id;
        req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };

        return res.json({ 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        });
      }
      
      // Check regular users
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user session
      req.session.userId = user.id;
      req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };

      res.json({ 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    });
  });

  // Authentication middleware
  const requireAuth = (req: AuthenticatedRequest, res: Response, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Ticket routes
  app.get("/api/tickets", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }
      
      let tickets;

      if (user.role === "it") {
        tickets = await storage.getTickets();
      } else {
        tickets = await storage.getTicketsByCreator(user.id);
      }

      // Get user details for created by and assigned to
      const ticketsWithUsers = await Promise.all(
        tickets.map(async (ticket) => {
          const createdBy = await storage.getUser(ticket.createdById);
          const assignedTo = ticket.assignedToId ? await storage.getUser(ticket.assignedToId) : null;
          
          return {
            ...ticket,
            createdBy: createdBy ? { id: createdBy.id, name: createdBy.name } : null,
            assignedTo: assignedTo ? { id: assignedTo.id, name: assignedTo.name } : null,
          };
        })
      );

      res.json(ticketsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post("/api/tickets", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }
      
      const ticketData = insertTicketSchema.parse({
        ...req.body,
        createdById: user.id,
        assignedToId: 2, // Default to IT user
      });

      const ticket = await storage.createTicket(ticketData);
      const createdBy = await storage.getUser(ticket.createdById);
      const assignedTo = ticket.assignedToId ? await storage.getUser(ticket.assignedToId) : null;

      res.status(201).json({
        ...ticket,
        createdBy: createdBy ? { id: createdBy.id, name: createdBy.name } : null,
        assignedTo: assignedTo ? { id: assignedTo.id, name: assignedTo.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create ticket" });
    }
  });

  app.patch("/api/tickets/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const ticket = await storage.updateTicketStatus(id, status);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const createdBy = await storage.getUser(ticket.createdById);
      const assignedTo = ticket.assignedToId ? await storage.getUser(ticket.assignedToId) : null;

      res.json({
        ...ticket,
        createdBy: createdBy ? { id: createdBy.id, name: createdBy.name } : null,
        assignedTo: assignedTo ? { id: assignedTo.id, name: assignedTo.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to update ticket status" });
    }
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      
      const projectsWithManager = await Promise.all(
        projects.map(async (project) => {
          const manager = await storage.getUser(project.managerId);
          return {
            ...project,
            manager: manager ? { id: manager.id, name: manager.name } : null,
          };
        })
      );

      res.json(projectsWithManager);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }
      
      const projectData = insertProjectSchema.parse({
        ...req.body,
        managerId: user.id,
      });

      const project = await storage.createProject(projectData);
      const manager = await storage.getUser(project.managerId);

      res.status(201).json({
        ...project,
        manager: manager ? { id: manager.id, name: manager.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const project = await storage.updateProject(id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const manager = await storage.getUser(project.managerId);

      res.json({
        ...project,
        manager: manager ? { id: manager.id, name: manager.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete project" });
    }
  });

  // Task routes
  app.get("/api/tasks", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }
      
      let tasks;

      if (req.query.my === "true") {
        tasks = await storage.getTasksByAssignee(user.id);
      } else {
        tasks = await storage.getTasks();
      }

      const tasksWithDetails = await Promise.all(
        tasks.map(async (task) => {
          const project = await storage.getProjects().then(projects => 
            projects.find(p => p.id === task.projectId)
          );
          const assignedTo = await storage.getUser(task.assignedToId);
          
          return {
            ...task,
            project: project ? { id: project.id, name: project.name } : null,
            assignedTo: assignedTo ? { id: assignedTo.id, name: assignedTo.name } : null,
          };
        })
      );

      res.json(tasksWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      
      const project = await storage.getProjects().then(projects => 
        projects.find(p => p.id === task.projectId)
      );
      const assignedTo = await storage.getUser(task.assignedToId);

      res.status(201).json({
        ...task,
        project: project ? { id: project.id, name: project.name } : null,
        assignedTo: assignedTo ? { id: assignedTo.id, name: assignedTo.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const task = await storage.updateTaskStatus(id, status);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const project = await storage.getProjects().then(projects => 
        projects.find(p => p.id === task.projectId)
      );
      const assignedTo = await storage.getUser(task.assignedToId);

      res.json({
        ...task,
        project: project ? { id: project.id, name: project.name } : null,
        assignedTo: assignedTo ? { id: assignedTo.id, name: assignedTo.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to update task status" });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete task" });
    }
  });

  // Users route for dropdowns
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values()).map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // AI Chatbot route
  app.post("/api/chat", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { message, userRole } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Simple AI-like responses based on common workplace queries
      const responses = {
        hr: {
          "leave": "To request leave: 1) Go to the Leaves section, 2) Click 'Request Leave', 3) Fill out the form with dates and reason, 4) Submit for approval. Your manager will review and approve/deny the request.",
          "payroll": "You can view your payroll details in the Payroll section. This includes your current salary, deductions, allowances, and pay history. Contact HR for payroll-related questions.",
          "policy": "Company policies can be found in the Employee Handbook. For specific policy questions, please reach out to the HR department directly.",
          "performance": "Performance reviews are conducted quarterly. You can view your performance metrics in the Performance section if you're an HR manager.",
          "default": "As an HR representative, I can help you with leave requests, payroll questions, company policies, and performance-related queries. What specific HR topic can I assist you with?"
        },
        it: {
          "ticket": "To raise an IT support ticket: 1) Go to Tickets section, 2) Click 'Create Ticket', 3) Describe your technical issue clearly, 4) Set priority level, 5) Submit. IT team will respond within 24 hours.",
          "password": "For password resets, please create a support ticket with 'Password Reset' in the title. Include your employee ID and the system you need access to.",
          "system": "For system access issues, create a ticket specifying which system/application you're trying to access and the error message you're receiving.",
          "default": "As IT support, I can help you with technical issues, system access, password resets, and software problems. Please describe your technical issue in detail."
        },
        employee: {
          "task": "You can view your assigned tasks in the 'My Tasks' section. Update task status as you progress: Pending → In Progress → Completed. Set due dates and track your workload efficiently.",
          "project": "Check the Projects section to see project details you're involved in. Contact your project manager for project-specific questions or timeline changes.",
          "attendance": "Track your attendance in the Attendance section. Clock in/out daily and view your attendance history. Contact HR if you notice any discrepancies.",
          "default": "I can help you with task management, attendance tracking, leave requests, and general workplace questions. What would you like assistance with?"
        }
      };

      const userResponses = responses[userRole as keyof typeof responses] || responses.employee;
      const lowercaseMessage = message.toLowerCase();
      
      let response = "";
      
      // Match keywords to appropriate responses
      for (const [keyword, keywordResponse] of Object.entries(userResponses)) {
        if (keyword !== "default" && lowercaseMessage.includes(keyword)) {
          response = keywordResponse;
          break;
        }
      }
      
      // If no keyword match, use default response
      if (!response) {
        response = userResponses.default;
      }
      
      // Add some contextual responses for common questions
      if (lowercaseMessage.includes("help") || lowercaseMessage.includes("how")) {
        if (lowercaseMessage.includes("create") || lowercaseMessage.includes("add")) {
          response = "To create new items: Navigate to the relevant section (Tickets, Projects, Tasks), click the 'Create' or 'Add' button, fill out the required information, and submit. Each section has specific forms designed for that purpose.";
        }
      }
      
      if (lowercaseMessage.includes("thank") || lowercaseMessage.includes("thanks")) {
        response = "You're welcome! I'm here to help with any workplace questions you have. Feel free to ask about HR policies, IT support, project management, or any other work-related topics.";
      }

      // Simulate a small delay for more realistic feel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.json({ response });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Leave Management Routes
  app.get("/api/leaves", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      let leaves;
      if (user.role === "hr") {
        leaves = await storage.getLeaves();
      } else {
        leaves = await storage.getLeavesByEmployee(user.id);
      }

      const leavesWithEmployee = await Promise.all(
        leaves.map(async (leave) => {
          const employee = await storage.getUser(leave.employeeId);
          const approver = leave.approvedBy ? await storage.getUser(leave.approvedBy) : null;
          return {
            ...leave,
            employee: employee ? { id: employee.id, name: employee.name } : null,
            approver: approver ? { id: approver.id, name: approver.name } : null,
          };
        })
      );

      res.json(leavesWithEmployee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaves" });
    }
  });

  app.post("/api/leaves", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const leaveData = insertLeaveSchema.parse({
        ...req.body,
        employeeId: user.id,
      });

      const leave = await storage.createLeave(leaveData);
      const employee = await storage.getUser(leave.employeeId);

      res.status(201).json({
        ...leave,
        employee: employee ? { id: employee.id, name: employee.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create leave request" });
    }
  });

  app.patch("/api/leaves/:id/status", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user || user.role !== "hr") {
        return res.status(403).json({ message: "Only HR can approve/reject leaves" });
      }

      const id = parseInt(req.params.id);
      const { status } = req.body;

      const leave = await storage.updateLeaveStatus(id, status, user.id);
      if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      const employee = await storage.getUser(leave.employeeId);
      const approver = await storage.getUser(user.id);

      res.json({
        ...leave,
        employee: employee ? { id: employee.id, name: employee.name } : null,
        approver: approver ? { id: approver.id, name: approver.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to update leave status" });
    }
  });

  // Attendance Management Routes
  app.get("/api/attendance", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      let attendance;
      if (user.role === "hr") {
        attendance = await storage.getAttendance();
      } else {
        attendance = await storage.getAttendanceByEmployee(user.id);
      }

      const attendanceWithEmployee = await Promise.all(
        attendance.map(async (record) => {
          const employee = await storage.getUser(record.employeeId);
          return {
            ...record,
            employee: employee ? { id: employee.id, name: employee.name } : null,
          };
        })
      );

      res.json(attendanceWithEmployee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const attendanceData = insertAttendanceSchema.parse({
        ...req.body,
        employeeId: user.id,
      });

      const attendance = await storage.createAttendance(attendanceData);
      const employee = await storage.getUser(attendance.employeeId);

      res.status(201).json({
        ...attendance,
        employee: employee ? { id: employee.id, name: employee.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create attendance record" });
    }
  });

  // Announcements Routes
  app.get("/api/announcements", requireAuth, async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      
      const announcementsWithCreator = await Promise.all(
        announcements.map(async (announcement) => {
          const creator = await storage.getUser(announcement.createdBy);
          return {
            ...announcement,
            createdBy: creator ? { id: creator.id, name: creator.name } : null,
          };
        })
      );

      res.json(announcementsWithCreator);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user || user.role !== "hr") {
        return res.status(403).json({ message: "Only HR can create announcements" });
      }

      const announcementData = insertAnnouncementSchema.parse({
        ...req.body,
        createdBy: user.id,
      });

      const announcement = await storage.createAnnouncement(announcementData);
      const creator = await storage.getUser(announcement.createdBy);

      res.status(201).json({
        ...announcement,
        createdBy: creator ? { id: creator.id, name: creator.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create announcement" });
    }
  });

  // Payroll Routes
  app.get("/api/payroll", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      let payroll;
      if (user.role === "hr") {
        payroll = await storage.getPayroll();
      } else {
        payroll = await storage.getPayrollByEmployee(user.id);
      }

      const payrollWithEmployee = await Promise.all(
        payroll.map(async (record) => {
          const employee = await storage.getUser(record.employeeId);
          return {
            ...record,
            employee: employee ? { id: employee.id, name: employee.name } : null,
          };
        })
      );

      res.json(payrollWithEmployee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll" });
    }
  });

  app.post("/api/payroll", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user || user.role !== "hr") {
        return res.status(403).json({ message: "Only HR can manage payroll" });
      }

      const payrollData = insertPayrollSchema.parse(req.body);
      const payroll = await storage.createPayroll(payrollData);
      const employee = await storage.getUser(payroll.employeeId);

      res.status(201).json({
        ...payroll,
        employee: employee ? { id: employee.id, name: employee.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create payroll record" });
    }
  });

  // Document Routes
  app.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      
      const documentsWithUploader = await Promise.all(
        documents.map(async (doc) => {
          const uploader = await storage.getUser(doc.uploadedById);
          return {
            ...doc,
            uploadedBy: uploader ? { id: uploader.id, name: uploader.name } : null,
          };
        })
      );

      res.json(documentsWithUploader);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const documentData = insertDocumentSchema.parse({
        ...req.body,
        uploadedById: user.id,
      });

      const document = await storage.createDocument(documentData);
      const uploader = await storage.getUser(document.uploadedById);

      res.status(201).json({
        ...document,
        uploadedBy: uploader ? { id: uploader.id, name: uploader.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create document" });
    }
  });

  // Training Routes
  app.get("/api/trainings", requireAuth, async (req, res) => {
    try {
      const trainings = await storage.getTrainings();
      
      const trainingsWithCreator = await Promise.all(
        trainings.map(async (training) => {
          const creator = await storage.getUser(training.createdById);
          return {
            ...training,
            createdBy: creator ? { id: creator.id, name: creator.name } : null,
          };
        })
      );

      res.json(trainingsWithCreator);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trainings" });
    }
  });

  app.post("/api/trainings", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user || user.role !== "hr") {
        return res.status(403).json({ message: "Only HR can create trainings" });
      }

      const trainingData = insertTrainingSchema.parse({
        ...req.body,
        createdById: user.id,
      });

      const training = await storage.createTraining(trainingData);
      const creator = await storage.getUser(training.createdById);

      res.status(201).json({
        ...training,
        createdBy: creator ? { id: creator.id, name: creator.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create training" });
    }
  });

  // Training Enrollment Routes
  app.get("/api/training-enrollments", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const enrollments = await storage.getTrainingEnrollments();
      
      const enrollmentsWithDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          const training = await storage.getTrainings().then(trainings => 
            trainings.find(t => t.id === enrollment.trainingId)
          );
          const employee = await storage.getUser(enrollment.employeeId);
          return {
            ...enrollment,
            training: training ? { id: training.id, title: training.title, category: training.category } : null,
            employee: employee ? { id: employee.id, name: employee.name } : null,
          };
        })
      );

      res.json(enrollmentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training enrollments" });
    }
  });

  app.post("/api/training-enrollments", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const enrollmentData = insertTrainingEnrollmentSchema.parse({
        ...req.body,
        employeeId: user.id,
      });

      const enrollment = await storage.createTrainingEnrollment(enrollmentData);
      const training = await storage.getTrainings().then(trainings => 
        trainings.find(t => t.id === enrollment.trainingId)
      );

      res.status(201).json({
        ...enrollment,
        training: training ? { id: training.id, title: training.title, category: training.category } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create training enrollment" });
    }
  });

  // Goal Routes
  app.get("/api/goals", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      let goals;
      if (user.role === "hr") {
        goals = await storage.getGoals();
      } else {
        goals = await storage.getGoalsByEmployee(user.id);
      }

      const goalsWithEmployee = await Promise.all(
        goals.map(async (goal) => {
          const employee = await storage.getUser(goal.employeeId);
          return {
            ...goal,
            employee: employee ? { id: employee.id, name: employee.name } : null,
          };
        })
      );

      res.json(goalsWithEmployee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const goalData = insertGoalSchema.parse({
        ...req.body,
        employeeId: user.id,
      });

      const goal = await storage.createGoal(goalData);
      const employee = await storage.getUser(goal.employeeId);

      res.status(201).json({
        ...goal,
        employee: employee ? { id: employee.id, name: employee.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:id/progress", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const goalId = parseInt(req.params.id);
      const { progress } = req.body;

      const goal = await storage.updateGoal(goalId, { progress });
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }

      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Failed to update goal progress" });
    }
  });

  // Time Entry Routes
  app.get("/api/time-entries", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      let timeEntries;
      if (user.role === "hr") {
        timeEntries = await storage.getTimeEntries();
      } else {
        timeEntries = await storage.getTimeEntriesByEmployee(user.id);
      }

      const timeEntriesWithDetails = await Promise.all(
        timeEntries.map(async (entry) => {
          const employee = await storage.getUser(entry.employeeId);
          const project = entry.projectId ? await storage.getProjects().then(projects => 
            projects.find(p => p.id === entry.projectId)
          ) : null;
          const task = entry.taskId ? await storage.getTasks().then(tasks => 
            tasks.find(t => t.id === entry.taskId)
          ) : null;
          
          return {
            ...entry,
            employee: employee ? { id: employee.id, name: employee.name } : null,
            project: project ? { id: project.id, name: project.name } : null,
            task: task ? { id: task.id, title: task.title } : null,
          };
        })
      );

      res.json(timeEntriesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time entries" });
    }
  });

  app.post("/api/time-entries", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const timeEntryData = insertTimeEntrySchema.parse({
        ...req.body,
        employeeId: user.id,
      });

      const timeEntry = await storage.createTimeEntry(timeEntryData);
      const employee = await storage.getUser(timeEntry.employeeId);

      res.status(201).json({
        ...timeEntry,
        employee: employee ? { id: employee.id, name: employee.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create time entry" });
    }
  });

  // Expense Routes
  app.get("/api/expenses", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      let expenses;
      if (user.role === "hr") {
        expenses = await storage.getExpenses();
      } else {
        expenses = await storage.getExpensesByEmployee(user.id);
      }

      const expensesWithEmployee = await Promise.all(
        expenses.map(async (expense) => {
          const employee = await storage.getUser(expense.employeeId);
          return {
            ...expense,
            employee: employee ? { id: employee.id, name: employee.name } : null,
          };
        })
      );

      res.json(expensesWithEmployee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const expenseData = insertExpenseSchema.parse({
        ...req.body,
        employeeId: user.id,
      });

      const expense = await storage.createExpense(expenseData);
      const employee = await storage.getUser(expense.employeeId);

      res.status(201).json({
        ...expense,
        employee: employee ? { id: employee.id, name: employee.name } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create expense" });
    }
  });

  app.patch("/api/expenses/:id/submit", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: "User not found in session" });
      }

      const expenseId = parseInt(req.params.id);
      const expense = await storage.updateExpense(expenseId, { status: "submitted" });
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      res.json(expense);
    } catch (error) {
      res.status(400).json({ message: "Failed to submit expense" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
