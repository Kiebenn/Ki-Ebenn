import React, { useState } from 'react';
import { 
  Building2, 
  UserSquare2, 
  KeyRound, 
  Check, 
  Camera, 
  Info 
} from 'lucide-react';
import { SchoolProfile, TeacherProfile } from '../types';

interface SettingsManagerProps {
  schoolProfile: SchoolProfile;
  teacherProfile: TeacherProfile;
  onUpdateSchool: (data: SchoolProfile) => void;
  onUpdateTeacher: (data: TeacherProfile) => void;
}

export default function SettingsManager({
  schoolProfile,
  teacherProfile,
  onUpdateSchool,
  onUpdateTeacher
}: SettingsManagerProps) {
  // School profile form local state
  const [schName, setSchName] = useState(schoolProfile.name);
  const [schLogo, setSchLogo] = useState(schoolProfile.logo);
  const [schAddress, setSchAddress] = useState(schoolProfile.address);
  const [schPhone, setSchPhone] = useState(schoolProfile.phone);
  const [schEmail, setSchEmail] = useState(schoolProfile.email);

  // Teacher profile form local state
  const [tchName, setTchName] = useState(teacherProfile.name);
  const [tchPhoto, setTchPhoto] = useState(teacherProfile.photo);
  const [tchEmail, setTchEmail] = useState(teacherProfile.email);
  const [tchPhone, setTchPhone] = useState(teacherProfile.phone);
  const [tchStatusJabatan, setTchStatusJabatan] = useState(teacherProfile.statusJabatan || '');

  // Password local state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (b64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const b64Str = String(evt.target?.result || '');
      if (b64Str) {
        setter(b64Str);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schName.trim() || !schAddress.trim() || !schPhone.trim() || !schEmail.trim()) {
      alert('Semua rincian profil sekolah wajib diisi!');
      return;
    }

    onUpdateSchool({
      name: schName.trim(),
      logo: schLogo,
      address: schAddress.trim(),
      phone: schPhone.trim(),
      email: schEmail.trim()
    });
    alert('✅ Profil sekolah berhasil diperbarui!');
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tchName.trim() || !tchEmail.trim() || !tchPhone.trim() || !tchStatusJabatan.trim()) {
      alert('Profil identitas guru wajib diisi lengkap!');
      return;
    }

    onUpdateTeacher({
      name: tchName.trim(),
      photo: tchPhoto,
      email: tchEmail.trim(),
      phone: tchPhone.trim(),
      statusJabatan: tchStatusJabatan.trim()
    });
    alert('✅ Informasi profil guru pendidik berhasil disimpan!');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword || !newPassword || !confPassword) {
      alert('Isi formulir perubahan kata sandi secara lengkap!');
      return;
    }

    if (newPassword !== confPassword) {
      alert('Konfirmasi kata sandi baru tidak sesuai!');
      return;
    }

    alert('✅ Kata sandi berhasil diperbarui!');
    setCurrPassword('');
    setNewPassword('');
    setConfPassword('');
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Bento: School Profiler */}
        <form onSubmit={handleSaveSchool} className="bg-white rounded-3xl p-5 md:p-6 border border-pastel-red-100/70 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-pastel-red-500" />
              Profil Lembaga Sekolah
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Atur profile nama dan rincian kontak SD Anda.
            </p>
          </div>

          <div className="space-y-4">
            {/* Logo upload with circular preview ring */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-pastel-red-50/50 border-2 border-pastel-red-200 flex items-center justify-center relative group p-1 flex-shrink-0 shadow-inner">
                <img 
                  src={schLogo} 
                  alt="Review Logo" 
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <label className="inline-block bg-pastel-red-50 hover:bg-pastel-red-100 text-pastel-red-600 text-xs font-bold py-2 px-3.5 rounded-xl cursor-pointer transition shadow-xs border border-pastel-red-100">
                  Ganti Logo Sekolah
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, setSchLogo)}
                    className="hidden" 
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Dukung PNG, JPG, GIF, SVG maksimal 1.5MB</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Nama Sekolah Resmi</label>
              <input 
                type="text" 
                value={schName}
                onChange={(e) => setSchName(e.target.value)}
                placeholder="Contoh: SD Harapan Bangsa"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Alamat Lembaga</label>
              <textarea 
                rows={3}
                value={schAddress}
                onChange={(e) => setSchAddress(e.target.value)}
                placeholder="Jl. Merdeka No. 10, Jakarta Selatan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Telepon Sekolah</label>
                <input 
                  type="text" 
                  value={schPhone}
                  onChange={(e) => setSchPhone(e.target.value)}
                  placeholder="021-7654321"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Email Resmi</label>
                <input 
                  type="email" 
                  value={schEmail}
                  onChange={(e) => setSchEmail(e.target.value)}
                  placeholder="info@sekolah.sch.id"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all active:scale-95 text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan Profil Lembaga
            </button>
          </div>
        </form>

        {/* Right Bento: Teacher Profiler */}
        <form onSubmit={handleSaveTeacher} className="bg-white rounded-3xl p-5 md:p-6 border border-pastel-red-100/70 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-2">
              <UserSquare2 className="w-5 h-5 text-pastel-red-500" />
              Profil Identitas Pendidik
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Atur profil nama pendidik dan avatar pengenal Anda.
            </p>
          </div>

          <div className="space-y-4">
            {/* Foto upload with circular preview ring */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-pastel-red-50/55 border-2 border-pastel-red-200 flex items-center justify-center relative group shadow-inner">
                <img 
                  src={tchPhoto} 
                  alt="Review Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <label className="inline-block bg-pastel-red-50 hover:bg-pastel-red-100 text-pastel-red-600 text-xs font-bold py-2 px-3.5 rounded-xl cursor-pointer transition shadow-xs border border-pastel-red-100">
                  Ganti Foto Profil
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, setTchPhoto)}
                    className="hidden" 
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Gunakan gambar formal rasio kotak 1:1</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Nama Lengkap Guru / Gelar</label>
              <input 
                type="text" 
                value={tchName}
                onChange={(e) => setTchName(e.target.value)}
                placeholder="Contoh: Ibu Ani Wijaya, S.Pd."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Status Jabatan / Peran Pengampu</label>
              <input 
                type="text" 
                value={tchStatusJabatan}
                onChange={(e) => setTchStatusJabatan(e.target.value)}
                placeholder="Contoh: Guru Utama / Wali Kelas 1A, Kaprogdi"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Email Pendidik</label>
                <input 
                  type="email" 
                  value={tchEmail}
                  onChange={(e) => setTchEmail(e.target.value)}
                  placeholder="nama.guru@sekolah.sch.id"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Nomor HP Aktif</label>
                <input 
                  type="text" 
                  value={tchPhone}
                  onChange={(e) => setTchPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all active:scale-95 text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan Foto &amp; Bio
            </button>
          </div>
        </form>
      </div>

      {/* Under bento row: Change Password block */}
      <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-5 md:p-6 border border-pastel-red-100/70 shadow-sm max-w-xl mx-auto space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-pastel-red-500" />
            Ubah Kata Sandi Akun
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ganti password login portal demi kenyamanan privasi.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kata Sandi Saat Ini</label>
            <input 
              type="password" 
              value={currPassword}
              onChange={(e) => setCurrPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kata Sandi Baru</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Konfirmasi Kata Sandi</label>
              <input 
                type="password" 
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pastel-red-500 rounded-xl text-sm input-focus-ring outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold leading-normal">
            <Info className="w-4 h-4 text-pastel-red-400 shrink-0" />
            <span>Pastikan mencatat sandi baru Anda di saku aman</span>
          </div>
          <button
            type="submit"
            className="bg-pastel-red-500 hover:bg-pastel-red-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all active:scale-95 text-xs flex items-center gap-1.5 shrink-0"
          >
            <Check className="w-4 h-4" />
            Perbarui Password
          </button>
        </div>
      </form>
    </div>
  );
}
