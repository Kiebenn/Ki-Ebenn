import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DoorOpen, 
  BookOpen, 
  CalendarDays, 
  Plus, 
  ClipboardCheck, 
  Settings, 
  Award,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { 
  SchoolProfile, 
  TeacherProfile, 
  ClassEntity, 
  ScheduleEntity, 
  SubjectEntity, 
  StudentEntity, 
  ViewTab 
} from '../types';

interface DashboardOverviewProps {
  schoolProfile: SchoolProfile;
  teacherProfile: TeacherProfile;
  classes: ClassEntity[];
  subjects: SubjectEntity[];
  schedules: ScheduleEntity[];
  students: StudentEntity[];
  onNavigate: (tab: ViewTab) => void;
  onOpenQuickGrade: () => void;
}

export default function DashboardOverview({
  schoolProfile,
  teacherProfile,
  classes,
  subjects,
  schedules,
  students,
  onNavigate,
  onOpenQuickGrade
}: DashboardOverviewProps) {
  const [time, setTime] = useState(new Date());

  // Set up live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date & time
  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate stats
  const totalStudents = students.length;
  const currentDayName = time.toLocaleDateString('id-ID', { weekday: 'long' });

  // Get active lessons for today
  const activeTodaySchedules = schedules.filter(
    s => s.day.toLowerCase() === currentDayName.toLowerCase()
  );

  // Get active or upcoming lesson for the logged-in teacher
  const getCurrentLessonForTeacher = () => {
    const currentDay = currentDayName;
    const currentHourMin = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // schedules belonging to the active teacher (owner of the account)
    const mySchedules = schedules.filter(
      s => s.teacher.toLowerCase() === teacherProfile.name.toLowerCase()
    );

    // My schedules today
    const mySchedulesToday = mySchedules.filter(
      s => s.day.toLowerCase() === currentDay.toLowerCase()
    );

    // 1. Check if there's an active lesson right now
    const active = mySchedulesToday.find(s => {
      return currentHourMin >= s.timeStart && currentHourMin <= s.timeEnd;
    });

    if (active) {
      return {
        type: 'active',
        badge: 'Aktif',
        label: 'Pelajaran Saat Ini',
        subject: active.subject,
        detail: `Kelas ${active.className} (${active.timeStart} - ${active.timeEnd})`
      };
    }

    // 2. Check if there's an upcoming lesson today
    const upcoming = mySchedulesToday
      .filter(s => s.timeStart > currentHourMin)
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart))[0];

    if (upcoming) {
      return {
        type: 'upcoming',
        badge: 'Nanti',
        label: 'Pelajaran Berikutnya',
        subject: upcoming.subject,
        detail: `Kelas ${upcoming.className} (${upcoming.timeStart})`
      };
    }

    // 3. If there were schedules today but all finished
    if (mySchedulesToday.length > 0) {
      return {
        type: 'finished',
        badge: 'Selesai',
        label: 'Pelajaran Hari Ini',
        subject: 'Selesai Mengajar',
        detail: 'Seluruh sesi hari ini selesai'
      };
    }

    // 4. Look ahead to find the first schedule in the week if no schedules today
    if (mySchedules.length > 0) {
      const firstSchedule = mySchedules[0];
      return {
        type: 'scheduled',
        badge: 'Terjadwal',
        label: 'Pelajaran Terdekat',
        subject: firstSchedule.subject,
        detail: `${firstSchedule.day} (${firstSchedule.timeStart} - ${firstSchedule.timeEnd})`
      };
    }

    // 5. Default fallback
    return {
      type: 'free',
      badge: 'Bebas',
      label: 'Pelajaran Saat Ini',
      subject: 'Istirahat / Bebas',
      detail: 'Belum ada jadwal mengajar'
    };
  };

  const currentLessonStatus = getCurrentLessonForTeacher();

  // Recharts fake data based on realistic progress
  const performanceData = [
    { name: 'BIN', rataRata: 82, color: '#C94A49' },
    { name: 'MAT', rataRata: 78, color: '#E65A5A' },
    { name: 'IPA', rataRata: 84, color: '#FF787C' },
    { name: 'BIG', rataRata: 80, color: '#FFA8AB' },
    { name: 'PEJ', rataRata: 88, color: '#FFD1D2' },
    { name: 'SEN', rataRata: 85, color: '#FFEAEB' }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Top Welcome Panel with transparent Batik background & Digital Clock */}
      <div 
        id="dashboard-header-banner" 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pastel-red-600 via-pastel-red-500 to-pastel-red-400 p-6 md:p-8 text-white shadow-lg"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></span>
              {teacherProfile.statusJabatan || 'Guru Pendidik'}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
              Selamat Datang, {teacherProfile.name}!
            </h1>
            <p className="text-white/80 text-sm md:text-base font-light max-w-xl">
              Kelola aktivitas akademik di {schoolProfile.name} hari ini dengan mudah secara mobile-first & offline-first.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner">
            <Clock className="w-5 h-5 text-pastel-red-100 animate-spin-slow" />
            <div className="text-right">
              <div className="text-2xl font-mono font-bold leading-none tracking-wider text-white">
                {formattedTime}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-pastel-red-100 font-medium mt-1">
                {formattedDate}
              </div>
            </div>
          </div>
        </div>
        {/* Abstract design elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none bg-radial-gradient"></div>
      </div>

      {/* Profile Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* School Profile Panel */}
        <div 
          id="school-profile-card" 
          className="glass-card rounded-3xl p-5 shadow-sm bg-white/95 flex items-start gap-4 transition-all duration-300 hover:shadow-md"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-pastel-red-50 border border-pastel-red-100 p-1 flex-shrink-0 flex items-center justify-center">
            <img 
              src={schoolProfile.logo} 
              alt="Logo Sekolah" 
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold tracking-widest text-pastel-red-500 uppercase block mb-1">
              PROFIL LEMBAGA
            </span>
            <h3 className="font-display font-extrabold text-lg text-slate-800 truncate">
              {schoolProfile.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-1">
              📍 {schoolProfile.address}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              📞 {schoolProfile.phone} • {schoolProfile.email}
            </p>
          </div>
        </div>

        {/* Teacher profile summary */}
        <div 
          id="teacher-profile-card" 
          className="glass-card rounded-3xl p-5 shadow-sm bg-white/95 flex items-start gap-4 transition-all duration-300 hover:shadow-md"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-pastel-red-50 border-2 border-pastel-red-100 flex-shrink-0 shadow-inner flex items-center justify-center">
            <img 
              src={teacherProfile.photo} 
              alt="Avatar Guru" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold tracking-widest text-pastel-red-500 uppercase block mb-1">
              IDENTITAS PENDIDIK
            </span>
            <h3 className="font-display font-extrabold text-lg text-slate-800 truncate">
              {teacherProfile.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              🎓 Bidang Keahlian: Matematika & Sains Dasar
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              📧 {teacherProfile.email}
            </p>
          </div>
        </div>
      </div>

      {/* Grid statistics metrics - Soft terracottas/pastel red cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Statistic #1 */}
        <div 
          id="stat-classes" 
          className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-pastel-red-50 text-pastel-red-500">
              <DoorOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-pastel-red-600 font-semibold bg-pastel-red-100/50 px-2 py-0.5 rounded-full">
              Kelas
            </span>
          </div>
          <p className="text-slate-400 text-xs font-medium">Beban Mengajar</p>
          <p className="text-2xl font-display font-extrabold text-slate-800 mt-1">
            {classes.length} <span className="text-sm font-normal text-slate-400">Rombel</span>
          </p>
        </div>

        {/* Core Statistic #2 */}
        <div 
          id="stat-students" 
          className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-pastel-red-50 text-pastel-red-500">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-pastel-red-600 font-semibold bg-pastel-red-100/50 px-2 py-0.5 rounded-full">
              Siswa
            </span>
          </div>
          <p className="text-slate-400 text-xs font-medium">Siswa Terdaftar</p>
          <p className="text-2xl font-display font-extrabold text-slate-800 mt-1">
            {totalStudents} <span className="text-sm font-normal text-slate-400">Anak</span>
          </p>
        </div>

        {/* Core Statistic #3 */}
        <div 
          id="stat-subjects" 
          className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-pastel-red-50 text-pastel-red-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-pastel-red-600 font-semibold bg-pastel-red-100/50 px-2 py-0.5 rounded-full">
              Mapel
            </span>
          </div>
          <p className="text-slate-400 text-xs font-medium">Mata Pelajaran</p>
          <p className="text-2xl font-display font-extrabold text-slate-800 mt-1">
            {subjects.length} <span className="text-sm font-normal text-slate-400">Jenis</span>
          </p>
        </div>

        {/* Core Statistic #4 */}
        <div 
          id="stat-today-agenda" 
          className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-pastel-red-50 text-pastel-red-500">
                <CalendarDays className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-pastel-red-650 font-bold bg-pastel-red-50 border border-pastel-red-100 px-2.5 py-0.5 rounded-full uppercase">
                {currentLessonStatus.badge}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-semibold">{currentLessonStatus.label}</p>
            <p className="text-[15px] font-display font-extrabold text-slate-800 mt-1.5 leading-snug truncate" title={currentLessonStatus.subject}>
              {currentLessonStatus.subject}
            </p>
          </div>
          <p className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg mt-2 inline-block w-fit truncate">
            {currentLessonStatus.detail}
          </p>
        </div>
      </div>

      {/* Main Visualizations split into Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Performance charts card */}
        <div 
          id="academic-perf-chart" 
          className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pastel-red-100/80 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 px-1.5 rounded-lg bg-pastel-red-50 text-pastel-red-500">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="font-display font-bold text-lg text-slate-800">
                  Rata-Rata Nilai Siswa per Mapel
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Statistik pencapaian kumulatif rombongan belajar Anda
              </p>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-xs font-bold text-pastel-red-600 bg-pastel-red-100 rounded-lg px-2.5 py-1">
                Semester 1 (Ganjil)
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  style={{ fontSize: '11px', fontWeight: 'bold', fill: '#64748b' }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  tickLine={false} 
                  axisLine={false}
                  style={{ fontSize: '10px', fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    borderColor: '#FFEAEB', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' 
                  }}
                  cursor={{ fill: 'rgba(230, 90, 90, 0.03)' }}
                />
                <Bar dataKey="rataRata" radius={[10, 10, 0, 0]} barSize={35}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs bg-pastel-red-50/50 p-3.5 rounded-2xl border border-pastel-red-100/50 mt-4">
            <span className="text-slate-500 font-medium">Target Mutu Satuan: <b>75.0 (KKM)</b></span>
            <span className="text-pastel-red-600 font-bold flex items-center gap-1">
              Baik Sekali <Award className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Quick Actions & Classroom Progress bento card */}
        <div className="space-y-6">
          {/* Action Hub */}
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pastel-red-100/80">
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-pastel-red-500 rounded-full inline-block"></span>
              Akses Instan Portal
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button 
                id="btn-quick-grade"
                onClick={onOpenQuickGrade}
                className="w-full flex items-center gap-3 p-3 bg-pastel-red-50 border border-pastel-red-100 hover:bg-pastel-red-100 rounded-2xl text-left transition-all duration-300 active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pastel-red-500 shadow-sm flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">Ujian & Tugas</p>
                  <p className="text-xs text-slate-500 truncate">Input Penilaian Rombel</p>
                </div>
                <ArrowRight className="w-4 h-4 text-pastel-red-400" />
              </button>

              <button 
                id="btn-quick-attendance"
                onClick={() => onNavigate('attendance')}
                className="w-full flex items-center gap-3 p-3 bg-pastel-red-50/50 border border-pastel-red-100/80 hover:bg-pastel-red-50 rounded-2xl text-left transition-all duration-300 active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pastel-red-500 shadow-sm flex-shrink-0">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">Presensi Cepat</p>
                  <p className="text-xs text-slate-500 truncate">Pencatatan Kehadiran</p>
                </div>
                <ArrowRight className="w-4 h-4 text-pastel-red-400" />
              </button>

              <button 
                id="btn-quick-settings"
                onClick={() => onNavigate('settings')}
                className="w-full flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl text-left transition-all duration-300 active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm flex-shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">Setelan Portal</p>
                  <p className="text-xs text-slate-500 truncate">Logo, Identitas & Akun</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Class Capacities status lists */}
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pastel-red-100/80">
            <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>Rasio Kapasitas Kelas</span>
              <span className="text-xs font-semibold text-pastel-red-500">{classes.length} Rombel</span>
            </h3>
            <div className="space-y-3">
              {classes.map((cls, idx) => {
                const ratio = Math.round((cls.studentCount / cls.capacity) * 100);
                return (
                  <div key={cls.classId || idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Kelas {cls.className}</span>
                      <span className="font-mono text-slate-500">
                        {cls.studentCount}/{cls.capacity} Siswa ({ratio}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pastel-red-400 to-pastel-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(ratio, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Today's comprehensive schedule timetable block */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pastel-red-100/80">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-pastel-red-500 inline-block animate-ping"></span>
              Jadwal Kelas Aktif Hari Ini ({currentDayName})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Daftar jam mengajar Anda yang terdaftar pada sistem akademik
            </p>
          </div>
          <button 
            onClick={() => onNavigate('schedule')}
            className="text-xs font-bold text-pastel-red-600 hover:text-pastel-red-700 hover:underline px-3 py-1 rounded"
          >
            Edit Timetable
          </button>
        </div>

        {activeTodaySchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTodaySchedules.map((item, idx) => (
              <div 
                key={item.scheduleId || idx}
                className="p-4 bg-gradient-to-br from-white to-pastel-red-50/20 border border-pastel-red-100/60 rounded-2xl flex flex-col justify-between glow-hover"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-white bg-pastel-red-500 rounded px-2 py-0.5 font-mono">
                      {item.timeStart} - {item.timeEnd}
                    </span>
                    <h4 className="font-display font-extrabold text-slate-800 mt-2">
                      {item.subject}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Ruang: <b>{item.room || 'R-101'}</b>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs font-bold rounded-xl px-2.5 py-1 bg-pastel-red-100 text-pastel-red-600">
                      Kls {item.className}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pendidik: {item.teacher}</span>
                  <span className="text-pastel-red-500 font-bold hover:underline cursor-pointer" onClick={() => onNavigate('attendance')}>
                    Presensi
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-pastel-red-50/20 rounded-2xl border border-dashed border-pastel-red-100">
            <span className="block text-2xl mb-2">🏝️</span>
            <p className="text-slate-600 font-medium text-sm">Tidak Ada Jadwal Mengajar Hari Ini</p>
            <p className="text-xs text-slate-400 mt-1">Nikmati waktu luang Anda atau persiapkan modul ajar berikutnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}
