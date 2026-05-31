import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Users, 
  CalendarDays, 
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { ClassEntity, StudentEntity, AttendanceRecord } from '../types';

interface AttendanceManagerProps {
  classes: ClassEntity[];
  students: StudentEntity[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (className: string, date: string, studentRecords: { [studentId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' }) => void;
}

export default function AttendanceManager({
  classes,
  students,
  attendanceRecords,
  onSaveAttendance
}: AttendanceManagerProps) {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Temporary daily state for current class + date [studentId]: recordStatus
  const [localRecords, setLocalRecords] = useState<{ [studentId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' }>({});

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].className);
    }
  }, [classes]);

  // Load existing records if they exist for current class + date, else default to 'Hadir'
  useEffect(() => {
    if (!selectedClass || !attendanceDate) return;

    // Find if we already archived this day
    const archivedDay = attendanceRecords.find(
      r => r.className === selectedClass && r.date === attendanceDate
    );

    const initialMap: { [studentId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' } = {};
    const classStudents = students.filter(s => s.className === selectedClass);

    classStudents.forEach(st => {
      if (archivedDay && archivedDay.students[st.studentId]) {
        initialMap[st.studentId] = archivedDay.students[st.studentId];
      } else {
        // Default to Hadir
        initialMap[st.studentId] = 'Hadir';
      }
    });

    setLocalRecords(initialMap);
  }, [selectedClass, attendanceDate, students, attendanceRecords]);

  const classStudents = students.filter(s => s.className === selectedClass);

  const handleStatusChange = (studentId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setLocalRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllStatus = (status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    const updated: { [studentId: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' } = {};
    classStudents.forEach(st => {
      updated[st.studentId] = status;
    });
    setLocalRecords(updated);
  };

  const handleSave = () => {
    if (!selectedClass || !attendanceDate) {
      alert('Pilih kelas dan tanggal terlebih dahulu!');
      return;
    }

    onSaveAttendance(selectedClass, attendanceDate, localRecords);
    alert(`✅ Presensi Kelas ${selectedClass} tanggal ${attendanceDate} berhasil didokumentasikan!`);
  };

  // Quick stats computed
  const totalInClass = classStudents.length;
  const hCount = Object.values(localRecords).filter(v => v === 'Hadir').length;
  const iCount = Object.values(localRecords).filter(v => v === 'Izin').length;
  const sCount = Object.values(localRecords).filter(v => v === 'Sakit').length;
  const aCount = Object.values(localRecords).filter(v => v === 'Alpa').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
            Jurnal Kehadiran &amp; Presensi Siswa
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pencatatan harian kehadiran siswa pendukung rapor kepribadian.
          </p>
        </div>
      </div>

      {/* Controller bar */}
      <div className="bg-white rounded-3xl p-5 border border-pastel-red-100/70 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-slate-800 flex items-center gap-2 text-sm">
          <span className="p-1 px-1.5 rounded-lg bg-pastel-red-50 text-pastel-red-500">
            <CalendarDays className="w-4 h-4" />
          </span>
          Saring Kelas &amp; Hari Berjalan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block">Rombel (Kelas)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
            >
              {classes.map(c => (
                <option key={c.classId} value={c.className}>Kelas {c.className}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block">Tanggal Presensi</label>
            <input 
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none input-focus-ring"
            />
          </div>
        </div>
      </div>

      {/* Main interface card split into Stats Overview as Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Statistics vertical column */}
        <div className="bg-gradient-to-b from-pastel-red-600 via-pastel-red-500 to-pastel-red-600 text-white rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-base border-b border-white/20 pb-2 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-pastel-red-100" />
              Rasio Kehadiran Hari Ini
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span>Hadir</span>
                <span className="font-mono font-bold text-sm">{hCount} / {totalInClass}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Sakit (S)</span>
                <span className="font-mono font-bold text-sm">{sCount} anak</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Izin (I)</span>
                <span className="font-mono font-bold text-sm">{iCount} anak</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Alpa (A)</span>
                <span className="font-mono font-bold text-sm text-coral-100">{aCount} anak</span>
              </div>
            </div>
          </div>

          {totalInClass > 0 && (
            <div className="bg-white/10 p-3 rounded-2xl text-center border border-white/10">
              <p className="text-[10px] text-pastel-red-100 font-bold uppercase tracking-widest">
                Efisiensi Kehadiran
              </p>
              <p className="text-2xl font-mono font-black mt-1">
                {Math.round((hCount / totalInClass) * 100)}%
              </p>
            </div>
          )}
        </div>

        {/* Regular student grid and checkmark form */}
        <div className="lg:col-span-3 bg-white border border-pastel-red-100/70 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
            <div>
              <h3 className="font-display font-bold text-slate-800">
                Data Presensi Kelas {selectedClass}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Menandai presensi otomatis atau klik status individual di bawah.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => markAllStatus('Hadir')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-xl transition"
              >
                Set Hadir Semua
              </button>
              <button 
                onClick={() => markAllStatus('Izin')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition"
              >
                Set Izin Semua
              </button>
            </div>
          </div>

          {classStudents.length > 0 ? (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full min-w-[500px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 text-center w-12">No</th>
                    <th className="py-3 px-4 w-28">ID Siswa</th>
                    <th className="py-3 px-4">Nama Lengkap Siswa</th>
                    <th className="py-3 px-4 text-right pr-6 w-52">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {classStudents.map((st, index) => {
                    const currentStatus = localRecords[st.studentId] || 'Hadir';

                    // Dynamic background color style for dropdowns
                    const getSelectStyles = (status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
                      switch (status) {
                        case 'Hadir': return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400';
                        case 'Izin': return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400';
                        case 'Sakit': return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400';
                        case 'Alpa': return 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-400';
                        default: return 'bg-slate-50 text-slate-700 border-slate-200';
                      }
                    };

                    return (
                      <tr 
                        key={st.studentId}
                        className="hover:bg-slate-50/50 transition duration-150"
                      >
                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs font-semibold">{index + 1}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 font-bold">{st.studentId}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 text-sm align-middle">{st.name}</span>
                        </td>
                        <td className="py-3 px-4 text-right pr-6">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(st.studentId, e.target.value as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer focus:ring-2 transition-all w-full max-w-[160px] ${getSelectStyles(currentStatus)}`}
                          >
                            <option value="Hadir" className="bg-white text-slate-800">✅ Hadir (H)</option>
                            <option value="Izin" className="bg-white text-slate-800">✉️ Izin (I)</option>
                            <option value="Sakit" className="bg-white text-slate-800">🤒 Sakit (S)</option>
                            <option value="Alpa" className="bg-white text-slate-800">❌ Alpa (A)</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Silakan tambahkan data murid ke kelas ini terlebih dahulu di menu Kelas!
            </div>
          )}

          {classStudents.length > 0 && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSave}
                className="bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-3 px-8 rounded-2xl shadow-sm transition-all active:scale-95 text-sm flex items-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                Arsipkan Daftar Hadir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
