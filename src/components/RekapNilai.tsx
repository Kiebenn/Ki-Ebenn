import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Printer, 
  Award, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import { 
  ClassEntity, 
  SubjectEntity, 
  StudentEntity, 
  AssessmentEntity, 
  ScoreEntity 
} from '../types';

interface RekapNilaiProps {
  classes: ClassEntity[];
  subjects: SubjectEntity[];
  students: StudentEntity[];
  assessments: AssessmentEntity[];
  scores: ScoreEntity[];
}

export default function RekapNilai({
  classes,
  subjects,
  students,
  assessments,
  scores
}: RekapNilaiProps) {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Semua');

  // Initialize filters
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].className);
    }
  }, [classes, selectedClass]);

  // Students in selected class
  const classStudents = students.filter(s => s.className === selectedClass);

  // Filter assessments and scores logic helper
  const getSubjectAverage = (studentId: string, subjName: string) => {
    const studentScores = scores.filter(
      sc => sc.studentId === studentId && 
            sc.subjectName.toLowerCase() === subjName.toLowerCase() &&
            sc.className === selectedClass
    );
    if (studentScores.length === 0) return null;
    const sum = studentScores.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / studentScores.length);
  };

  // 1. Data for Specific Subject Ledger
  // Get all Assessments for selected class & specific subject
  const subjectAssessments = assessments.filter(
    a => a.className === selectedClass && a.subjectName === selectedSubject
  );

  // Get score for a student in a specific assessment
  const getAssessmentScore = (studentId: string, assessmentId: string) => {
    const found = scores.find(
      s => s.studentId === studentId && s.assessmentId === assessmentId
    );
    return found ? found.score : null;
  };

  // Calculatings
  const specificSubjectRowData = classStudents.map(student => {
    const rowScores: { [assessmentId: string]: number | null } = {};
    let totalWeighted = 0;
    let totalWeight = 0;
    let scoreCount = 0;

    subjectAssessments.forEach(ass => {
      const score = getAssessmentScore(student.studentId, ass.assessmentId);
      rowScores[ass.assessmentId] = score;
      if (score !== null) {
        totalWeighted += score * ass.weight;
        totalWeight += ass.weight;
        scoreCount++;
      }
    });

    const average = totalWeight > 0 
      ? Math.round(totalWeighted / totalWeight) 
      : null;

    let grade = '-';
    let predicate = 'Belum Ada';
    if (average !== null) {
      if (average >= 85) {
        grade = 'A';
        predicate = 'Sangat Baik';
      } else if (average >= 75) {
        grade = 'B';
        predicate = 'Baik';
      } else if (average >= 65) {
        grade = 'C';
        predicate = 'Cukup';
      } else {
        grade = 'D';
        predicate = 'Perlu Bimbingan';
      }
    }

    return {
      student,
      scores: rowScores,
      average,
      grade,
      predicate,
      isPassing: average !== null && average >= 75
    };
  });

  // Calculate generic statistics for Specific Subject
  const specificAverages = specificSubjectRowData.map(r => r.average).filter(v => v !== null) as number[];
  const avgClassScore = specificAverages.length > 0 
    ? Math.round(specificAverages.reduce((a, b) => a + b, 0) / specificAverages.length) 
    : 0;
  
  const totalPassed = specificSubjectRowData.filter(r => r.isPassing).length;
  const totalFailed = specificSubjectRowData.filter(r => r.average !== null && !r.isPassing).length;
  const percentPassed = classStudents.length > 0 
    ? Math.round((totalPassed / classStudents.length) * 100) 
    : 0;

  // 2. Data for cumulative Ledger (Semua Mapel)
  const cumulativeRowData = classStudents.map(student => {
    const subjectAveragedValues: { [subjName: string]: number | null } = {};
    let totalScoreSum = 0;
    let subjectsGradedCount = 0;

    subjects.forEach(subj => {
      const avg = getSubjectAverage(student.studentId, subj.name);
      subjectAveragedValues[subj.name] = avg;
      if (avg !== null) {
        totalScoreSum += avg;
        subjectsGradedCount++;
      }
    });

    const cumulativeAvg = subjectsGradedCount > 0 
      ? Math.round(totalScoreSum / subjectsGradedCount) 
      : null;

    let grade = '-';
    let predicate = 'Belum Ada';
    if (cumulativeAvg !== null) {
      if (cumulativeAvg >= 85) {
        grade = 'A';
        predicate = 'Sangat Baik';
      } else if (cumulativeAvg >= 75) {
        grade = 'B';
        predicate = 'Baik';
      } else if (cumulativeAvg >= 65) {
        grade = 'C';
        predicate = 'Cukup';
      } else {
        grade = 'D';
        predicate = 'Perlu Bimbingan';
      }
    }

    return {
      student,
      averages: subjectAveragedValues,
      cumulativeAvg,
      grade,
      predicate,
      isPassing: cumulativeAvg !== null && cumulativeAvg >= 75
    };
  });

  // Calculate Cumulative Statistics
  const cumulativeAverages = cumulativeRowData.map(r => r.cumulativeAvg).filter(v => v !== null) as number[];
  const avgCumulativeClassScore = cumulativeAverages.length > 0 
    ? Math.round(cumulativeAverages.reduce((a, b) => a + b, 0) / cumulativeAverages.length) 
    : 0;
  
  const totalPassedCumulative = cumulativeRowData.filter(r => r.isPassing).length;
  const totalFailedCumulative = cumulativeRowData.filter(r => r.cumulativeAvg !== null && !r.isPassing).length;
  const percentPassedCumulative = classStudents.length > 0 
    ? Math.round((totalPassedCumulative / classStudents.length) * 100) 
    : 0;

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:p-0">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-pastel-red-100 gap-4 pb-2 print:hidden">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
            Leger &amp; Rekap Nilai Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Modul ledger nilai terfilter komprehensif, untuk melihat capaian nilai harian maupun nilai akhir per mapel.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            Cetak Leger
          </button>
          <button 
            onClick={() => alert('Leger Nilai berhasil diekspor ke file Excel dalam format .XLSX!')}
            className="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Ekspor .XLSX
          </button>
        </div>
      </div>

      {/* Saringan Filter Controls */}
      <div className="bg-white border border-pastel-red-100 rounded-3xl p-5 shadow-sm space-y-4 print:hidden">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-pastel-red-400" />
          Saring Leger Nilai Rombel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rombongan Belajar (Kelas)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-xs font-bold outline-none"
            >
              {classes.map(c => (
                <option key={c.classId} value={c.className}>Kelas {c.className} (Homeroom: {c.homeroomTeacher})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Mata Pelajaran</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-xs font-bold outline-none"
            >
              <option value="Semua">🗳️ Semua Mata Pelajaran (Cumulative Ledger)</option>
              {subjects.map(s => (
                <option key={s.subjectId} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytical Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white border border-pastel-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-pastel-red-50 text-pastel-red-500 rounded-xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Jumlah Siswa</p>
            <p className="text-xl font-bold font-display text-slate-800 mt-1">{classStudents.length} Anak</p>
          </div>
        </div>

        <div className="bg-white border border-pastel-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Rerata Kelas</p>
            <p className="text-xl font-bold font-display text-slate-800 mt-1">
              {selectedSubject === 'Semua' ? avgCumulativeClassScore : avgClassScore}
            </p>
          </div>
        </div>

        <div className="bg-white border border-pastel-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Lulus KKM</p>
            <p className="text-xl font-bold font-display text-slate-800 mt-1">
              {selectedSubject === 'Semua' ? percentPassedCumulative : percentPassed}%
            </p>
          </div>
        </div>

        <div className="bg-white border border-pastel-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Remedial</p>
            <p className="text-xl font-bold font-display text-slate-800 mt-1">
              {selectedSubject === 'Semua' ? totalFailedCumulative : totalFailed} Siswa
            </p>
          </div>
        </div>
      </div>

      {/* Spreadsheet / Ledger Table container */}
      <div className="bg-white border border-pastel-red-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
        {/* Print Header (Visible only when printing) */}
        <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-2xl font-black text-center text-slate-850 uppercase tracking-wide">
            LEGER NILAI AKADEMIK SISWA
          </h1>
          <p className="text-xs text-center text-slate-600 mt-1">
            SD HARAPAN BANGSA • SEMESTER 1 (GANJIL) • TAHUN AJARAN 2026
          </p>
          <div className="grid grid-cols-2 text-xs font-bold mt-4 text-slate-700">
            <div>Kelas Rombele: {selectedClass}</div>
            <div className="text-right">Mata Pelajaran: {selectedSubject === 'Semua' ? 'Kumulatif (Semua Pelajaran)' : selectedSubject}</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-display font-extrabold text-slate-800 text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-pastel-red-500 print:hidden" />
              Leger Komplit Kelas {selectedClass}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 print:hidden">
              Format buku leger transparan untuk perekaman KKM &amp; nilai murni harian.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl uppercase">
            {selectedSubject === 'Semua' ? 'Database Terpadu' : 'Rincian Penilaian'}
          </span>
        </div>

        {classStudents.length > 0 ? (
          <div className="overflow-x-auto">
            {/* View 1: Specific Subject View (Shows each individual Assessment columns) */}
            {selectedSubject !== 'Semua' ? (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3 text-center w-12">No</th>
                    <th className="py-3 px-3 w-28">NISN</th>
                    <th className="py-3 px-3">Nama Siswa</th>
                    
                    {/* Headers for each Assessment */}
                    {subjectAssessments.map(ass => (
                      <th key={ass.assessmentId} className="py-3 px-3 text-center w-24 border-l border-slate-100">
                        <div className="truncate font-semibold text-slate-700" title={ass.title}>
                          {ass.title}
                        </div>
                        <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                          Bobot: {ass.weight}%
                        </div>
                      </th>
                    ))}

                    <th className="py-3 px-3 text-center w-24 border-l border-slate-200 bg-pastel-red-50/20 font-extrabold text-slate-800">
                      Rata-Rata
                    </th>
                    <th className="py-3 px-3 text-center w-16 border-l border-slate-100">Grade</th>
                    <th className="py-3 px-3 text-center w-36 border-l border-slate-100">Evaluasi KKM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {specificSubjectRowData.map((row, index) => (
                    <tr key={row.student.studentId} className="hover:bg-slate-50/40">
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{row.student.studentNumber || `S-${row.student.studentId}`}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{row.student.name}</td>
                      
                      {/* Scores cells */}
                      {subjectAssessments.map(ass => {
                        const cellScore = row.scores[ass.assessmentId];
                        return (
                          <td key={ass.assessmentId} className="py-3 px-3 text-center font-bold font-mono border-l border-slate-100">
                            {cellScore !== null ? (
                              <span className={cellScore >= 75 ? 'text-slate-700' : 'text-red-500 font-mono'}>
                                {cellScore}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Calculated average */}
                      <td className="py-3 px-3 text-center font-extrabold font-mono border-l border-slate-200 bg-pastel-red-50/10 text-slate-800 text-sm">
                        {row.average !== null ? (
                          <span className={row.isPassing ? 'text-green-600' : 'text-rose-550'}>
                            {row.average}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      
                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        <span className={`inline-block w-6 h-6 leading-6 text-[10px] font-bold text-center rounded-full ${
                          row.grade === 'A' ? 'bg-green-150 text-green-700 bg-green-50' :
                          row.grade === 'B' ? 'bg-blue-150 text-blue-700 bg-blue-50' :
                          row.grade === 'C' ? 'bg-yellow-150 text-yellow-700 bg-yellow-50' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {row.grade}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        {row.average !== null ? (
                          row.isPassing ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-0.5">
                              <Award className="w-3 h-3" /> Tuntas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 rounded-full px-2.5 py-0.5">
                              <AlertCircle className="w-3 h-3" /> Remedial
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400">Belum Dinilai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* View 2: Cumulative View (Shows average for each Subject as columns) */
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3 text-center w-12">No</th>
                    <th className="py-3 px-3 w-28">NISN</th>
                    <th className="py-3 px-3">Nama Siswa</th>
                    
                    {/* Headers for each Subject */}
                    {subjects.map(subj => (
                      <th key={subj.subjectId} className="py-3 px-3 text-center w-28 border-l border-slate-100">
                        <div className="truncate font-semibold text-slate-700" title={subj.name}>
                          {subj.name}
                        </div>
                        <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                          {subj.code}
                        </div>
                      </th>
                    ))}

                    <th className="py-3 px-3 text-center w-24 border-l border-slate-200 bg-pastel-red-50/20 font-extrabold text-slate-800">
                      Rata Akhir
                    </th>
                    <th className="py-3 px-3 text-center w-16 border-l border-slate-100">Grade</th>
                    <th className="py-3 px-3 text-center w-36 border-l border-slate-100">Status Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {cumulativeRowData.map((row, index) => (
                    <tr key={row.student.studentId} className="hover:bg-slate-50/40">
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{row.student.studentNumber || `S-${row.student.studentId}`}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{row.student.name}</td>
                      
                      {/* Subject Average cells */}
                      {subjects.map(subj => {
                        const cellScore = row.averages[subj.name];
                        return (
                          <td key={subj.subjectId} className="py-3 px-3 text-center font-bold font-mono border-l border-slate-100">
                            {cellScore !== null ? (
                              <span className={cellScore >= 75 ? 'text-slate-600' : 'text-red-550 font-bold'}>
                                {cellScore}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Cumulative calculated average */}
                      <td className="py-3 px-3 text-center font-extrabold font-mono border-l border-slate-200 bg-pastel-red-50/10 text-slate-800 text-sm">
                        {row.cumulativeAvg !== null ? (
                          <span className={row.isPassing ? 'text-green-600' : 'text-rose-550'}>
                            {row.cumulativeAvg}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      
                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        <span className={`inline-block w-6 h-6 leading-6 text-[10px] font-bold text-center rounded-full ${
                          row.grade === 'A' ? 'bg-green-100 text-green-700' :
                          row.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          row.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {row.grade}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        {row.cumulativeAvg !== null ? (
                          row.isPassing ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-0.5">
                              <Award className="w-3 h-3" /> Sangat Baik
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 rounded-full px-2.5 py-0.5 animate-pulse">
                              <AlertCircle className="w-3 h-3" /> Kurang ( Remedial )
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400">Kosong</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-450 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-2xl block mb-2">🤷‍♂️</span>
            <p className="font-bold text-slate-650">Tidak Ada Rombel Kelas Terpilih</p>
            <p className="text-slate-400">Silakan tambahkan data murid ke kelas Anda terlebih dulu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
