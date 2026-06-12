import { pgTable, text, timestamp, boolean, serial, integer, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  schoolId: text('schoolId').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description').notNull().default(''),
  badge: text('badge').notNull().default('PRESENCIAL'),
  status: text('status').notNull().default('open'),
  category: text('category').notNull().default('general'),
  image: text('image'),
  price: text('price'),
  duration: text('duration'),
  startDate: text('startDate'),
  enrollmentDeadline: text('enrollmentdeadline'),
  endDate: text('enddate'),
  schedule: text('schedule'),
  location: text('location'),
  teacher: text('teacher'),
  modality: text('modality'),
  slug: text('slug'),
  level: text('level'),
  objective: text('objective'),
  methodology: text('methodology'),
  finalProject: text('finalProject'),
  whatsappGroup: text('whatsappGroup'),
  requirements: text('requirements'),
  maxStudents: integer('maxStudents'),
  modules: jsonb('modules'),
  teachers: jsonb('teachers'),
  showOnHome: boolean('showOnHome').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  dni: text('dni'),
  courseId: text('courseId').notNull(),
  courseName: text('courseName').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: text('paymentStatus').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const carouselSlides = pgTable('carousel_slides', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  image: text('image').notNull(),
  badge: text('badge'),
  ctaText: text('ctaText'),
  ctaLink: text('ctaLink'),
  order: integer('order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  courseId: text('courseId').notNull(),
  courseName: text('courseName').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono').notNull(),
  dni: text('dni').notNull(),
  metodoPago: text('metodoPago'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  mensaje: text('mensaje').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  dni: text('dni'),
  titulo: text('titulo'),
  especialidad: text('especialidad'),
  experiencia: text('experiencia'),
  motivacion: text('motivacion'),
  cvUrl: text('cvUrl'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const interestForms = pgTable('interest_forms', {
  id: serial('id').primaryKey(),
  courseId: text('courseId').notNull(),
  courseName: text('courseName').notNull(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  schoolId: text('schoolId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  whatsapp: text('whatsapp'),
  linkedin: text('linkedin'),
  courseId: text('courseId').references(() => courses.id),
  order: integer('order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const schoolSettings = pgTable('school_settings', {
  id: serial('id').primaryKey(),
  schoolId: text('schoolId').notNull(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
