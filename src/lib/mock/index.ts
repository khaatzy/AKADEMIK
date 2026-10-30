import {
  Profile,
  DailyProgress,
  TaskItem,
  ScheduleItem,
  ExamItem,
  FileItem,
  ChatMessage,
} from '@/types';

export const mockProfile: Profile = {
  id: 'usr-1',
  name: 'Maya',
  email: 'maya.safitri@kampus.ac.id',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCFmfrqNDI1DOmXj3RD7Wu5qoP6oSC6cpjtbS3bOatUagc_WjFL7pYpV3LnG8KjuKzCjkw9PVqPoxlY1PfNhInLW3yjh-iG6cdluD_TwKK6vsCAKkKtfxL-pBmN_ZiUOyu-jCKYSXBdi6gDEdtHaergCKP6A5uZJtk43dC4uolCU2M65C6v0VxfsEAgt6rrZnTvCtV8qCTCNkJhtn0Lmgmu48XisCFTwW1TftTycyOF',
  role: 'Mahasiswi Aktif',
  institution: 'Institut Teknologi Sains',
};

export const mockDailyProgress: DailyProgress = {
  completed: 2,
  total: 4,
  percentage: 50,
  message: 'Dua langkah lagi menuju target belajarmu hari ini!',
};

export const mockPriorityTasks: TaskItem[] = [
  {
    id: 'tsk-1',
    title: 'Latihan Soal Kalkulus Multivariat',
    courseName: 'Matematika',
    dueTime: '17:00',
    dueDateLabel: 'Hari ini',
    priority: 'urgent',
    priorityLabel: 'Segera Dikerjakan',
    isDone: false,
  },
  {
    id: 'tsk-2',
    title: 'Draft Esai Academic Writing',
    courseName: 'Bahasa Inggris',
    dueTime: '21:00',
    dueDateLabel: 'Hari ini',
    priority: 'high',
    priorityLabel: 'Menunggu Review',
    isDone: false,
  },
  {
    id: 'tsk-3',
    title: 'Resume Bab 3 Termodinamika',
    courseName: 'Fisika',
    dueTime: '09:15',
    dueDateLabel: 'Hari ini',
    priority: 'normal',
    priorityLabel: 'Selesai',
    isDone: true,
    completedAt: '09:15',
  },
  {
    id: 'tsk-4',
    title: 'Kuis Mandiri Fisika Dasar',
    courseName: 'Fisika',
    dueTime: '08:30',
    dueDateLabel: 'Hari ini',
    priority: 'normal',
    priorityLabel: 'Selesai',
    isDone: true,
    completedAt: '08:30',
  },
  {
    id: 'tsk-5',
    title: 'Latihan Turunan Fungsi No. 1 - 15',
    courseName: 'Matematika',
    dueTime: '23:59',
    dueDateLabel: 'Hari ini • 23.59',
    priority: 'urgent',
    priorityLabel: 'Mendesak',
    isDone: false,
    description: 'Kerjakan di buku berpetak lengkap dengan cara eliminasi langkah ganda.',
    remainingTime: 'Sisa waktu: 14 Jam',
  },
  {
    id: 'tsk-6',
    title: 'Laporan Praktikum Reaksi Redoks',
    courseName: 'Kimia',
    dueTime: '10:00',
    dueDateLabel: 'Besok • 10.00 WIB',
    priority: 'high',
    priorityLabel: 'Praktikum',
    isDone: false,
    description: 'Format standar format laporan Lab: Pendahuluan, Data Hasil Uji, dan Kesimpulan.',
    remainingTime: 'Batas: Selasa, 10:00',
  },
  {
    id: 'tsk-7',
    title: 'Kuis Pendahuluan Sejarah',
    courseName: 'Sejarah',
    dueTime: 'Kemarin',
    dueDateLabel: 'Diserahkan kemarin',
    priority: 'normal',
    priorityLabel: 'Selesai',
    isDone: true,
    description: 'Diserahkan kemarin • Nilai 95/100',
  },
];

export const mockDashboardSchedules: ScheduleItem[] = [
  {
    id: 'sch-1',
    startTime: '08.00',
    endTime: '09.40',
    courseName: 'Fisika Modern',
    lecturer: 'Dr. Hendra',
    room: 'Lab Fisika II',
    status: 'completed',
    statusLabel: 'Selesai',
    actionText: 'Lihat Materi & Catatan',
  },
  {
    id: 'sch-2',
    startTime: '10.15',
    endTime: '11.55',
    courseName: 'Bahasa Inggris Akademik',
    lecturer: 'Ms. Amanda',
    room: 'Ruang 304',
    status: 'in_progress',
    statusLabel: 'Berlangsung',
    actionText: 'Buka Modul Sesi Ini',
  },
  {
    id: 'sch-3',
    startTime: '13.00',
    endTime: '14.40',
    courseName: 'Kimia Organik',
    lecturer: 'Prof. Rahmat',
    room: 'Gedung Sains B',
    status: 'upcoming',
    statusLabel: 'Nanti Siang',
    actionText: 'Unduh Slide Kuliah (PDF)',
  },
];

export const mockMondaySchedule: ScheduleItem[] = [
  {
    id: 'mon-1',
    startTime: '07:30',
    endTime: '09:30',
    courseName: 'Matematika Peminatan',
    lecturer: 'Dr. Hendra Gunawan, M.Sc',
    room: 'R. 302',
    status: 'in_progress',
    statusLabel: 'Sedang Berlangsung',
    topic: 'Turunan Fungsi Trigonometri',
    badge: 'Ada PR (Hlm 54)',
  },
  {
    id: 'mon-2',
    startTime: '10:00',
    endTime: '12:15',
    courseName: 'Praktikum Kimia Anorganik',
    lecturer: 'Ibu Sri Wahyuni, S.Si',
    room: 'Lab Kimia Basah',
    status: 'upcoming',
    statusLabel: 'Selanjutnya',
    topic: 'Reaksi Redoks & Larutan Elektrolit',
    badge: 'Laporan Wajib',
  },
  {
    id: 'mon-3',
    startTime: '13:15',
    endTime: '15:00',
    courseName: 'Bahasa Inggris Akademik',
    lecturer: 'Mr. Arthur Davies, M.A',
    room: 'R. Bahasa 104',
    status: 'upcoming',
    statusLabel: 'Siang',
    topic: 'Academic Essay Structuring',
    badge: 'Tanpa PR',
  },
];

export const mockExams: ExamItem[] = [
  {
    id: 'ex-1',
    title: 'Fisika Kuantum',
    courseName: 'Fisika',
    daysLeftLabel: 'H-2',
    dateLabel: 'Kamis, 08:00',
    priority: 'high',
    priorityLabel: 'Prioritas Tinggi',
  },
  {
    id: 'ex-2',
    title: 'Matematika Diskrit',
    courseName: 'Matematika',
    daysLeftLabel: 'H-5',
    dateLabel: 'Senin Depan',
    priority: 'high',
    priorityLabel: 'Prioritas Tinggi',
  },
  {
    id: 'ex-3',
    title: 'Ulangan Harian Kalkulus & Matriks',
    courseName: 'Matematika',
    daysLeftLabel: 'Mendesak',
    dateLabel: '47j : 14m : 02s',
    priority: 'urgent',
    priorityLabel: 'Mendesak',
    description:
      'Bab 3: Determinan, Invers Matriks, Turunan Parsial Dasar. Nilai bobot 20% nilai rapor.',
    urgent: true,
  },
  {
    id: 'ex-4',
    title: 'UTS Fisika Gelombang & Termodinamika',
    courseName: 'Fisika',
    daysLeftLabel: '6 Hari lagi',
    dateLabel: 'Minggu Depan',
    priority: 'high',
    priorityLabel: 'Ujian Tengah Semester',
    description:
      'Lab Fisika Terpadu Gd. B. Diwajibkan membawa kalkulator saintifik & formulir rumus cetak.',
  },
];

export const mockFiles: FileItem[] = [
  {
    id: 'fil-1',
    name: 'Kalkulus Lanjut - Bab 3 Integral.pdf',
    courseName: 'Matematika',
    size: '6.8 MB',
    kind: 'pdf',
    uploadedAt: 'Diunggah 2 jam lalu',
    pageCount: 24,
  },
  {
    id: 'fil-2',
    name: 'Foto Catatan Reaksi Kimia Organik.png',
    courseName: 'Kimia',
    size: '3.4 MB',
    kind: 'image',
    uploadedAt: 'Papan Tulis Lab • Dikonversi ke Markdown',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCfvfKHr9rsijThBasZ0EoN8NYhld51evUSGzv4wbShsSx2VWwLP443vBat-y7dU8j6VYBFRO5_yTCA4mRTFpZkbo3ETCChjFV_EqusXQ9S2-a73edwkEh_6vQ-FOv13QmGbepgaS_-XSUGMyaTedU1_2eN89IzrujZiY47D6tCHVcGnF7IRCP-CtRE-c5QxNNypAyVeyvUGVkNvx9gL59gSKEWoOr4su1lSK17hEm',
    ocrStatus: 'Teks Berhasil Dikenali',
    identifiedCount: '14 Formula Teridentifikasi',
  },
  {
    id: 'fil-3',
    name: 'Ringkasan Biologi Sel Molekuler.pdf',
    courseName: 'Biologi',
    size: '3.1 MB',
    kind: 'summary',
    uploadedAt: 'Kemarin',
    pageCount: 12,
    lastRead: 'Terakhir dibaca: Bab 2 (Halaman 5)',
  },
  {
    id: 'fil-4',
    name: 'Slide_Fisika_Bab4.pdf',
    courseName: 'Fisika',
    size: '4.2 MB',
    kind: 'pdf',
    uploadedAt: 'Selesai diunggah • 100% Selesai',
    pageCount: 18,
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content:
      'Tolong jelaskan secara singkat perbedaan mitosis dan meiosis dari file catatan PDF Biologi yang saya upload tadi pagi.',
    timestamp: '09:41',
    attachmentName: 'Biologi_Sel_Mitosis.pdf',
    attachmentMeta: 'Hlm. 4-9',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      'Berdasarkan dokumen **Biologi_Sel_Mitosis.pdf** yang kamu lampirkan, mitosis dan meiosis memiliki tujuan dasar pembelahan yang berbeda:',
    timestamp: '09:42',
    points: [
      {
        num: 1,
        title: 'Mitosis (Regenerasi Sel Tubuh):',
        desc: 'Menghasilkan 2 sel anakan identik dengan jumlah kromosom diploid (2n). Berfungsi untuk pertumbuhan dan perbaikan jaringan somatik.',
      },
      {
        num: 2,
        title: 'Meiosis (Pembentukan Gamet):',
        desc: 'Menghasilkan 4 sel anakan haploid (n) dengan rekombinasi genetik (crossing over). Terjadi pada organ reproduksi.',
      },
    ],
    comparisonTable: {
      headers: ['Karakter', 'Mitosis', 'Meiosis'],
      rows: [
        ['Tempat Terjadi', 'Sel Somatik (Tubuh)', 'Sel Gamet (Kelamin)'],
        ['Jumlah Pembelahan', '1 Kali Pembelahan', '2 Kali Pembelahan'],
        ['Hasil Akhir', '2 Sel Anakan (2n)', '4 Sel Anakan (n)'],
        ['Pindah Silang', 'Tidak Terjadi', 'Terjadi (Profase I)'],
      ],
    },
    keyFormula: {
      title: 'KUNCI HAFALAN CEPAT',
      description:
        'PMAT (Profase • Metafase • Anafase • Telofase). Pada mitosis 1 siklus PMAT, pada meiosis mengalami 2 siklus berurutan: PMAT I → PMAT II.',
      badge: 'PMAT I → PMAT II',
    },
  },
];
