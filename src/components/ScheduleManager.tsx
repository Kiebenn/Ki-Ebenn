import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  Calendar, 
  AlertTriangle, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { ScheduleEntity, SubjectEntity, ClassEntity } from '../types';

interface ScheduleManagerProps {
  schedules: ScheduleEntity[];
  subjects: SubjectEntity[];
  classes: ClassEntity[];
  onAddSchedule: (newSchedule: ScheduleEntity) => void;
  onUpdateSchedule: (scheduleId: string, updatedData: Partial<ScheduleEntity>) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  teacherName: string;
}

export default function ScheduleManager({
  schedules,
  subjects,
  classes,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  teacherName
}: ScheduleManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Form states
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [className, setClassName] = useState('');
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('09:00');
  const [room, setRoom] = useState('');

  // Filter states
  const [filterDay, setFilterDay] = useState<string>('Semua');
  const [filterClass, setFilterClass] = useState<string>('Semua');

  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const dayOrder = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5 };
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayDiff = (dayOrder[a.day as keyof typeof dayOrder] || 0) - (dayOrder[b.day as keyof typeof dayOrder] || 0);
    if (dayDiff !== 0) return dayDiff;
    return a.timeStart.localeCompare(b.timeStart);
  });

  const filteredList = sortedSchedules.filter(s => {
    const dMatch = filterDay === 'Semua' || s.day === filterDay;
    const cMatch = filterClass === 'Semua' || s.className === filterClass;
    return dMatch && cMatch;
  });

  const openAddModal = () => {
    setModalMode('add');
    setSubject(subjects[0]?.name || '');
    setDay('Senin');
    setClassName(classes[0]?.className || '');
    setTimeStart('08:00');
    setTimeEnd('09:00');
    setRoom('R-101');
    setIsModalOpen(true);
  };

  const openEditModal = (sch: ScheduleEntity) => {
    setModalMode('edit');
    setEditingScheduleId(sch.scheduleId);
    setSubject(sch.subject);
    setDay(sch.day);
    setClassName(sch.className);
    setTimeStart(sch.timeStart);
    setTimeEnd(sch.timeEnd);
    setRoom(sch.room);
    setIsModalOpen(true);
  };

  const parseTime = (val: string): number => {
    const parts = val.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  };

  const checkConflict = (): string | null => {
    const startNum = parseTime(timeStart);
    const endNum = parseTime(timeEnd);

    if (startNum >= endNum) {
      return 'Waktu mulai harus lebih awal dari waktu selesai.';
    }

    for (const item of schedules) {
      // If editing, skip comparing with self
      if (modalMode === 'edit' && item.scheduleId === editingScheduleId) continue;
      if (item.day !== day) continue;

      const existingStart = parseTime(item.timeStart);
      const existingEnd = parseTime(item.timeEnd);

      const isOverlapped = startNum < existingEnd && existingStart < endNum;

      if (isOverlapped) {
        if (item.className === className) {
          return `Overlapping Kelas: Kelas ${className} sudah memiliki jadwal mapel "${item.subject}" di jam ${item.timeStart} - ${item.timeEnd}.`;
        }
        if (item.room === room) {
          return `Overlapping Ruang: Ruangan "${room}" sedang digunakan oleh kelas ${item.className} di jam ${item.timeStart} - ${item.timeEnd}.`;
        }
        if (item.teacher === teacherName) {
          return `Overlapping Guru: Anda sudah memiliki jadwal mengajar kelas ${item.className} di jam ${item.timeStart} - ${item.timeEnd}.`;
        }
      }
    }

    return null;
  };

  const handleSave = () => {
    if (!subject || !className || !room.trim() || !timeStart || !timeEnd) {
      alert('Semua field wajib diisi!');
      return;
    }

    const conflictMsg = checkConflict();
    if (conflictMsg) {
      alert(`⚠️ TABRAKAN JADWAL!\n\n${conflictMsg}`);
      return;
    }

    const matchedClass = classes.find(c => c.className === className);
    const classId = matchedClass ? matchedClass.classId : 'C001';

    if (modalMode === 'add') {
      const newScheduleId = 'SC' + Date.now().toString().slice(-4);
      onAddSchedule({
        scheduleId: newScheduleId,
        subject,
        day,
        timeStart,
        timeEnd,
        classId,
        className,
        room: room.trim(),
        teacher: teacherName
      });
    } else if (modalMode === 'edit' && editingScheduleId) {
      onUpdateSchedule(editingScheduleId, {
        subject,
        day,
        timeStart,
        timeEnd,
        classId,
        className,
        room: room.trim()
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (schId: string, name: string) => {
    if (confirm(`Hapus jadwal mengajar kelas ${name}?`)) {
      onDeleteSchedule(schId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
            Penyusunan Jadwal &amp; Alokasi Ruang
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Susun jadwal mingguan Anda dan kelola pembagian ruangan tanpa bentrok.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-3 px-5 rounded-2xl shadow-sm transition-all active:scale-95 text-sm"
        >
          <Plus className="w-5 h-5" />
          Atur Jadwal Baru
        </button>
      </div>

      {/* Saring Filter Controls */}
      <div className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filter Hari:</span>
            {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDay(d)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  filterDay === d 
                    ? 'bg-pastel-red-500 text-white' 
                    : 'bg-slate-50 text-slate-600 hover:bg-pastel-red-50/50 hover:text-pastel-red-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Filter Kelas:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 text-xs font-bold rounded-xl outline-none"
            >
              <option value="Semua">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.classId} value={c.className}>Kelas {c.className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Unified Big Card Timetable Table */}
      <div className="bg-white border border-pastel-red-100 rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-display font-extrabold text-slate-800 text-base">
              Agenda Mengajar Utama
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan {filteredList.length} sesi mengajar yang terdaftar
            </p>
          </div>
          {filteredList.length > 0 && (
            <span className="text-[11px] font-bold text-pastel-red-500 bg-pastel-red-50 px-3 py-1 rounded-full">
              Mingguan
            </span>
          )}
        </div>

        {filteredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-28">Hari</th>
                  <th className="py-3.5 px-4 w-36">Waktu Sesi</th>
                  <th className="py-3.5 px-4 w-28">Target Kelas</th>
                  <th className="py-3.5 px-4">Mata Pelajaran</th>
                  <th className="py-3.5 px-4">Ruang &amp; Lokasi</th>
                  <th className="py-3.5 px-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredList.map((item) => {
                  // Badges based on Day
                  const dayBadgeMap = {
                    Senin: 'bg-emerald-55 text-emerald-700 bg-emerald-50 border border-emerald-100',
                    Selasa: 'bg-blue-55 text-blue-700 bg-blue-50 border border-blue-100',
                    Rabu: 'bg-amber-55 text-amber-700 bg-amber-50 border border-amber-100',
                    Kamis: 'bg-purple-55 text-purple-700 bg-purple-50 border border-purple-100',
                    Jumat: 'bg-rose-55 text-rose-700 bg-rose-50 border border-rose-100'
                  };

                  return (
                    <tr 
                      key={item.scheduleId}
                      className="hover:bg-slate-50/40 transition duration-150"
                    >
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg ${dayBadgeMap[item.day as keyof typeof dayBadgeMap] || 'bg-slate-50 text-slate-700'}`}>
                          {item.day}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-650 bg-slate-50 px-2 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-pastel-red-400" />
                          {item.timeStart} - {item.timeEnd}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-700 text-xs">Kelas {item.className}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-800 text-sm">{item.subject}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.room}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-pastel-red-500 hover:bg-pastel-red-50 rounded-lg transition"
                            title="Edit Jadwal"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.scheduleId, item.className)}
                            className="p-1.5 text-slate-400 hover:text-red-550 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
            <span className="text-3xl">📅</span>
            <p className="font-bold text-slate-600 text-sm">Tidak ada jadwal ditemukan</p>
            <p className="text-slate-400 max-w-xs mx-auto">
              Silakan sesuaikan saringan atau klik tombol &quot;Atur Jadwal Baru&quot; di atas untuk mengagendakan baru.
            </p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-fade-in">
            <div className="bg-gradient-to-r from-pastel-red-600 to-pastel-red-500 text-white p-5 flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="font-display font-extrabold text-lg">
                  {modalMode === 'add' ? 'Atur Sesi Mengajar' : 'Edit Sesi Mengajar'}
                </h3>
                <p className="text-xs text-white/70">
                  Sistem otomatis mendeteksi bentrok jam, ruang &amp; kelas.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 px-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Mata Pelajaran</label>
                {subjects.length > 0 ? (
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.subjectId} value={s.name}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-red-500">Anda harus menambahkan mata pelajaran terlebih dahulu di menu Mapel!</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Hari</label>
                  <select 
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Tujuan Kelas</label>
                  {classes.length > 0 ? (
                    <select 
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                    >
                      {classes.map(c => (
                        <option key={c.classId} value={c.className}>Kelas {c.className}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-red-500">Masukkan kelas dulu!</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Jam Mulai</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      value={timeStart}
                      onChange={(e) => setTimeStart(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Jam Selesai</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      value={timeEnd}
                      onChange={(e) => setTimeEnd(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Ruangan Kelas / Lokasi</label>
                <input 
                  type="text" 
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Contoh: R-101, Lab Sains, Lapangan" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 text-xs font-bold text-white bg-pastel-red-500 hover:bg-pastel-red-600 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Validasi &amp; Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
