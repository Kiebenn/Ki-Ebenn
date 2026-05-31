export interface SchoolProfile {
  logo: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface TeacherProfile {
  photo: string;
  name: string;
  email: string;
  phone: string;
  statusJabatan: string;
}

export interface ClassEntity {
  classId: string;
  className: string;
  gradeLevel: string;
  homeroomTeacher: string;
  capacity: number;
  studentCount: number;
}

export interface SubjectEntity {
  subjectId: string;
  name: string;
  code: string; // e.g. BIN, MAT
  teacherId: string;
  teacherName: string;
  status: 'Active' | 'Inactive';
}

export interface ScheduleEntity {
  scheduleId: string;
  subject: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  timeStart: string; // HH:MM
  timeEnd: string; // HH:MM
  classId: string;
  className: string;
  room: string;
  teacher: string;
}

export interface StudentEntity {
  studentId: string;
  name: string;
  classId: string;
  className: string;
  studentNumber?: string;
  parentPhone?: string;
  email?: string;
  status: 'Active' | 'Inactive';
}

export interface AssessmentEntity {
  assessmentId: string;
  title: string;
  type: 'Harian' | 'Tengah Semester' | 'Akhir Semester';
  weight: number;
  semester: string;
  year: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;
}

export interface ScoreEntity {
  scoreId: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  score: number;
  notes?: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  className: string;
  students: {
    [studentId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  };
}

export type ViewTab = 'dashboard' | 'classes' | 'subjects' | 'schedule' | 'grades' | 'attendance' | 'settings' | 'rekap';
