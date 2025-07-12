import {
  users,
  tickets,
  projects,
  tasks,
  leaves,
  attendance,
  announcements,
  payroll,
  documents,
  trainings,
  trainingEnrollments,
  goals,
  timeEntries,
  expenses,
  type User,
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type Leave,
  type InsertLeave,
  type Attendance,
  type InsertAttendance,
  type Announcement,
  type InsertAnnouncement,
  type Payroll,
  type InsertPayroll,
  type Document,
  type InsertDocument,
  type Training,
  type InsertTraining,
  type TrainingEnrollment,
  type InsertTrainingEnrollment,
  type Goal,
  type InsertGoal,
  type TimeEntry,
  type InsertTimeEntry,
  type Expense,
  type InsertExpense,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicketsByCreator(createdById: number): Promise<Ticket[]>;
  getTicketsByAssignee(assignedToId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: number, status: string): Promise<Ticket | undefined>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProjectsByManager(managerId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Task operations
  getTasks(): Promise<Task[]>;
  getTasksByProject(projectId: number): Promise<Task[]>;
  getTasksByAssignee(assignedToId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskStatus(id: number, status: string): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Leave operations
  getLeaves(): Promise<Leave[]>;
  getLeavesByEmployee(employeeId: number): Promise<Leave[]>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeaveStatus(id: number, status: string, approvedBy?: number): Promise<Leave | undefined>;
  
  // Attendance operations
  getAttendance(): Promise<Attendance[]>;
  getAttendanceByEmployee(employeeId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, updates: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  
  // Announcement operations
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Payroll operations
  getPayroll(): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: number): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, updates: Partial<InsertPayroll>): Promise<Payroll | undefined>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, updates: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Training operations
  getTrainings(): Promise<Training[]>;
  createTraining(training: InsertTraining): Promise<Training>;
  updateTraining(id: number, updates: Partial<InsertTraining>): Promise<Training | undefined>;
  deleteTraining(id: number): Promise<boolean>;
  
  // Training enrollment operations
  getTrainingEnrollments(): Promise<TrainingEnrollment[]>;
  createTrainingEnrollment(enrollment: InsertTrainingEnrollment): Promise<TrainingEnrollment>;
  updateTrainingEnrollment(id: number, updates: Partial<InsertTrainingEnrollment>): Promise<TrainingEnrollment | undefined>;
  
  // Goal operations
  getGoals(): Promise<Goal[]>;
  getGoalsByEmployee(employeeId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;
  
  // Time entry operations
  getTimeEntries(): Promise<TimeEntry[]>;
  getTimeEntriesByEmployee(employeeId: number): Promise<TimeEntry[]>;
  createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, updates: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined>;
  deleteTimeEntry(id: number): Promise<boolean>;
  
  // Expense operations
  getExpenses(): Promise<Expense[]>;
  getExpensesByEmployee(employeeId: number): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tickets: Map<number, Ticket>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  private leaves: Map<number, Leave>;
  private attendance: Map<number, Attendance>;
  private announcements: Map<number, Announcement>;
  private payrollRecords: Map<number, Payroll>;
  private documents: Map<number, Document>;
  private trainings: Map<number, Training>;
  private trainingEnrollments: Map<number, TrainingEnrollment>;
  private goals: Map<number, Goal>;
  private timeEntries: Map<number, TimeEntry>;
  private expenses: Map<number, Expense>;
  private currentUserId: number;
  private currentTicketId: number;
  private currentProjectId: number;
  private currentTaskId: number;
  private currentLeaveId: number;
  private currentAttendanceId: number;
  private currentAnnouncementId: number;
  private currentPayrollId: number;
  private currentDocumentId: number;
  private currentTrainingId: number;
  private currentTrainingEnrollmentId: number;
  private currentGoalId: number;
  private currentTimeEntryId: number;
  private currentExpenseId: number;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.leaves = new Map();
    this.attendance = new Map();
    this.announcements = new Map();
    this.payrollRecords = new Map();
    this.documents = new Map();
    this.trainings = new Map();
    this.trainingEnrollments = new Map();
    this.goals = new Map();
    this.timeEntries = new Map();
    this.expenses = new Map();
    this.currentUserId = 1;
    this.currentTicketId = 1;
    this.currentProjectId = 1;
    this.currentTaskId = 1;
    this.currentLeaveId = 1;
    this.currentAttendanceId = 1;
    this.currentAnnouncementId = 1;
    this.currentPayrollId = 1;
    this.currentDocumentId = 1;
    this.currentTrainingId = 1;
    this.currentTrainingEnrollmentId = 1;
    this.currentGoalId = 1;
    this.currentTimeEntryId = 1;
    this.currentExpenseId = 1;

    // Initialize with sample users
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const hrUser: User = {
      id: 1,
      email: "hr@company.com",
      password: "password",
      name: "Sarah Johnson",
      role: "hr",
      department: "Human Resources",
      position: "HR Manager",
      employeeId: "HR001",
      phone: "+1-555-0101",
      hireDate: new Date("2023-01-15"),
      salary: 75000,
      manager: null,
      profileImage: null,
      address: "123 Main St, City, State 12345",
      emergencyContact: "Jane Doe",
      emergencyPhone: "+1-555-0102",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const itUser: User = {
      id: 2,
      email: "it@company.com",
      password: "password",
      name: "Mike Chen",
      role: "it",
      department: "Information Technology",
      position: "IT Support Specialist",
      employeeId: "IT001",
      phone: "+1-555-0201",
      hireDate: new Date("2023-02-20"),
      salary: 65000,
      manager: 1,
      profileImage: null,
      address: "456 Tech Ave, City, State 12345",
      emergencyContact: "John Smith",
      emergencyPhone: "+1-555-0202",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const employeeUser: User = {
      id: 3,
      email: "employee@company.com",
      password: "password",
      name: "Alex Smith",
      role: "employee",
      department: "Operations",
      position: "Operations Associate",
      employeeId: "OP001",
      phone: "+1-555-0301",
      hireDate: new Date("2023-03-10"),
      salary: 50000,
      manager: 1,
      profileImage: null,
      address: "789 Work St, City, State 12345",
      emergencyContact: "Sarah Johnson",
      emergencyPhone: "+1-555-0302",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(1, hrUser);
    this.users.set(2, itUser);
    this.users.set(3, employeeUser);
    this.currentUserId = 4;

    // Create sample tickets
    const sampleTickets: Ticket[] = [
      {
        id: 1,
        title: "Computer not starting",
        description: "My computer won't turn on this morning",
        status: "open",
        priority: "high",
        createdById: 3,
        assignedToId: 2,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: 2,
        title: "Software installation request",
        description: "Need Photoshop installed on my workstation",
        status: "in_progress",
        priority: "medium",
        createdById: 1,
        assignedToId: 2,
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-14"),
      },
    ];

    sampleTickets.forEach(ticket => this.tickets.set(ticket.id, ticket));
    this.currentTicketId = 3;

    // Create sample projects
    const sampleProjects: Project[] = [
      {
        id: 1,
        name: "Website Redesign",
        description: "Complete redesign of company website",
        status: "active",
        managerId: 1,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-31"),
        createdAt: new Date("2024-01-01"),
      },
      {
        id: 2,
        name: "Office Relocation",
        description: "Moving to new office space",
        status: "planning",
        managerId: 2,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-04-30"),
        createdAt: new Date("2024-01-01"),
      },
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project));
    this.currentProjectId = 3;

    // Create sample tasks
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: "Design new logo",
        description: "Create modern logo for rebranding",
        projectId: 1,
        assignedToId: 3,
        status: "in_progress",
        dueDate: new Date("2024-02-15"),
        createdAt: new Date("2024-01-10"),
      },
      {
        id: 2,
        title: "Setup new servers",
        description: "Configure servers for new office",
        projectId: 2,
        assignedToId: 2,
        status: "pending",
        dueDate: new Date("2024-03-01"),
        createdAt: new Date("2024-01-10"),
      },
    ];

    sampleTasks.forEach(task => this.tasks.set(task.id, task));
    this.currentTaskId = 3;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      department: insertUser.department || null,
      position: insertUser.position || null,
      employeeId: insertUser.employeeId || null,
      phone: insertUser.phone || null,
      hireDate: insertUser.hireDate || null,
      salary: insertUser.salary || null,
      manager: insertUser.manager || null,
      profileImage: insertUser.profileImage || null,
      address: insertUser.address || null,
      emergencyContact: insertUser.emergencyContact || null,
      emergencyPhone: insertUser.emergencyPhone || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Ticket operations
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicketsByCreator(createdById: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.createdById === createdById);
  }

  async getTicketsByAssignee(assignedToId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.assignedToId === assignedToId);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.currentTicketId++;
    const ticket: Ticket = {
      ...insertTicket,
      id,
      status: insertTicket.status || "open",
      assignedToId: insertTicket.assignedToId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicketStatus(id: number, status: string): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (ticket) {
      const updatedTicket = { ...ticket, status: status as any, updatedAt: new Date() };
      this.tickets.set(id, updatedTicket);
      return updatedTicket;
    }
    return undefined;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByManager(managerId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.managerId === managerId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      status: insertProject.status || "planning",
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project) {
      const updatedProject = { ...project, ...updates };
      this.projects.set(id, updatedProject);
      return updatedProject;
    }
    return undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async getTasksByAssignee(assignedToId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assignedToId === assignedToId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      status: insertTask.status || "pending",
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTaskStatus(id: number, status: string): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (task) {
      const updatedTask = { ...task, status: status as any };
      this.tasks.set(id, updatedTask);
      return updatedTask;
    }
    return undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Leave operations
  async getLeaves(): Promise<Leave[]> {
    return Array.from(this.leaves.values());
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return Array.from(this.leaves.values()).filter(leave => leave.employeeId === employeeId);
  }

  async createLeave(insertLeave: InsertLeave): Promise<Leave> {
    const id = this.currentLeaveId++;
    const leave: Leave = {
      ...insertLeave,
      id,
      status: insertLeave.status || "pending",
      approvedBy: null,
      approvedAt: null,
      comments: null,
      attachments: null,
      createdAt: new Date(),
    };
    this.leaves.set(id, leave);
    return leave;
  }

  async updateLeaveStatus(id: number, status: string, approvedBy?: number): Promise<Leave | undefined> {
    const leave = this.leaves.get(id);
    if (leave) {
      const updatedLeave = { 
        ...leave, 
        status: status as any,
        approvedBy: approvedBy || null,
        approvedAt: status !== "pending" ? new Date() : null
      };
      this.leaves.set(id, updatedLeave);
      return updatedLeave;
    }
    return undefined;
  }

  // Attendance operations
  async getAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }

  async getAttendanceByEmployee(employeeId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(attendance => attendance.employeeId === employeeId);
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.currentAttendanceId++;
    const attendance: Attendance = {
      ...insertAttendance,
      id,
      workHours: null,
      overtime: 0,
      notes: null,
      createdAt: new Date(),
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, updates: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (attendance) {
      const updatedAttendance = { ...attendance, ...updates };
      this.attendance.set(id, updatedAttendance);
      return updatedAttendance;
    }
    return undefined;
  }

  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentAnnouncementId++;
    const announcement: Announcement = {
      ...insertAnnouncement,
      id,
      publishDate: insertAnnouncement.publishDate || new Date(),
      isActive: insertAnnouncement.isActive !== undefined ? insertAnnouncement.isActive : true,
      attachments: null,
      readBy: "[]",
      createdAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (announcement) {
      const updatedAnnouncement = { ...announcement, ...updates };
      this.announcements.set(id, updatedAnnouncement);
      return updatedAnnouncement;
    }
    return undefined;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Payroll operations
  async getPayroll(): Promise<Payroll[]> {
    return Array.from(this.payrollRecords.values());
  }

  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return Array.from(this.payrollRecords.values()).filter(payroll => payroll.employeeId === employeeId);
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const id = this.currentPayrollId++;
    const payroll: Payroll = {
      ...insertPayroll,
      id,
      allowances: insertPayroll.allowances || 0,
      deductions: insertPayroll.deductions || 0,
      overtime: insertPayroll.overtime || 0,
      bonus: insertPayroll.bonus || 0,
      payDate: null,
      status: insertPayroll.status || "draft",
      createdAt: new Date(),
    };
    this.payrollRecords.set(id, payroll);
    return payroll;
  }

  async updatePayroll(id: number, updates: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const payroll = this.payrollRecords.get(id);
    if (payroll) {
      const updatedPayroll = { ...payroll, ...updates };
      this.payrollRecords.set(id, updatedPayroll);
      return updatedPayroll;
    }
    return undefined;
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = {
      ...insertDocument,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updates: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (document) {
      const updatedDocument = { ...document, ...updates, updatedAt: new Date() };
      this.documents.set(id, updatedDocument);
      return updatedDocument;
    }
    return undefined;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Training operations
  async getTrainings(): Promise<Training[]> {
    return Array.from(this.trainings.values());
  }

  async createTraining(insertTraining: InsertTraining): Promise<Training> {
    const id = this.currentTrainingId++;
    const training: Training = {
      ...insertTraining,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.trainings.set(id, training);
    return training;
  }

  async updateTraining(id: number, updates: Partial<InsertTraining>): Promise<Training | undefined> {
    const training = this.trainings.get(id);
    if (training) {
      const updatedTraining = { ...training, ...updates, updatedAt: new Date() };
      this.trainings.set(id, updatedTraining);
      return updatedTraining;
    }
    return undefined;
  }

  async deleteTraining(id: number): Promise<boolean> {
    return this.trainings.delete(id);
  }

  // Training enrollment operations
  async getTrainingEnrollments(): Promise<TrainingEnrollment[]> {
    return Array.from(this.trainingEnrollments.values());
  }

  async createTrainingEnrollment(insertEnrollment: InsertTrainingEnrollment): Promise<TrainingEnrollment> {
    const id = this.currentTrainingEnrollmentId++;
    const enrollment: TrainingEnrollment = {
      ...insertEnrollment,
      id,
      enrolledAt: new Date(),
      completedAt: null,
      score: null,
      certificateIssued: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.trainingEnrollments.set(id, enrollment);
    return enrollment;
  }

  async updateTrainingEnrollment(id: number, updates: Partial<InsertTrainingEnrollment>): Promise<TrainingEnrollment | undefined> {
    const enrollment = this.trainingEnrollments.get(id);
    if (enrollment) {
      const updatedEnrollment = { ...enrollment, ...updates, updatedAt: new Date() };
      this.trainingEnrollments.set(id, updatedEnrollment);
      return updatedEnrollment;
    }
    return undefined;
  }

  // Goal operations
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoalsByEmployee(employeeId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.employeeId === employeeId);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      ...insertGoal,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (goal) {
      const updatedGoal = { ...goal, ...updates, updatedAt: new Date() };
      this.goals.set(id, updatedGoal);
      return updatedGoal;
    }
    return undefined;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Time entry operations
  async getTimeEntries(): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values());
  }

  async getTimeEntriesByEmployee(employeeId: number): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => entry.employeeId === employeeId);
  }

  async createTimeEntry(insertTimeEntry: InsertTimeEntry): Promise<TimeEntry> {
    const id = this.currentTimeEntryId++;
    const timeEntry: TimeEntry = {
      ...insertTimeEntry,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.timeEntries.set(id, timeEntry);
    return timeEntry;
  }

  async updateTimeEntry(id: number, updates: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined> {
    const timeEntry = this.timeEntries.get(id);
    if (timeEntry) {
      const updatedTimeEntry = { ...timeEntry, ...updates, updatedAt: new Date() };
      this.timeEntries.set(id, updatedTimeEntry);
      return updatedTimeEntry;
    }
    return undefined;
  }

  async deleteTimeEntry(id: number): Promise<boolean> {
    return this.timeEntries.delete(id);
  }

  // Expense operations
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpensesByEmployee(employeeId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => expense.employeeId === employeeId);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (expense) {
      const updatedExpense = { ...expense, ...updates, updatedAt: new Date() };
      this.expenses.set(id, updatedExpense);
      return updatedExpense;
    }
    return undefined;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }
}

export const storage = new MemStorage();
