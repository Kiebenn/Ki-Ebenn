import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  BookOpen,
  Table,
  LayoutList,
  GraduationCap
} from 'lucide-react';
import { SubjectEntity } from '../types';

interface SubjectManagerProps {
  subjects: SubjectEntity[];
  onAddSubject: (newSubject: SubjectEntity) => void;
  onUpdateSubject: (subjectId: string, updatedData: Partial<SubjectEntity>) => void;
  onDeleteSubject: (subjectId: string) => void;
  teacherName: string;
}

export default function SubjectManager({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  teacherName
}: SubjectManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'table' | 'cards'>('table');

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const openAddModal = () => {
    setModalMode('add');
    setName('');
    setCode('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: SubjectEntity) => {
    setModalMode('edit');
    setEditingSubjectId(sub.subjectId);
    setName(sub.name);
    setCode(sub.code);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      alert('Nama dan kode mata pelajaran wajib diisi!');
      return;
    }

    if (modalMode === 'add') {
      const newSubjectId = 'SBJ' + Date.now().toString().slice(-4);
      onAddSubject({
        subjectId: newSubjectId,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        teacherId: 'T001',
        teacherName: teacherName,
        status: 'Active'
      });
    } else if (modalMode === 'edit' && editingSubjectId) {
      onUpdateSubject(editingSubjectId, {
        name: name.trim(),
        code: code.trim().toUpperCase()
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (subjectId: string, subjectName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran ${subjectName}?`)) {
      onDeleteSubject(subjectId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section with modern title & toggle action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-pastel-red-100/55">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
            Buku Mata Pelajaran Pengampu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Grup manajemen master materi pelajaran &amp; kode kurikulum SD Harapan Bangsa.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Segmented View Switcher */}
          <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-1 flex items-center gap-1.5 shadow-inner">
            <button
              onClick={() => setViewType('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewType === 'table'
                  ? 'bg-white text-slate-850 shadow-xs'
                  : 'text-slate-450 hover:text-slate-700'
              }`}
              title="Tampilan Tabel Master"
            >
              <Table className="w-3.5 h-3.5" />
              Tabel
            </button>
            <button
              onClick={() => setViewType('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewType === 'cards'
                  ? 'bg-white text-slate-850 shadow-xs'
                  : 'text-slate-450 hover:text-slate-700'
              }`}
              title="Tampilan Kartu Memanjang"
            >
              <LayoutList className="w-3.5 h-3.5" />
              Baris
            </button>
          </div>

          <button 
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Mapel
          </button>
        </div>
      </div>

      {subjects.length > 0 ? (
        viewType === 'table' ? (
          /* Option 1: Clean, easy to read spreadsheet-style Table */
          <div className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-150 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/40">
                    <th className="py-3 px-4 text-center w-14">No</th>
                    <th className="py-3 px-4 w-32">Kode Singkatan</th>
                    <th className="py-3 px-4">Nama Pelajaran</th>
                    <th className="py-3 px-4">Status Kurikulum</th>
                    <th className="py-3 px-4 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub, index) => (
                    <tr 
                      key={sub.subjectId}
                      className="hover:bg-slate-50/50 transition duration-150"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-xs font-semibold">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block font-mono font-bold text-xs bg-pastel-red-50 text-pastel-red-600 border border-pastel-red-200/50 px-3 py-1 rounded-lg">
                          {sub.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                            <BookOpen className="w-4 h-4 text-pastel-red-450" />
                          </div>
                          <span className="font-bold text-slate-800 text-sm align-middle">
                            {sub.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Aktif Digunakan
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(sub)}
                            className="p-1.5 text-slate-400 hover:text-pastel-red-500 hover:bg-pastel-red-50 rounded-xl transition"
                            title="Edit Mapel"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(sub.subjectId, sub.name)}
                            className="p-1.5 text-slate-400 hover:text-red-550 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                            title="Hapus Mapel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Option 2: Spacious, elongated modern horizontal cards */
          <div className="space-y-3">
            {subjects.map((sub, index) => (
              <div 
                key={sub.subjectId} 
                className="bg-white border border-pastel-red-100/70 rounded-2xl p-4.5 shadow-xs hover:border-pastel-red-300 hover:shadow-sm transition-all duration-300 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-14 h-14 bg-pastel-red-50 text-pastel-red-500 border border-pastel-red-100 rounded-2xl flex items-center justify-center shrink-0 font-display font-black text-xs tracking-wider">
                    {sub.code}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Mata Pelajaran #{index + 1}
                    </span>
                    <h4 className="font-display font-extrabold text-slate-800 text-base truncate pr-2">
                      {sub.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-450 font-medium">
                      <span>Kode: <strong className="font-mono text-pastel-red-650 font-bold">{sub.code}</strong></span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        SD Harapan Bangsa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-l border-slate-100 pl-4 py-1">
                  <button 
                    onClick={() => openEditModal(sub)}
                    className="p-2 text-slate-400 hover:text-pastel-red-500 hover:bg-pastel-red-50 rounded-xl transition"
                    title="Ubah Rincian"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(sub.subjectId, sub.name)}
                    className="p-2 text-slate-400 hover:text-red-550 hover:bg-red-50 rounded-xl transition"
                    title="Hapus Mapel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-500 font-medium mt-2">Belum ada mata pelajaran.</p>
          <p className="text-xs text-slate-400 mt-1">Gunakan tombol Tambah Mapel untuk membuat mata pelajaran perdana Anda.</p>
        </div>
      )}

      {/* Form Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-fade-in">
            <div className="bg-gradient-to-r from-pastel-red-600 to-pastel-red-500 text-white p-5 flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="font-display font-extrabold text-lg">
                  {modalMode === 'add' ? 'Tambah Mata Pelajaran' : 'Ubah Data Mapel'}
                </h3>
                <p className="text-xs text-white/70">
                  Nama dan singkatan representatif di rapor.
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
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Nama Mata Pelajaran</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Matematika, Bahasa Indonesia" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Kode Singkatan</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: MAT, BIN, IPA" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-00 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 text-xs font-bold text-white bg-pastel-red-500 hover:bg-pastel-red-600 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Simpan Mata Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
