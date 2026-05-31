import { 
  SchoolProfile, 
  TeacherProfile, 
  ClassEntity, 
  SubjectEntity, 
  ScheduleEntity, 
  StudentEntity, 
  AssessmentEntity, 
  ScoreEntity,
  AttendanceRecord
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23E65A5A"/><path d="M50 20 L80 45 L80 80 L20 80 L20 45 Z" fill="white"/><path d="M40 80 L40 60 L60 60 L60 80 Z" fill="%23E65A5A"/><polygon points="50,15 85,42 15,42" fill="%23C94A49"/><circle cx="50" cy="50" r="10" fill="%23E65A5A"/><text x="45" y="54" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">SD</text></svg>',
  name: 'SD Harapan Bangsa',
  address: 'Jl. Merdeka No. 10, Jakarta Selatan',
  phone: '021-7654321',
  email: 'info@sdharapanbangsa.sch.id'
};

export const initialTeacherProfile: TeacherProfile = {
  photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23FFE6E6" stroke="%23E65A5A" stroke-width="4"/><circle cx="50" cy="40" r="18" fill="%23E65A5A"/><path d="M20 78 C25 60, 75 60, 80 78" fill="%23E65A5A"/></svg>',
  name: 'Ibu Ani Wijaya',
  email: 'ani.wijaya@sdharapanbangsa.sch.id',
  phone: '0812-9876-5432',
  statusJabatan: 'Guru Utama / Wali Kelas'
};

export const initialClasses: ClassEntity[] = [
  { classId: 'C001', className: '1A', gradeLevel: '1', homeroomTeacher: 'Ibu Ani Wijaya', capacity: 28, studentCount: 15 },
  { classId: 'C002', className: '1B', gradeLevel: '1', homeroomTeacher: 'Ibu Siti Aminah', capacity: 26, studentCount: 15 },
  { classId: 'C003', className: '2A', gradeLevel: '2', homeroomTeacher: 'Pak Sudirman', capacity: 30, studentCount: 15 }
];

export const initialSubjects: SubjectEntity[] = [
  { subjectId: 'SBJ001', name: 'Bahasa Indonesia', code: 'BIN', teacherId: 'T002', teacherName: 'Ibu Siti Aminah', status: 'Active' },
  { subjectId: 'SBJ002', name: 'Matematika', code: 'MAT', teacherId: 'T001', teacherName: 'Ibu Ani Wijaya', status: 'Active' },
  { subjectId: 'SBJ003', name: 'Science / IPA', code: 'IPA', teacherId: 'T003', teacherName: 'Pak Sudirman', status: 'Active' },
  { subjectId: 'SBJ004', name: 'Bahasa Inggris', code: 'BIG', teacherId: 'T004', teacherName: 'Ibu Kartini', status: 'Active' },
  { subjectId: 'SBJ005', name: 'Penjaskes', code: 'PEJ', teacherId: 'T005', teacherName: 'Pak Budi Santoso', status: 'Active' },
  { subjectId: 'SBJ006', name: 'Seni Budaya', code: 'SEN', teacherId: 'T006', teacherName: 'Ibu Ratna', status: 'Active' }
];

export const initialSchedules: ScheduleEntity[] = [
  { scheduleId: 'SC001', subject: 'Matematika', day: 'Senin', timeStart: '08:00', timeEnd: '09:00', classId: 'C001', className: '1A', room: 'R-101', teacher: 'Ibu Ani Wijaya' },
  { scheduleId: 'SC002', subject: 'Bahasa Indonesia', day: 'Senin', timeStart: '09:15', timeEnd: '10:15', classId: 'C001', className: '1A', room: 'R-101', teacher: 'Ibu Siti Aminah' },
  { scheduleId: 'SC003', subject: 'Science / IPA', day: 'Selasa', timeStart: '08:00', timeEnd: '09:00', classId: 'C001', className: '1A', room: 'R-102', teacher: 'Pak Sudirman' },
  { scheduleId: 'SC004', subject: 'Bahasa Inggris', day: 'Rabu', timeStart: '09:15', timeEnd: '10:15', classId: 'C001', className: '1A', room: 'R-101', teacher: 'Ibu Kartini' },
  { scheduleId: 'SC005', subject: 'Penjaskes', day: 'Kamis', timeStart: '10:30', timeEnd: '11:30', classId: 'C001', className: '1A', room: 'Lapangan Bola', teacher: 'Pak Budi Santoso' }
];

export const initialStudents: StudentEntity[] = [
  // Class 1A
  { studentId: 'S101', name: 'Ahmad Faisal', classId: 'C001', className: '1A', studentNumber: '02301', status: 'Active' },
  { studentId: 'S102', name: 'Budi Santoso', classId: 'C001', className: '1A', studentNumber: '02302', status: 'Active' },
  { studentId: 'S103', name: 'Citra Kirana', classId: 'C001', className: '1A', studentNumber: '02303', status: 'Active' },
  { studentId: 'S104', name: 'Dewi Lestari', classId: 'C001', className: '1A', studentNumber: '02304', status: 'Active' },
  { studentId: 'S105', name: 'Eko Prasetyo', classId: 'C001', className: '1A', studentNumber: '02305', status: 'Active' },
  { studentId: 'S106', name: 'Farhan Azis', classId: 'C001', className: '1A', studentNumber: '02306', status: 'Active' },
  { studentId: 'S107', name: 'Gita Safitri', classId: 'C001', className: '1A', studentNumber: '02307', status: 'Active' },
  { studentId: 'S108', name: 'Hadi Wijaya', classId: 'C001', className: '1A', studentNumber: '02308', status: 'Active' },
  { studentId: 'S109', name: 'Indah Permata', classId: 'C001', className: '1A', studentNumber: '02309', status: 'Active' },
  { studentId: 'S110', name: 'Joko Susilo', classId: 'C001', className: '1A', studentNumber: '02310', status: 'Active' },
  { studentId: 'S111', name: 'Kartika Sari', classId: 'C001', className: '1A', studentNumber: '02311', status: 'Active' },
  { studentId: 'S112', name: 'Lukman Hakim', classId: 'C001', className: '1A', studentNumber: '02312', status: 'Active' },
  { studentId: 'S113', name: 'Melati Indah', classId: 'C001', className: '1A', studentNumber: '02313', status: 'Active' },
  { studentId: 'S114', name: 'Novianti', classId: 'C001', className: '1A', studentNumber: '02314', status: 'Active' },
  { studentId: 'S115', name: 'Oki Setiawan', classId: 'C001', className: '1A', studentNumber: '02315', status: 'Active' },

  // Class 1B
  { studentId: 'S201', name: 'Putra Pratama', classId: 'C002', className: '1B', studentNumber: '02401', status: 'Active' },
  { studentId: 'S202', name: 'Rani Safira', classId: 'C002', className: '1B', studentNumber: '02402', status: 'Active' },
  { studentId: 'S203', name: 'Siti Aminah', classId: 'C002', className: '1B', studentNumber: '02403', status: 'Active' },
  { studentId: 'S204', name: 'Taufik Hidayat', classId: 'C002', className: '1B', studentNumber: '02404', status: 'Active' },
  { studentId: 'S205', name: 'Ulfa Novita', classId: 'C002', className: '1B', studentNumber: '02405', status: 'Active' },
  { studentId: 'S206', name: 'Vian Alamsyah', classId: 'C002', className: '1B', studentNumber: '02406', status: 'Active' },
  { studentId: 'S207', name: 'Wulan Guritno', classId: 'C002', className: '1B', studentNumber: '02407', status: 'Active' },
  { studentId: 'S208', name: 'Yudi Prasetya', classId: 'C002', className: '1B', studentNumber: '02408', status: 'Active' },
  { studentId: 'S209', name: 'Zahra Amalia', classId: 'C002', className: '1B', studentNumber: '02409', status: 'Active' },
  { studentId: 'S210', name: 'Agung Laksono', classId: 'C002', className: '1B', studentNumber: '02410', status: 'Active' },
  { studentId: 'S211', name: 'Bayu Pamungkas', classId: 'C002', className: '1B', studentNumber: '02411', status: 'Active' },
  { studentId: 'S212', name: 'Cici Paramida', classId: 'C002', className: '1B', studentNumber: '02412', status: 'Active' },
  { studentId: 'S213', name: 'Deni Cagur', classId: 'C002', className: '1B', studentNumber: '02413', status: 'Active' },
  { studentId: 'S214', name: 'Elma Theana', classId: 'C002', className: '1B', studentNumber: '02414', status: 'Active' },
  { studentId: 'S215', name: 'Ferry Salim', classId: 'C002', className: '1B', studentNumber: '02415', status: 'Active' },

  // Class 2A
  { studentId: 'S301', name: 'Gading Marten', classId: 'C003', className: '2A', studentNumber: '02501', status: 'Active' },
  { studentId: 'S302', name: 'Hesti Purwadinata', classId: 'C003', className: '2A', studentNumber: '02502', status: 'Active' },
  { studentId: 'S303', name: 'Irwan Syah', classId: 'C003', className: '2A', studentNumber: '02503', status: 'Active' },
  { studentId: 'S304', name: 'Jefri Nichol', classId: 'C003', className: '2A', studentNumber: '02504', status: 'Active' },
  { studentId: 'S305', name: 'Kezia Karin', classId: 'C003', className: '2A', studentNumber: '02505', status: 'Active' },
  { studentId: 'S306', name: 'Luna Maya', classId: 'C003', className: '2A', studentNumber: '02506', status: 'Active' },
  { studentId: 'S307', name: 'Maudy Ayunda', classId: 'C003', className: '2A', studentNumber: '02507', status: 'Active' },
  { studentId: 'S308', name: 'Nicholas Saputra', classId: 'C003', className: '2A', studentNumber: '02508', status: 'Active' },
  { studentId: 'S309', name: 'Olga Syahputra', classId: 'C003', className: '2A', studentNumber: '02509', status: 'Active' },
  { studentId: 'S310', name: 'Pevita Pearce', classId: 'C003', className: '2A', studentNumber: '02510', status: 'Active' },
  { studentId: 'S311', name: 'Raffi Ahmad', classId: 'C003', className: '2A', studentNumber: '02511', status: 'Active' },
  { studentId: 'S312', name: 'Sule Sutisna', classId: 'C003', className: '2A', studentNumber: '02512', status: 'Active' },
  { studentId: 'S313', name: 'Tora Sudiro', classId: 'C003', className: '2A', studentNumber: '02513', status: 'Active' },
  { studentId: 'S314', name: 'Uus Kartolo', classId: 'C003', className: '2A', studentNumber: '02514', status: 'Active' },
  { studentId: 'S315', name: 'Vicky Prasetyo', classId: 'C003', className: '2A', studentNumber: '02515', status: 'Active' }
];

export const initialAssessments: AssessmentEntity[] = [
  {
    assessmentId: 'A1',
    title: 'Ulangan Harian 1',
    type: 'Harian',
    weight: 30,
    semester: '1',
    year: '2026',
    classId: 'C001',
    className: '1A',
    subjectId: 'SBJ002',
    subjectName: 'Matematika',
    teacherId: 'T001',
    teacherName: 'Ibu Ani Wijaya',
    date: '2026-05-15'
  },
  {
    assessmentId: 'A2',
    title: 'Ujian Tengah Semester',
    type: 'Tengah Semester',
    weight: 30,
    semester: '1',
    year: '2026',
    classId: 'C001',
    className: '1A',
    subjectId: 'SBJ002',
    subjectName: 'Matematika',
    teacherId: 'T001',
    teacherName: 'Ibu Ani Wijaya',
    date: '2026-05-20'
  }
];

export const initialScores: ScoreEntity[] = [
  // Scores for UI UH1
  { scoreId: 'SC_A1_01', assessmentId: 'A1', studentId: 'S101', studentName: 'Ahmad Faisal', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 85 },
  { scoreId: 'SC_A1_02', assessmentId: 'A1', studentId: 'S102', studentName: 'Budi Santoso', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 70 },
  { scoreId: 'SC_A1_03', assessmentId: 'A1', studentId: 'S103', studentName: 'Citra Kirana', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 95 },
  { scoreId: 'SC_A1_04', assessmentId: 'A1', studentId: 'S104', studentName: 'Dewi Lestari', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 62 },
  { scoreId: 'SC_A1_05', assessmentId: 'A1', studentId: 'S105', studentName: 'Eko Prasetyo', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 80 },
  { scoreId: 'SC_A1_06', assessmentId: 'A1', studentId: 'S106', studentName: 'Farhan Azis', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 75 },
  { scoreId: 'SC_A1_07', assessmentId: 'A1', studentId: 'S107', studentName: 'Gita Safitri', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 88 },
  { scoreId: 'SC_A1_08', assessmentId: 'A1', studentId: 'S108', studentName: 'Hadi Wijaya', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 90 },
  { scoreId: 'SC_A1_09', assessmentId: 'A1', studentId: 'S109', studentName: 'Indah Permata', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 55 },
  { scoreId: 'SC_A1_10', assessmentId: 'A1', studentId: 'S110', studentName: 'Joko Susilo', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 78 },
  { scoreId: 'SC_A1_11', assessmentId: 'A1', studentId: 'S111', studentName: 'Kartika Sari', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 82 },
  { scoreId: 'SC_A1_12', assessmentId: 'A1', studentId: 'S112', studentName: 'Lukman Hakim', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 92 },
  { scoreId: 'SC_A1_13', assessmentId: 'A1', studentId: 'S113', studentName: 'Melati Indah', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 84 },
  { scoreId: 'SC_A1_14', assessmentId: 'A1', studentId: 'S114', studentName: 'Novianti', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 77 },
  { scoreId: 'SC_A1_15', assessmentId: 'A1', studentId: 'S115', studentName: 'Oki Setiawan', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 68 },

  // Scores for UTS
  { scoreId: 'SC_A2_01', assessmentId: 'A2', studentId: 'S101', studentName: 'Ahmad Faisal', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 82 },
  { scoreId: 'SC_A2_02', assessmentId: 'A2', studentId: 'S102', studentName: 'Budi Santoso', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 75 },
  { scoreId: 'SC_A2_03', assessmentId: 'A2', studentId: 'S103', studentName: 'Citra Kirana', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 90 },
  { scoreId: 'SC_A2_04', assessmentId: 'A2', studentId: 'S104', studentName: 'Dewi Lestari', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 68 },
  { scoreId: 'SC_A2_05', assessmentId: 'A2', studentId: 'S105', studentName: 'Eko Prasetyo', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 74 },
  { scoreId: 'SC_A2_06', assessmentId: 'A2', studentId: 'S106', studentName: 'Farhan Azis', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 78 },
  { scoreId: 'SC_A2_07', assessmentId: 'A2', studentId: 'S107', studentName: 'Gita Safitri', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 85 },
  { scoreId: 'SC_A2_08', assessmentId: 'A2', studentId: 'S108', studentName: 'Hadi Wijaya', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 88 },
  { scoreId: 'SC_A2_09', assessmentId: 'A2', studentId: 'S109', studentName: 'Indah Permata', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 60 },
  { scoreId: 'SC_A2_10', assessmentId: 'A2', studentId: 'S110', studentName: 'Joko Susilo', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 75 },
  { scoreId: 'SC_A2_11', assessmentId: 'A2', studentId: 'S111', studentName: 'Kartika Sari', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 80 },
  { scoreId: 'SC_A2_12', assessmentId: 'A2', studentId: 'S112', studentName: 'Lukman Hakim', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 89 },
  { scoreId: 'SC_A2_13', assessmentId: 'A2', studentId: 'S113', studentName: 'Melati Indah', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 80 },
  { scoreId: 'SC_A2_14', assessmentId: 'A2', studentId: 'S114', studentName: 'Novianti', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 79 },
  { scoreId: 'SC_A2_15', assessmentId: 'A2', studentId: 'S115', studentName: 'Oki Setiawan', classId: 'C001', className: '1A', subjectId: 'SBJ002', subjectName: 'Matematika', score: 70 }
];
