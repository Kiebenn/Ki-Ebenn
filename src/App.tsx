import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DoorOpen, 
  BookOpen, 
  CalendarDays, 
  ClipboardCheck, 
  Settings as SettingsIcon, 
  LogOut, 
  GraduationCap, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { 
  SchoolProfile, 
  TeacherProfile, 
  ClassEntity, 
  SubjectEntity, 
  ScheduleEntity, 
  StudentEntity, 
  AssessmentEntity, 
  ScoreEntity, 
  AttendanceRecord,
  ViewTab 
} from './types';
import { 
  initialSchoolProfile, 
  initialTeacherProfile, 
  initialClasses, 
  initialSubjects, 
  initialSchedules, 
  initialStudents, 
  initialAssessments, 
  initialScores 
} from './data/initialData';

// Subcomponents
import DashboardOverview from './components/DashboardOverview';
import ClassManager from './components/ClassManager';
import SubjectManager from './components/SubjectManager';
import ScheduleManager from './components/ScheduleManager';
import GradesManager from './components/GradesManager';
import AttendanceManager from './components/AttendanceManager';
import SettingsManager from './components/SettingsManager';
import RekapNilai from './components/RekapNilai';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState<'landing' | 'login'>('landing');
  const [username, setUsername] = useState('Ibu Ani Wijaya');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Primary business state collections
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(initialSchoolProfile);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(initialTeacherProfile);
  const [classes, setClasses] = useState<ClassEntity[]>(initialClasses);
  const [subjects, setSubjects] = useState<SubjectEntity[]>(initialSubjects);
  const [schedules, setSchedules] = useState<ScheduleEntity[]>(initialSchedules);
  const [students, setStudents] = useState<StudentEntity[]>(initialStudents);
  const [assessments, setAssessments] = useState<AssessmentEntity[]>(initialAssessments);
  const [scores, setScores] = useState<ScoreEntity[]>(initialScores);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [quickGradeClass, setQuickGradeClass] = useState<string | undefined>(undefined);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('teacher_portal_sass_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
        if (parsed.teacherProfile) setTeacherProfile(parsed.teacherProfile);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.schedules) setSchedules(parsed.schedules);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.assessments) setAssessments(parsed.assessments);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.attendanceRecords) setAttendanceRecords(parsed.attendanceRecords);
        setIsLoggedIn(parsed.isLoggedIn || false);
        if (parsed.isLoggedIn) {
          setLoginStep('login');
        }
      } catch (e) {
        console.warn('Failed parsing offline states', e);
      }
    }
  }, []);

  // Sync state to local storage on edits
  const saveToLocalStorage = (updates: Record<string, any>) => {
    const saved = localStorage.getItem('teacher_portal_sass_v1');
    let existing: Record<string, any> = {};
    if (saved) {
      try { existing = JSON.parse(saved); } catch {}
    }
    const nextState = { ...existing, ...updates };
    localStorage.setItem('teacher_portal_sass_v1', JSON.stringify(nextState));
  };

  // Auth processing
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (username.trim() && password === '1234') {
      setIsLoggedIn(true);
      saveToLocalStorage({ isLoggedIn: true });
    } else {
      setAuthError('Kredensial salah! Gunakan password demo: 1234');
    }
  };

  const handleLogout = () => {
    if (confirm('Keluar dari portal pendidik?')) {
      setIsLoggedIn(false);
      setLoginStep('landing');
      saveToLocalStorage({ isLoggedIn: false });
    }
  };

  // State Updates API Proxies
  const handleUpdateSchool = (nextSch: SchoolProfile) => {
    setSchoolProfile(nextSch);
    saveToLocalStorage({ schoolProfile: nextSch });
  };

  const handleUpdateTeacher = (nextTch: TeacherProfile) => {
    setTeacherProfile(nextTch);
    saveToLocalStorage({ teacherProfile: nextTch });
  };

  const handleAddClass = (newClass: ClassEntity, importedStudentNames?: string[]) => {
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);

    // If Excel student names are imported, register them automatically
    let updatedStudents = [...students];
    if (importedStudentNames && importedStudentNames.length > 0) {
      const addedStudents: StudentEntity[] = importedStudentNames.map((name, i) => ({
        studentId: 'S' + Date.now().toString().slice(-4) + i,
        name: name,
        classId: newClass.classId,
        className: newClass.className,
        status: 'Active'
      }));
      updatedStudents = [...updatedStudents, ...addedStudents];
      setStudents(updatedStudents);
    }

    saveToLocalStorage({ classes: updatedClasses, students: updatedStudents });
  };

  const handleUpdateClass = (classId: string, updatedData: Partial<ClassEntity>) => {
    const updated = classes.map(c => c.classId === classId ? { ...c, ...updatedData } : c);
    setClasses(updated);
    saveToLocalStorage({ classes: updated });
  };

  const handleDeleteClass = (classId: string) => {
    const targetClass = classes.find(c => c.classId === classId);
    const nextClasses = classes.filter(c => c.classId !== classId);
    setClasses(nextClasses);

    // Remove matching students
    let nextStudents = students;
    if (targetClass) {
      nextStudents = students.filter(s => s.className !== targetClass.className);
      setStudents(nextStudents);
    }

    saveToLocalStorage({ classes: nextClasses, students: nextStudents });
  };

  const handleAddSubject = (newSubject: SubjectEntity) => {
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    saveToLocalStorage({ subjects: updated });
  };

  const handleUpdateSubject = (subjectId: string, updatedData: Partial<SubjectEntity>) => {
    const updated = subjects.map(s => s.subjectId === subjectId ? { ...s, ...updatedData } : s);
    setSubjects(updated);
    saveToLocalStorage({ subjects: updated });
  };

  const handleDeleteSubject = (subjectId: string) => {
    const updated = subjects.filter(s => s.subjectId !== subjectId);
    setSubjects(updated);
    saveToLocalStorage({ subjects: updated });
  };

  const handleAddSchedule = (newSchedule: ScheduleEntity) => {
    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    saveToLocalStorage({ schedules: updated });
  };

  const handleUpdateSchedule = (scheduleId: string, updatedData: Partial<ScheduleEntity>) => {
    const updated = schedules.map(s => s.scheduleId === scheduleId ? { ...s, ...updatedData } : s);
    setSchedules(updated);
    saveToLocalStorage({ schedules: updated });
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const updated = schedules.filter(s => s.scheduleId !== scheduleId);
    setSchedules(updated);
    saveToLocalStorage({ schedules: updated });
  };

  // Multi-entity grading architecture
  const handleAddAssessmentWithScores = (
    newAss: AssessmentEntity, 
    studentScores: { [studentId: string]: number }
  ) => {
    const updatedAss = [...assessments, newAss];
    
    const addedScores: ScoreEntity[] = Object.entries(studentScores).map(([studentId, val], idx) => {
      const studentObj = students.find(s => s.studentId === studentId);
      return {
        scoreId: 'SCR' + Date.now().toString().slice(-4) + idx,
        assessmentId: newAss.assessmentId,
        studentId,
        studentName: studentObj?.name || 'Siswa',
        classId: newAss.classId,
        className: newAss.className,
        subjectId: newAss.subjectId,
        subjectName: newAss.subjectName,
        score: val
      };
    });

    const updatedScores = [...scores, ...addedScores];

    setAssessments(updatedAss);
    setScores(updatedScores);

    saveToLocalStorage({ assessments: updatedAss, scores: updatedScores });
  };

  const handleSaveAttendance = (
    className: string, 
    date: string, 
    studentRecords: { [studentId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' }
  ) => {
    // Check if daily roll already stored
    const filtered = attendanceRecords.filter(r => !(r.className === className && r.date === date));
    
    const nextAttendance: AttendanceRecord = {
      date,
      className,
      students: studentRecords
    };

    const updated = [...filtered, nextAttendance];
    setAttendanceRecords(updated);
    saveToLocalStorage({ attendanceRecords: updated });
  };

  // App Layout Renders
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-batik bg-pastel-red-50 flex items-center justify-center p-4">
        {/* Step 1: Beautiful Selection Landing Screen */}
        {loginStep === 'landing' ? (
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-center border border-pastel-red-100/50 hover:shadow-2xl transition duration-300 relative overflow-hidden animate-fade-in class-landing">
            {/* Soft ornamental header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pastel-red-500 to-pastel-red-400"></div>

            <div className="inline-flex items-center justify-center w-20 h-20 bg-pastel-red-100 rounded-2xl text-pastel-red-500 mb-6 mt-2 shadow-inner">
              <GraduationCap className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-display font-black tracking-tight text-slate-800">
              Smart School Portal
            </h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em] mt-1.5">
              SD HARAPAN BANGSA
            </p>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed max-w-sm mx-auto">
              Sistem informasi manajemen nilai siswa, presensi harian, rincian rombongan belajar, dan mata pelajaran mobile-first.
            </p>

            <button 
              onClick={() => setLoginStep('login')}
              className="w-full mt-8 py-3.5 bg-pastel-red-500 hover:bg-pastel-red-600 active:scale-97 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              Masuk Sebagai Pendidik
            </button>

            <p className="text-[10px] text-slate-400 mt-6 font-mono">
              Teacher Portal v1.0 • Red Pastel Edition
            </p>
          </div>
        ) : (
          /* Step 2: Formal secure Login screen */
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pastel-red-100/50 hover:shadow-2xl transition duration-300 relative overflow-hidden animate-fade-in class-login">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pastel-red-600 to-pastel-red-500"></div>

            <button 
              onClick={() => setLoginStep('landing')}
              className="text-xs text-slate-400 hover:text-slate-800 flex items-center gap-1 mb-6 font-semibold"
            >
              ← Kembali ke Beranda
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-pastel-red-50 text-pastel-red-500 rounded-2xl mb-3 shadow-inner">
                <UserCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-800">Login Pendidik</h2>
              <p className="text-xs text-slate-400 mt-1">Gunakan Akun Guru SD Harapan Bangsa Anda</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Alamat Email Guru / ID</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nama.guru@sdharapan.sch.id"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 focus:bg-white rounded-2xl text-sm input-focus-ring outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan sandi Anda"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 focus:bg-white rounded-2xl text-sm input-focus-ring outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 absolute right-3 top-3.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="text-xs font-semibold text-rose-500 bg-rose-50 rounded-xl p-3 text-center border border-rose-100">
                  ⚠️ {authError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3.5 bg-pastel-red-500 hover:bg-pastel-red-600 active:scale-97 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                Masuk ke Dasbor
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 space-y-1 leading-normal">
              <p className="font-bold text-slate-600">🔑 KREDENSIAL DEMO GURU GUEST:</p>
              <p>Email: <code className="bg-slate-100 p-0.5 rounded font-bold">ani.wijaya@sekolah.sch.id</code></p>
              <p>Sandi default: <code className="bg-slate-100 p-0.5 rounded font-bold">1234</code></p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Define screen layout lists
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Rombel Kelas', icon: DoorOpen },
    { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'schedule', label: 'Jadwal Ajar', icon: CalendarDays },
    { id: 'grades', label: 'Data Nilai KKM', icon: ClipboardCheck },
    { id: 'rekap', label: 'Rekap Nilai', icon: FileSpreadsheet },
    { id: 'attendance', label: 'Presensi Siswa', icon: UserCheck },
    { id: 'settings', label: 'Setelan Portal', icon: SettingsIcon }
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex flex-col md:flex-row relative bg-batik">
      {/* 1. Sidebar desktop navigation (sticks to left) */}
      <aside className="hidden md:flex flex-col w-72 bg-white/95 border-r border-pastel-red-100/60 shrink-0 h-screen sticky top-0 relative bg-batik-sidebar">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-pastel-red-500 rounded-xl flex items-center justify-center text-white font-display font-black text-xl shadow-xs">
            SD
          </div>
          <div>
            <h1 className="font-display font-extrabold text-slate-800 text-sm leading-tight">
              Portal Pendidik
            </h1>
            <p className="text-[10px] text-pastel-red-500 font-bold uppercase tracking-wider">
              PORTAL SD HARAPAN
            </p>
          </div>
        </div>

        {/* Action Lists */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setQuickGradeClass(undefined);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive 
                  ? 'bg-pastel-red-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-pastel-red-50/50 hover:text-pastel-red-500'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-pastel-red-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer profile & logout trigger */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pastel-red-100 overflow-hidden border border-pastel-red-200 shrink-0 flex items-center justify-center">
              <img 
                src={teacherProfile.photo} 
                alt="Teacher Formal" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                {teacherProfile.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate leading-none">
                {schoolProfile.name}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-white hover:bg-pastel-red-50 text-slate-400 hover:text-pastel-red-500 rounded-xl transition border border-slate-100 shrink-0"
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Bottom navigation bar (sticks to bottom for mobile/responsive screen `< md`) */}
      <nav id="floating-bottom-nav" className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-pastel-red-100/50 shadow-lg flex justify-around items-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setQuickGradeClass(undefined);
              }}
              className={`p-2.5 rounded-xl transition flex flex-col items-center justify-center shrink-0 ${
                isActive 
                ? 'bg-pastel-red-500 text-white scale-110 shadow-xs' 
                : 'text-slate-500 hover:bg-slate-50/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {/* Ultra-tiny text indicators for visual accessibility */}
              <span className="text-[8px] font-bold mt-1 scale-90 font-display hidden xs:block">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-xl text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      {/* 3. Main Workspace panel container */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header line with page indicators */}
        <header className="px-6 md:px-8 py-5 border-b border-slate-200/50 bg-white/60 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-black text-slate-800">
              {currentTab === 'dashboard' ? 'Fokus Dasbor' :
               currentTab === 'classes' ? 'Pengaturan Rombel' :
               currentTab === 'subjects' ? 'Buku Mata Pelajaran' :
               currentTab === 'schedule' ? 'Kalender Jadwal Ajar' :
               currentTab === 'grades' ? 'Penilaian KKM' :
               currentTab === 'rekap' ? 'Leger Rekap Nilai' :
               currentTab === 'attendance' ? 'Presensi Harian' :
               'Setelan Portal'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              SD Harapan Bangsa • Hub Manajemen Pendidik
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-white bg-pastel-red-500 rounded-full px-2.5 py-1">
              SD HARAPAN
            </span>
          </div>
        </header>

        {/* Dynamic active screen wrapper */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardOverview 
              schoolProfile={schoolProfile}
              teacherProfile={teacherProfile}
              classes={classes}
              subjects={subjects}
              schedules={schedules}
              students={students}
              onNavigate={(t) => setCurrentTab(t)}
              onOpenQuickGrade={() => {
                if (classes.length > 0) {
                  setQuickGradeClass(classes[0].className);
                }
                setCurrentTab('grades');
              }}
            />
          )}

          {currentTab === 'classes' && (
            <ClassManager 
              classes={classes}
              students={students}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectManager 
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
              teacherName={teacherProfile.name}
            />
          )}

          {currentTab === 'schedule' && (
            <ScheduleManager 
              schedules={schedules}
              subjects={subjects}
              classes={classes}
              onAddSchedule={handleAddSchedule}
              onUpdateSchedule={handleUpdateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              teacherName={teacherProfile.name}
            />
          )}

          {currentTab === 'grades' && (
            <GradesManager 
              classes={classes}
              subjects={subjects}
              students={students}
              assessments={assessments}
              scores={scores}
              onAddAssessmentWithScores={handleAddAssessmentWithScores}
              quickGradeClassClassRoomName={quickGradeClass}
            />
          )}

          {currentTab === 'rekap' && (
            <RekapNilai 
              classes={classes}
              subjects={subjects}
              students={students}
              assessments={assessments}
              scores={scores}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceManager 
              classes={classes}
              students={students}
              attendanceRecords={attendanceRecords}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsManager 
              schoolProfile={schoolProfile}
              teacherProfile={teacherProfile}
              onUpdateSchool={handleUpdateSchool}
              onUpdateTeacher={handleUpdateTeacher}
            />
          )}
        </div>
      </main>
    </div>
  );
}
