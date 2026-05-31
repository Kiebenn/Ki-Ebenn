import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  BarChart4, 
  Search, 
  Plus, 
  Check, 
  Award, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ClassEntity, 
  SubjectEntity, 
  StudentEntity, 
  AssessmentEntity, 
  ScoreEntity 
} from '../types';

interface GradesManagerProps {
  classes: ClassEntity[];
  subjects: SubjectEntity[];
  students: StudentEntity[];
  assessments: AssessmentEntity[];
  scores: ScoreEntity[];
  onAddAssessmentWithScores: (assessment: AssessmentEntity, studentScores: { [studentId: string]: number }) => void;
  quickGradeClassClassRoomName?: string;
}

export default function GradesManager({
  classes,
  subjects,
  students,
  assessments,
  scores,
  onAddAssessmentWithScores,
  quickGradeClassClassRoomName
}: GradesManagerProps) {
  const [activeTab, setActiveTab] = useState<'input' | 'rekap'>('input');

  // Input states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assessmentTitle, setAssessmentTitle] = useState('Ulangan Harian 1');
  const [assessmentType, setAssessmentType] = useState<'Harian' | 'Tengah Semester' | 'Akhir Semester'>('Harian');
  const [weight, setWeight] = useState('30');
  
  // Temporary score collection state for the form [studentId]: scoreValue
  const [gradeInputs, setGradeInputs] = useState<{ [studentId: string]: string }>({});

  // Rekap states
  const [rekapClass, setRekapClass] = useState('');
  const [rekapSubject, setRekapSubject] = useState('');

  // Handle setting parameters for quick-grade on trigger
  useEffect(() => {
    if (quickGradeClassClassRoomName) {
      setSelectedClass(quickGradeClassClassRoomName);
      setActiveTab('input');
    } else if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].className);
    }
  }, [quickGradeClassClassRoomName, classes]);

  useEffect(() => {
    if (classes.length > 0 && !rekapClass) {
      setRekapClass(classes[0].className);
    }
  }, [classes]);

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].name);
    }
    if (subjects.length > 0 && !rekapSubject) {
      setRekapSubject(subjects[0].name);
    }
  }, [subjects]);

  // Read students in currently selected class
  const classStudents = students.filter(s => s.className === selectedClass);

  // Initialize input values if they are empty
  useEffect(() => {
    const initialInputs: { [studentId: string]: string } = {};
    classStudents.forEach(st => {
      initialInputs[st.studentId] = '';
    });
    setGradeInputs(initialInputs);
  }, [selectedClass, students]);

  const handleScoreChange = (studentId: string, value: string) => {
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const massFillScores = (val: string) => {
    const updated: { [studentId: string]: string } = {};
    classStudents.forEach(st => {
      updated[st.studentId] = val;
    });
    setGradeInputs(updated);
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass || !selectedSubject || !assessmentTitle.trim()) {
      alert('Isi semua parameter penilaian (Kelas, Mapel, Judul)!');
      return;
    }

    const numericWeight = parseInt(weight, 10);
    if (isNaN(numericWeight) || numericWeight <= 0 || numericWeight > 100) {
      alert('Bobot penilaian harus berkisar antara 1 s/d 100!');
      return;
    }

    // Convert string inputs to numbers & check missing values
    const finalScores: { [studentId: string]: number } = {};
    let missingFlag = false;

    for (const st of classStudents) {
      const stringVal = gradeInputs[st.studentId];
      if (!stringVal || stringVal.trim() === '') {
        missingFlag = true;
        break;
      }
      const scoreNum = parseFloat(stringVal);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        alert(`Nilai untuk siswa ${st.name} tidak valid! Harus 0 - 100`);
        return;
      }
      finalScores[st.studentId] = scoreNum;
    }

    if (missingFlag && !confirm('Beberapa siswa belum mempunyai nilai. Tetap simpan nilai siswa yang ada?')) {
      return;
    }

    const matchedSubject = subjects.find(s => s.name === selectedSubject);
    const matchedClass = classes.find(c => c.className === selectedClass);

    const assessmentId = 'A' + Date.now().toString().slice(-4);
    const newAssessment: AssessmentEntity = {
      assessmentId,
      title: assessmentTitle.trim(),
      type: assessmentType,
      weight: numericWeight,
      semester: '1',
      year: String(new Date().getFullYear()),
      classId: matchedClass?.classId || 'C001',
      className: selectedClass,
      subjectId: matchedSubject?.subjectId || 'SBJ001',
      subjectName: selectedSubject,
      teacherId: 'T001',
      teacherName: 'Ibu Ani Wijaya',
      date: new Date().toISOString().split('T')[0]
    };

    onAddAssessmentWithScores(newAssessment, finalScores);
    
    // Clear inputs
    const resetInputs: { [studentId: string]: string } = {};
    classStudents.forEach(st => {
      resetInputs[st.studentId] = '';
    });
    setGradeInputs(resetInputs);
    setAssessmentTitle('Ulangan Tugas Baru');

    alert('✅ Penilaian & nilai rincian siswa berhasil diarsipkan!');
  };

  // REKAP LOGIC: Gathers weighted summaries of students
  const getRekapList = () => {
    const list = students.filter(s => s.className === rekapClass);
    return list.map(student => {
      // Find all scores of this student in the filtered subject
      const studentAssesments = assessments.filter(
        a => a.className === rekapClass && a.subjectName === rekapSubject
      );

      const matchingScores = scores.filter(
        sc => sc.studentId === student.studentId && sc.subjectName === rekapSubject
      );

      let totalWeightedScore = 0;
      let totalWeight = 0;
      let scoreCount = 0;

      // Weighted or Simple Average
      matchingScores.forEach(sc => {
        const matchingAssessment = studentAssesments.find(a => a.assessmentId === sc.assessmentId);
        const w = matchingAssessment ? matchingAssessment.weight : 30;
        totalWeightedScore += (sc.score * w);
        totalWeight += w;
        scoreCount++;
      });

      const averageScore = totalWeight > 0 
        ? Math.round(totalWeightedScore / totalWeight) 
        : scoreCount > 0 
          ? Math.round(matchingScores.reduce((sum, current) => sum + current.score, 0) / scoreCount)
          : null;

      // Grade letter & predicate matching standard KKM
      let predicate = 'Belum Ada';
      let letter = '-';
      if (averageScore !== null) {
        if (averageScore >= 85) {
          letter = 'A';
          predicate = 'Sangat Baik (Sempurna)';
        } else if (averageScore >= 75) {
          letter = 'B';
          predicate = 'Baik (Lulus KKM)';
        } else if (averageScore >= 65) {
          letter = 'C';
          predicate = 'Cukup (Perlu Pembinaan)';
        } else {
          letter = 'D';
          predicate = 'Perlu Bimbingan Khusus';
        }
      }

      return {
        student,
        scoreCount,
        averageScore,
        letter,
        predicate,
        status: averageScore !== null && averageScore >= 75 ? 'LULUS' : averageScore !== null ? 'REMEDIAL' : 'BELUM DEKTA'
      };
    });
  };

  const rekapDataList = getRekapList();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-pastel-red-100 gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
             Workspace Penilaian &amp; Rapor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Silakan pilih subtab untuk mencatat penugasan tugas baru atau melihat rekapitulasi KKM.
          </p>
        </div>

        <div className="flex gap-2 p-1.5 bg-pastel-red-100/40 rounded-2xl w-fit mb-2 sm:mb-0">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'input' 
              ? 'bg-pastel-red-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Penilaian Siswa
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'rekap' 
              ? 'bg-pastel-red-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart4 className="w-4 h-4" />
            Rekap Rapor KKM
          </button>
        </div>
      </div>

      {/* Screen 1: Grade inputs workspace */}
      {activeTab === 'input' && (
        <form onSubmit={handleSaveGrades} className="space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-pastel-red-100/70 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1 px-1.5 rounded-lg bg-pastel-red-50 text-pastel-red-500">
                <Plus className="w-4 h-4" />
              </span>
              Parameter Penilaian Baru
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Rombel (Kelas)</label>
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
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kelas Mata Pelajaran</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.subjectId} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Judul Penilaian</label>
                <input
                  type="text"
                  value={assessmentTitle}
                  onChange={(e) => setAssessmentTitle(e.target.value)}
                  placeholder="Contoh: UH 1 (Bilangan Bulat), Tugas 2, dsb."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none input-focus-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kategori Penilaian</label>
                <select
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                >
                  <option value="Harian">Ulangan Harian / Tugas Mandiri</option>
                  <option value="Tengah Semester">Ujian Tengah Semester (UTS)</option>
                  <option value="Akhir Semester">Ujian Akhir Semester (UAS)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Bobot Kontribusi (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Mis: 30"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none input-focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Table of students */}
          <div className="bg-white rounded-3xl p-5 border border-pastel-red-100/70 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-slate-800">
                  Input Form Nilai Siswa Kelas {selectedClass || '-'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan nilai numerik <b>0-100</b> untuk seluruh siswa.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Auto-set Semuan:</span>
                <button 
                  type="button"
                  onClick={() => massFillScores('100')}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-pastel-red-50 hover:text-pastel-red-500 text-[10px] font-bold text-slate-700 rounded-lg transition"
                >
                  100
                </button>
                <button 
                  type="button"
                  onClick={() => massFillScores('85')}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-pastel-red-50 hover:text-pastel-red-500 text-[10px] font-bold text-slate-700 rounded-lg transition"
                >
                  85
                </button>
                <button 
                  type="button"
                  onClick={() => massFillScores('80')}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-pastel-red-50 hover:text-pastel-red-500 text-[10px] font-bold text-slate-700 rounded-lg transition"
                >
                  80
                </button>
              </div>
            </div>

            {classStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="p-3.5 rounded-l-xl">Nama Lengkap Siswa</th>
                      <th className="p-3.5">NISN (Nomor Induk)</th>
                      <th className="p-3.5 text-center w-40">Nilai (0 - 100)</th>
                      <th className="p-3.5 rounded-r-xl text-center w-32 font-medium">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {classStudents.map((st) => {
                      const currentScore = gradeInputs[st.studentId] || '';
                      const scoreNum = parseFloat(currentScore);
                      const isPassing = !isNaN(scoreNum) && scoreNum >= 75;

                      return (
                        <tr key={st.studentId} className="hover:bg-slate-50/50">
                          <td className="p-3.5 font-bold text-slate-800">{st.name}</td>
                          <td className="p-3.5 font-mono text-xs text-slate-400">{st.studentNumber || `NIS00${st.studentId}`}</td>
                          <td className="p-3.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentScore}
                              onChange={(e) => handleScoreChange(st.studentId, e.target.value)}
                              placeholder="0 - 100"
                              className="w-24 px-3 py-1.5 text-center font-bold bg-slate-50 border border-slate-200 focus:border-pastel-red-500 focus:bg-white rounded-xl text-sm"
                            />
                          </td>
                          <td className="p-3.5 text-center">
                            {currentScore !== '' ? (
                              isPassing ? (
                                <span className="inline-block text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full px-2.5 py-0.5">
                                  Lulus KKM
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] font-bold bg-rose-50 text-rose-500 rounded-full px-2.5 py-0.5">
                                  Remedial
                                </span>
                              )
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">Bhn Diisi</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 text-slate-400 text-xs">
                Silakan tambahkan data siswa ke kelas {selectedClass} terlebih dahulu.
              </div>
            )}

            {classStudents.length > 0 && (
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-3 px-8 rounded-2xl shadow-sm transition-all active:scale-95 text-sm flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Arsipkan Nilai Siswa
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* Screen 2: Rekap Nilai and grade letter distributions */}
      {activeTab === 'rekap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-pastel-red-100/70 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1 px-1.5 rounded-lg bg-pastel-red-50 text-pastel-red-500">
                <Search className="w-4 h-4" />
              </span>
              Saring Hasil Rekap Rapor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Rombel (Kelas)</label>
                <select
                  value={rekapClass}
                  onChange={(e) => setRekapClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                >
                  {classes.map(c => (
                    <option key={c.classId} value={c.className}>Kelas {c.className}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kelas Mata Pelajaran</label>
                <select
                  value={rekapSubject}
                  onChange={(e) => setRekapSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.subjectId} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rekapitulasi Rapor */}
          <div className="bg-white rounded-3xl p-5 border border-pastel-red-100/70 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-slate-800">
                  Daftar Rekap Nilai - Rapor KKM
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Menampilkan hasil rata-rata tertimbang dari seluruh asessment kelas.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="p-3.5 rounded-l-xl">Nama Siswa</th>
                    <th className="p-3.5 text-center">Jumlah Tugas</th>
                    <th className="p-3.5 text-center">Nilai Rerata</th>
                    <th className="p-3.5 text-center">Grade</th>
                    <th className="p-3.5 text-center rounded-r-xl">Status Kelulusan (KKM: 75)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {rekapDataList.map((row) => (
                    <tr key={row.student.studentId} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-800">{row.student.name}</td>
                      <td className="p-3.5 text-center text-slate-500 font-mono text-xs">{row.scoreCount} kali</td>
                      <td className="p-3.5 text-center">
                        <span className={`text-base font-bold font-mono ${
                          row.averageScore !== null 
                            ? row.averageScore >= 75 ? 'text-green-600' : 'text-red-500'
                            : 'text-slate-400'
                        }`}>
                          {row.averageScore !== null ? row.averageScore : '-'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block w-7 h-7 text-xs font-bold leading-7 text-center rounded-full ${
                          row.letter === 'A' ? 'bg-green-100 text-green-700' :
                          row.letter === 'B' ? 'bg-blue-100 text-blue-700' :
                          row.letter === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          row.letter === 'D' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {row.letter}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {row.averageScore !== null ? (
                          row.status === 'LULUS' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">
                              <Award className="w-3.5 h-3.5" /> Lulus KKM
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 rounded-full px-3 py-1 animate-pulse">
                              <AlertCircle className="w-3.5 h-3.5" /> Remedial
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Bhn Ada Nilai</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {rekapDataList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-xs text-slate-400">
                        Tidak ada siswa pada rombel ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
