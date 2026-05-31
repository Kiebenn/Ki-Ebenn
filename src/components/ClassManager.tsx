import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  FileSpreadsheet, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ClassEntity, StudentEntity } from '../types';

interface ClassManagerProps {
  classes: ClassEntity[];
  students: StudentEntity[];
  onAddClass: (newClass: ClassEntity, importedStudents?: string[]) => void;
  onUpdateClass: (classId: string, updatedData: Partial<ClassEntity>) => void;
  onDeleteClass: (classId: string) => void;
}

export default function ClassManager({
  classes,
  students,
  onAddClass,
  onUpdateClass,
  onDeleteClass
}: ClassManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Form states
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [homeroomTeacher, setHomeroomTeacher] = useState('');
  const [capacity, setCapacity] = useState('28');

  // Excel importing states
  const [uploadedStudentNames, setUploadedStudentNames] = useState<string[]>([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelWarning, setExcelWarning] = useState('');

  // Reset Excel stats helper
  const resetExcelState = () => {
    setUploadedStudentNames([]);
    setExcelFileName('');
    setExcelWarning('');
  };

  const openAddModal = () => {
    setModalMode('add');
    setClassName('');
    setGradeLevel('');
    setHomeroomTeacher('Ibu Ani Wijaya');
    setCapacity('28');
    resetExcelState();
    setIsModalOpen(true);
  };

  const openEditModal = (cls: ClassEntity) => {
    setModalMode('edit');
    setEditingClassId(cls.classId);
    setClassName(cls.className);
    setGradeLevel(cls.gradeLevel);
    setHomeroomTeacher(cls.homeroomTeacher);
    setCapacity(String(cls.capacity));
    resetExcelState();
    setIsModalOpen(true);
  };

  // Safe Excel parser with adaptive header finder
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setExcelWarning('');
    setUploadedStudentNames([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        if (!rows || rows.length === 0) {
          setExcelWarning('File excel kosong atau tidak terbaca');
          return;
        }

        const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
        
        // Adaptive Column Matcher
        const potentialKeys = ['nama', 'nama siswa', 'siswa', 'student', 'student name', 'name', 'full name', 'nama lengkap'];
        let nameColIdx = -1;

        for (const key of potentialKeys) {
          nameColIdx = headers.findIndex(h => h.includes(key));
          if (nameColIdx !== -1) break;
        }

        // Fallback: If no headers match but there is a non-empty column, take first column
        if (nameColIdx === -1) {
          nameColIdx = 0;
          setExcelWarning('Nama kolom tidak terdeteksi otomatis. Menggunakan kolom pertama.');
        }

        const extractedNames: string[] = [];
        for (let i = 1; i < rows.length; i++) {
          const val = String(rows[i][nameColIdx] || '').trim();
          if (val && val !== 'undefined') {
            extractedNames.push(val);
          }
        }

        const uniqueNames = Array.from(new Set(extractedNames));
        if (uniqueNames.length === 0) {
          setExcelWarning('Tidak ditemukan nama siswa pada kolom tersebut');
        } else {
          setUploadedStudentNames(uniqueNames);
        }
      } catch (err) {
        console.error(err);
        setExcelWarning('Gagal mengurai spreadsheet. Atur dokumen atau unduh ulang.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    if (!className.trim() || !gradeLevel.trim() || !homeroomTeacher.trim() || !capacity.trim()) {
      alert('Semua field kelas wajib diisi!');
      return;
    }

    const numericCapacity = parseInt(capacity, 10);
    if (isNaN(numericCapacity) || numericCapacity <= 0) {
      alert('Kapasitas kelas harus berupa angka positif!');
      return;
    }

    if (modalMode === 'add') {
      const newClassId = 'C' + Date.now().toString().slice(-4);
      const newClass: ClassEntity = {
        classId: newClassId,
        className: className.trim(),
        gradeLevel: gradeLevel.trim(),
        homeroomTeacher: homeroomTeacher.trim(),
        capacity: numericCapacity,
        studentCount: uploadedStudentNames.length > 0 ? uploadedStudentNames.length : 0
      };
      
      onAddClass(newClass, uploadedStudentNames);
    } else if (modalMode === 'edit' && editingClassId) {
      onUpdateClass(editingClassId, {
        className: className.trim(),
        gradeLevel: gradeLevel.trim(),
        homeroomTeacher: homeroomTeacher.trim(),
        capacity: numericCapacity
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (classId: string, className: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas ${className}? Semua data siswa di dalamnya juga akan terpengaruh.`)) {
      onDeleteClass(classId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
            Pengaturan Rombongan Belajar (Kelas)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Daftar kelas aktif, kapasitas, serta wali kelas penanggung jawab.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-3 px-5 rounded-2xl shadow-sm transition-all active:scale-95 text-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Kelas Baru
        </button>
      </div>

      {/* Grid Classcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          // Calculate student counts
          const matchingStudents = students.filter(s => s.className === cls.className);
          const activeCount = matchingStudents.length;

          return (
            <div 
              key={cls.classId || cls.className} 
              className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle top decorator */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-pastel-red-400"></div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pastel-red-500 bg-pastel-red-50 px-2 py-0.5 rounded">
                    Tingkat {cls.gradeLevel}
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-800 mt-1.5">
                    Kelas {cls.className}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-black text-pastel-red-500 leading-none">
                    {activeCount}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    dari {cls.capacity} Siswa
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-pastel-red-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((activeCount / cls.capacity) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="text-xs text-slate-600 mb-5 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p>👤 Wali Kelas: <b className="text-slate-800">{cls.homeroomTeacher}</b></p>
                <p>📊 Rasio Pengisian: <b className="text-slate-800">{Math.round((activeCount / cls.capacity) * 100)}%</b></p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => openEditModal(cls)}
                  className="p-2 text-slate-500 hover:text-pastel-red-500 bg-slate-50 hover:bg-pastel-red-50 rounded-xl transition"
                  title="Ubah Struktur"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(cls.classId, cls.className)}
                  className="p-2 text-red-400 hover:text-red-600 bg-red-50/50 hover:bg-red-50 rounded-xl transition"
                  title="Likuidasi Kelas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <span className="text-3xl">🪹</span>
          <p className="text-slate-500 font-medium mt-2">Daftar kelas kosong.</p>
          <p className="text-xs text-slate-400 mt-1">Gunakan tombolTambah Kelas Baru untuk menginisialisasi rombel.</p>
        </div>
      )}

      {/* Class Creator & Editor Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-pastel-red-600 to-pastel-red-500 text-white p-5 flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="font-display font-extrabold text-lg">
                  {modalMode === 'add' ? 'Tambah Kelas Baru' : 'Ubah Struktur Kelas'}
                </h3>
                <p className="text-xs text-white/70">
                  Tentukan wali kelas serta setelan lainnya.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 px-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">ID Kelas</label>
                  <input 
                    type="text" 
                    value={className}
                    onChange={(e) => setClassName(e.target.value.toUpperCase())}
                    placeholder="Contoh: 1A, 2B" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Tingkat Ajar</label>
                  <input 
                    type="text" 
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="Contoh: 1, 2, 3" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Wali Kelas Pengampu</label>
                <input 
                  type="text" 
                  value={homeroomTeacher}
                  onChange={(e) => setHomeroomTeacher(e.target.value)}
                  placeholder="Contoh: Ibu Ani Wijaya" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Kapasitas Maksimum</label>
                <input 
                  type="number" 
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="28" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring"
                />
              </div>

              {/* Advanced Excel spreadsheet importer (ONLY in Add screen) */}
              {modalMode === 'add' && (
                <div className="border border-dashed border-pastel-red-200 bg-pastel-red-50/25 p-4 rounded-2xl space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pastel-red-50 text-pastel-red-500 rounded-xl flex-shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Import Siswa Otomatis (Excel)
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Sistem mencocokkan kolom nama siswa secara adaptif.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-block bg-white border border-pastel-red-200 hover:border-pastel-red-500 hover:bg-pastel-red-50/50 text-pastel-red-600 text-xs font-bold py-2 px-3.5 rounded-xl cursor-pointer shadow-sm transition">
                      Pilih Dokumen
                      <input 
                        type="file" 
                        accept=".xlsx, .xls"
                        onChange={handleExcelImport}
                        className="hidden" 
                      />
                    </label>
                    <div className="text-[10px] text-slate-500 truncate flex-1 leading-normal">
                      {excelFileName ? (
                        <>
                          📁 {excelFileName}
                          {uploadedStudentNames.length > 0 && (
                            <span className="block text-green-600 font-bold mt-0.5">
                              ✔ Terdeteksi {uploadedStudentNames.length} nama siswa!
                            </span>
                          )}
                        </>
                      ) : (
                        'Belum ada file terunggah (.xlsx / .xls)'
                      )}
                    </div>
                  </div>

                  {excelWarning && (
                    <div className="text-[10px] text-red-500 bg-red-50 p-2 rounded-lg flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{excelWarning}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
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
                Simpan &amp; Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
