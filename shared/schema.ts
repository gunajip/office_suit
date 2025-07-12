import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["hr", "it", "employee"] }).notNull(),
  department: text("department"),
  position: text("position"),
  employeeId: varchar("employee_id", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  hireDate: timestamp("hire_date"),
  salary: integer("salary"),
  manager: integer("manager_id"),
  profileImage: text("profile_image"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["open", "in_progress", "resolved"] }).notNull().default("open"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull(),
  createdById: integer("created_by_id").notNull(),
  assignedToId: integer("assigned_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["planning", "active", "completed", "on_hold"] }).notNull().default("planning"),
  managerId: integer("manager_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  projectId: integer("project_id").notNull(),
  assignedToId: integer("assigned_to_id").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed"] }).notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payroll Management
export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  payPeriod: varchar("pay_period", { length: 50 }).notNull(), // e.g., "2024-01", "Q1-2024"
  basicSalary: integer("basic_salary").notNull(),
  allowances: integer("allowances").default(0),
  deductions: integer("deductions").default(0),
  overtime: integer("overtime").default(0),
  bonus: integer("bonus").default(0),
  netPay: integer("net_pay").notNull(),
  payDate: timestamp("pay_date"),
  status: text("status", { enum: ["draft", "processed", "paid"] }).notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance Management
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  date: timestamp("date").notNull(),
  clockIn: timestamp("clock_in"),
  clockOut: timestamp("clock_out"),
  workHours: integer("work_hours"), // in minutes
  overtime: integer("overtime").default(0), // in minutes
  status: text("status", { enum: ["present", "absent", "late", "half_day"] }).notNull(),
  location: text("location"), // Office, Remote, Field
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave Management
export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  type: text("type", { enum: ["annual", "sick", "maternity", "paternity", "personal", "emergency"] }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  comments: text("comments"),
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: timestamp("created_at").defaultNow(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type", { enum: ["general", "urgent", "policy", "event", "holiday"] }).notNull(),
  targetAudience: text("target_audience", { enum: ["all", "hr", "it", "employees", "managers"] }).notNull().default("all"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull().default("medium"),
  publishDate: timestamp("publish_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").notNull(),
  attachments: text("attachments"), // JSON array of file URLs
  readBy: text("read_by").default("[]"), // JSON array of user IDs who read this
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee Settings/Preferences
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  theme: text("theme", { enum: ["light", "dark", "system"] }).notNull().default("system"),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  notifications: text("notifications").default("[]"), // JSON array of notification preferences
  workingHours: text("working_hours").default('{"start":"09:00","end":"17:00"}'), // JSON object
  weeklyWorkDays: text("weekly_work_days").default('["monday","tuesday","wednesday","thursday","friday"]'), // JSON array
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document Management System
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  category: text("category", { enum: ["policy", "handbook", "form", "training", "contract", "other"] }).notNull(),
  uploadedById: integer("uploaded_by_id").notNull(),
  accessLevel: text("access_level", { enum: ["public", "hr_only", "managers", "specific_users"] }).notNull().default("public"),
  tags: text("tags").array(),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training & Certification Tracking
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", { enum: ["mandatory", "professional", "skill", "compliance", "safety"] }).notNull(),
  duration: integer("duration_hours").notNull(),
  instructor: text("instructor"),
  maxParticipants: integer("max_participants"),
  status: text("status", { enum: ["scheduled", "ongoing", "completed", "cancelled"] }).notNull().default("scheduled"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  isOnline: boolean("is_online").default(false),
  createdById: integer("created_by_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingEnrollments = pgTable("training_enrollments", {
  id: serial("id").primaryKey(),
  trainingId: integer("training_id").notNull(),
  employeeId: integer("employee_id").notNull(),
  status: text("status", { enum: ["enrolled", "completed", "cancelled", "no_show"] }).notNull().default("enrolled"),
  completionDate: timestamp("completion_date"),
  score: integer("score"), // 0-100
  certificateIssued: boolean("certificate_issued").default(false),
  notes: text("notes"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Performance Reviews & Goal Setting
export const performanceReviews = pgTable("performance_reviews", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  reviewPeriod: varchar("review_period", { length: 50 }).notNull(), // e.g., "Q1-2024", "Annual-2024"
  overallRating: integer("overall_rating"), // 1-5
  goals: text("goals"),
  achievements: text("achievements"),
  areasForImprovement: text("areas_for_improvement"),
  managerComments: text("manager_comments"),
  employeeComments: text("employee_comments"),
  status: text("status", { enum: ["draft", "pending_employee", "pending_manager", "completed"] }).notNull().default("draft"),
  reviewDate: timestamp("review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", { enum: ["performance", "skill", "career", "project"] }).notNull(),
  status: text("status", { enum: ["not_started", "in_progress", "completed", "cancelled"] }).notNull().default("not_started"),
  priority: text("priority", { enum: ["low", "medium", "high", "critical"] }).notNull(),
  startDate: timestamp("start_date").notNull(),
  targetDate: timestamp("target_date").notNull(),
  completionDate: timestamp("completion_date"),
  progress: integer("progress").default(0), // 0-100
  managerId: integer("manager_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Time Tracking & Analytics
export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  projectId: integer("project_id"),
  taskId: integer("task_id"),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration_minutes"), // calculated field
  billable: boolean("billable").default(false),
  approved: boolean("approved").default(false),
  approvedById: integer("approved_by_id"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Expense Management
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", { enum: ["travel", "meals", "office", "training", "equipment", "other"] }).notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").default("USD"),
  receiptUrl: text("receipt_url"),
  expenseDate: timestamp("expense_date").notNull(),
  status: text("status", { enum: ["draft", "submitted", "approved", "rejected", "reimbursed"] }).notNull().default("draft"),
  approvedById: integer("approved_by_id"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  reimbursedAt: timestamp("reimbursed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee Onboarding Workflow
export const onboardingTasks = pgTable("onboarding_tasks", {
  id: serial("id").primaryKey(),
  newEmployeeId: integer("new_employee_id").notNull(),
  taskTitle: text("task_title").notNull(),
  taskDescription: text("task_description"),
  category: text("category", { enum: ["hr", "it", "department", "manager", "self"] }).notNull(),
  assignedToId: integer("assigned_to_id"),
  dueDate: timestamp("due_date"),
  status: text("status", { enum: ["pending", "in_progress", "completed", "skipped"] }).notNull().default("pending"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdTickets: many(tickets, { relationName: "createdBy" }),
  assignedTickets: many(tickets, { relationName: "assignedTo" }),
  managedProjects: many(projects),
  assignedTasks: many(tasks),
  payrollRecords: many(payroll),
  attendanceRecords: many(attendance),
  leaveRequests: many(leaves),
  createdAnnouncements: many(announcements),
  settings: many(userSettings),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  createdBy: one(users, {
    fields: [tickets.createdById],
    references: [users.id],
    relationName: "createdBy",
  }),
  assignedTo: one(users, {
    fields: [tickets.assignedToId],
    references: [users.id],
    relationName: "assignedTo",
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  manager: one(users, {
    fields: [projects.managerId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
  }),
}));

export const payrollRelations = relations(payroll, ({ one }) => ({
  employee: one(users, {
    fields: [payroll.employeeId],
    references: [users.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(users, {
    fields: [attendance.employeeId],
    references: [users.id],
  }),
}));

export const leavesRelations = relations(leaves, ({ one }) => ({
  employee: one(users, {
    fields: [leaves.employeeId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [leaves.approvedBy],
    references: [users.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  creator: one(users, {
    fields: [announcements.createdBy],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

// New Relations for Advanced Features
export const documentsRelations = relations(documents, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [documents.uploadedById],
    references: [users.id],
  }),
}));

export const trainingsRelations = relations(trainings, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [trainings.createdById],
    references: [users.id],
  }),
  enrollments: many(trainingEnrollments),
}));

export const trainingEnrollmentsRelations = relations(trainingEnrollments, ({ one }) => ({
  training: one(trainings, {
    fields: [trainingEnrollments.trainingId],
    references: [trainings.id],
  }),
  employee: one(users, {
    fields: [trainingEnrollments.employeeId],
    references: [users.id],
  }),
}));

export const performanceReviewsRelations = relations(performanceReviews, ({ one }) => ({
  employee: one(users, {
    fields: [performanceReviews.employeeId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [performanceReviews.reviewerId],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  employee: one(users, {
    fields: [goals.employeeId],
    references: [users.id],
  }),
  manager: one(users, {
    fields: [goals.managerId],
    references: [users.id],
  }),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  employee: one(users, {
    fields: [timeEntries.employeeId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
  approvedBy: one(users, {
    fields: [timeEntries.approvedById],
    references: [users.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  employee: one(users, {
    fields: [expenses.employeeId],
    references: [users.id],
  }),
  approvedBy: one(users, {
    fields: [expenses.approvedById],
    references: [users.id],
  }),
}));

export const onboardingTasksRelations = relations(onboardingTasks, ({ one }) => ({
  newEmployee: one(users, {
    fields: [onboardingTasks.newEmployeeId],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [onboardingTasks.assignedToId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertLeaveSchema = createInsertSchema(leaves).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// New Insert Schemas for Advanced Features
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
});

export const insertTrainingSchema = createInsertSchema(trainings).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingEnrollmentSchema = createInsertSchema(trainingEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertPerformanceReviewSchema = createInsertSchema(performanceReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOnboardingTaskSchema = createInsertSchema(onboardingTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Leave = typeof leaves.$inferSelect;
export type InsertLeave = z.infer<typeof insertLeaveSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

// New Types for Advanced Features
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Training = typeof trainings.$inferSelect;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type TrainingEnrollment = typeof trainingEnrollments.$inferSelect;
export type InsertTrainingEnrollment = z.infer<typeof insertTrainingEnrollmentSchema>;
export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type InsertPerformanceReview = z.infer<typeof insertPerformanceReviewSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type OnboardingTask = typeof onboardingTasks.$inferSelect;
export type InsertOnboardingTask = z.infer<typeof insertOnboardingTaskSchema>;
