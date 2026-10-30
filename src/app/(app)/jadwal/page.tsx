'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getMondaySchedule } from '@/lib/data/schedules';
import { getExams } from '@/lib/data/exams';
import { getTasks, toggleTaskStatus } from '@/lib/data/tasks';
import { createTaskAction, deleteTaskAction, toggleTaskAction } from '@/lib/actions/tasks';
import { ScheduleItem, ExamItem, TaskItem } from '@/types';

export default function ScheduleTasksPage() {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'tugas'>('jadwal');
  const [selectedDay, setSelectedDay] = useState('21');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseName, setNewCourseName] = useState('Kalkulus Multivariabel');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'medium'>('high');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const viewJadwalRef = useRef<HTMLDivElement>(null);
  const viewTugasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const [schData, examData, taskData] = await Promise.all([
        getMondaySchedule(),
        getExams(),
        getTasks(),
      ]);
      setSchedules(schData);
      setExams(examData.length > 2 ? examData.slice(2, 4) : examData);
      setTasks(taskData.length >= 3 ? taskData.slice(-3) : taskData);
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleToggleTask = async (id: string) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask) return;

    // Optimistic UI update
    const updated = await toggleTaskStatus(id);
    if (!updated) return;

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await toggleTaskAction(id, updated.isDone);

    showToast(
      updated.isDone
        ? `Tugas "${updated.title}" ditandai selesai! 🎉`
        : `Tugas "${updated.title}" dikembalikan ke daftar aktif.`
    );
  };

  const handleDeleteTask = async (id: string, title: string) => {
    if (!confirm(`Hapus tugas "${title}"?`)) return;

    await deleteTaskAction(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Tugas "${title}" berhasil dihapus.`);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmittingTask(true);
    const dueDateIso = new Date(Date.now() + 86400000 * 2).toISOString();

    const res = await createTaskAction({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      due_at: dueDateIso,
      priority: newPriority,
    });

    setIsSubmittingTask(false);

    if (res?.error) {
      showToast(res.error);
      return;
    }

    const newTaskItem: TaskItem = {
      id: res.task?.id || `tsk-${Date.now()}`,
      title: newTitle.trim(),
      courseName: newCourseName,
      dueTime: '23:59',
      dueDateLabel: '2 Hari lagi • 23.59 WIB',
      priority: newPriority === 'medium' ? 'normal' : newPriority,
      priorityLabel: newPriority === 'urgent' ? 'Mendesak' : newPriority === 'high' ? 'Prioritas Tinggi' : 'Normal',
      isDone: false,
      description: newDescription.trim() || undefined,
      remainingTime: 'Sisa waktu: 48 Jam',
    };

    setTasks((prev) => [newTaskItem, ...prev]);
    setIsAddTaskModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`Tugas "${newTaskItem.title}" berhasil ditambahkan!`);
  };

  const switchView = (tab: 'jadwal' | 'tugas') => {
    setActiveTab(tab);
    if (tab === 'jadwal') {
      viewJadwalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      viewTugasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const daysList = [
    { code: 'SEN', num: '21', dots: ['bg-surface-container-lowest', 'bg-tertiary-fixed'] },
    { code: 'SEL', num: '22', dots: ['bg-primary-container'] },
    { code: 'RAB', num: '23', dots: ['bg-secondary', 'bg-error'] },
    { code: 'KAM', num: '24', dots: [] },
    { code: 'JUM', num: '25', dots: ['bg-primary-container'] },
    { code: 'SAB', num: '26', dots: [] },
  ];

  const completedTasksCount = tasks.filter((t) => t.isDone).length;
  const totalTasksCount = tasks.length || 1;
  const taskPercentage = Math.round((completedTasksCount / totalTasksCount) * 100);

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2 font-label-md text-label-md transition-all animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Tambah Tugas Baru */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-space-lg shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_task</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Tambah Tugas / PR Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTaskModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-medium block mb-1">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Implementasi Algoritma Dijkstra"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-medium block mb-1">
                  Mata Kuliah
                </label>
                <select
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Kalkulus Multivariabel">Kalkulus Multivariabel</option>
                  <option value="Struktur Data & Algoritma">Struktur Data &amp; Algoritma</option>
                  <option value="Pemrograman Web Lanjut">Pemrograman Web Lanjut</option>
                  <option value="Fisika Dasar II">Fisika Dasar II</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-medium block mb-1">
                  Prioritas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['urgent', 'high', 'medium'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 px-2 rounded-lg font-label-sm text-label-sm uppercase font-semibold transition-colors ${
                        newPriority === p
                          ? p === 'urgent'
                            ? 'bg-error text-on-error'
                            : p === 'high'
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {p === 'urgent' ? 'Mendesak' : p === 'high' ? 'Tinggi' : 'Normal'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-medium block mb-1">
                  Keterangan / Instruksi
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Catatan tambahan, format penyerahan, atau batas waktu..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-75 flex items-center gap-1.5"
                >
                  {isSubmittingTask ? 'Menyimpan...' : 'Simpan Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-lg">
        {/* View Switcher Toggle */}
        <div className="bg-surface-container p-1 rounded-full flex items-center justify-between shadow-sm relative">
          <button
            type="button"
            onClick={() => switchView('jadwal')}
            className={`flex-1 py-2 px-3 rounded-full text-center font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-1.5 ${
              activeTab === 'jadwal'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
            <span>Jadwal Mingguan</span>
          </button>
          <button
            type="button"
            onClick={() => switchView('tugas')}
            className={`flex-1 py-2 px-3 rounded-full text-center font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-1.5 ${
              activeTab === 'tugas'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            <span>Tugas &amp; Ulangan</span>
            <span className="w-2 h-2 rounded-full bg-error ml-0.5 animate-pulse"></span>
          </button>
        </div>

        {/* Horizontal Date Strip Calendar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                calendar_month
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Oktober 2024
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full font-medium">
              Minggu ke-4
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {daysList.map((day) => {
              const isSelected = selectedDay === day.num;
              return (
                <button
                  key={day.num}
                  type="button"
                  onClick={() => setSelectedDay(day.num)}
                  className={`flex flex-col items-center justify-center min-w-[54px] py-2.5 px-1.5 rounded-xl flex-shrink-0 transition-transform active:scale-95 shadow-sm ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-lowest text-on-surface'
                  }`}
                >
                  <span
                    className={`font-label-sm text-label-sm uppercase tracking-wider ${
                      isSelected ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {day.code}
                  </span>
                  <span className="font-headline-md text-headline-md font-bold my-0.5">
                    {day.num}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 min-h-[6px]">
                    {day.dots.map((dotClass, dIdx) => (
                      <span key={dIdx} className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: Upcoming Exams & Quizzes */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">
                notification_important
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Ujian &amp; Ulangan Dekat
              </h2>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              {exams.length} Mendatang
            </span>
          </div>

          {/* Upcoming Exam Cards */}
          {exams.map((exam, idx) => (
            <div
              key={exam.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col gap-3"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  exam.priority === 'urgent' ? 'bg-error' : 'bg-secondary'
                }`}
              ></div>
              <div className="flex items-start justify-between gap-2 pl-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        exam.priority === 'urgent'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      {exam.priorityLabel}
                    </span>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                      {exam.courseName}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold">
                    {exam.title}
                  </h3>
                </div>
                <div className="bg-surface-container-low px-2.5 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0">
                  {exam.priority === 'urgent' && (
                    <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  )}
                  <span
                    className={`font-code-sm text-code-sm font-medium ${
                      exam.priority === 'urgent' ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {exam.daysLeftLabel || exam.dateLabel}
                  </span>
                </div>
              </div>
              {exam.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant pl-1">
                  {exam.description}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1 pl-1 flex-wrap">
                {idx === 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => showToast('Membuka Kisi-kisi Resmi Ujian')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        description
                      </span>
                      <span>Kisi-kisi Resmi</span>
                    </button>
                    <Link
                      href="/materi"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        picture_as_pdf
                      </span>
                      <span>Modul PDF Bab 3</span>
                    </Link>
                    <Link
                      href="/tutor-ai"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md ml-auto font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px]">neurology</span>
                      <span>Tanya AI</span>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full pt-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Ruang: Lab Komputer C-201
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Menyiapkan bank soal latihan...')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        quiz
                      </span>
                      <span>Latihan Soal</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Monday Class Schedule Timeline */}
        <div ref={viewJadwalRef} className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                schedule
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Jadwal Kuliah Hari Ini (Senin)
              </h2>
            </div>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              3 Sesi Kuliah
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-code-sm font-semibold text-primary">
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.statusLabel && (
                      <span className="font-label-sm text-label-sm bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">
                        {item.statusLabel}
                      </span>
                    )}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      meeting_room
                    </span>
                    {item.room}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      {item.courseName}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        person
                      </span>
                      <span>{item.lecturer}</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-headline-sm text-headline-sm flex-shrink-0 bg-primary-fixed text-primary">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Task Checklist & Progress */}
        <div ref={viewTugasRef} className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                checklist
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Checklist Tugas &amp; Proyek
              </h2>
            </div>
            <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
              {completedTasksCount} Selesai / {totalTasksCount} Total
            </span>
          </div>

          {/* Task Progress Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Progres Tugas Mingguan</span>
              <span className="font-code-sm text-code-sm font-semibold text-primary">
                {taskPercentage}% Terselesaikan
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${taskPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Task Items */}
          {tasks.map((task) => {
            const isUrgent = task.priority === 'urgent';
            const isHigh = task.priority === 'high';

            return (
              <div
                key={task.id}
                className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-3 border-l-4 transition-all ${
                  isUrgent
                    ? 'border-error'
                    : isHigh
                    ? 'border-secondary'
                    : 'border-outline-variant/60'
                } ${task.isDone ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    aria-label={task.isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                      task.isDone
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] transition-opacity ${
                        task.isDone ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      check
                    </span>
                  </button>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase font-bold ${
                          isUrgent
                            ? 'bg-error-container text-on-error-container'
                            : isHigh
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {task.dueDateLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                          {task.courseName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          title="Hapus Tugas"
                          aria-label="Hapus Tugas"
                          className="text-on-surface-variant hover:text-error p-0.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <h3
                      className={`font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold ${
                        task.isDone ? 'line-through text-on-surface-variant' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container-high">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-code-sm text-code-sm">
                    {task.remainingTime ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] text-error">
                          alarm
                        </span>
                        <span>{task.remainingTime}</span>
                      </>
                    ) : (
                      <span>Diserahkan kemarin • Nilai 95/100</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Membuka pengumpulan tugas "${task.title}"`)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    <span>Kirim Tugas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed right-5 bottom-20 z-40">
        <button
          type="button"
          aria-label="Tambah Agenda Baru"
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all duration-300"
        >
          <span
            className={`material-symbols-outlined text-[28px] transition-transform duration-300 ${
              isFabOpen ? 'rotate-45' : 'rotate-0'
            }`}
          >
            add
          </span>
        </button>

        {/* FAB Radial / Popup Options */}
        {isFabOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col items-end gap-2.5 mb-2 w-max animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                setIsAddTaskModalOpen(true);
              }}
              className="flex items-center gap-2 bg-surface-container-lowest text-on-surface px-3 py-2 rounded-full shadow-lg hover:bg-surface-container-low transition-colors"
            >
              <span className="font-label-md text-label-md font-medium">
                Tambah Tugas / PR
              </span>
              <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">add_task</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                showToast('Fitur Tambah Jadwal Kelas segera hadir');
              }}
              className="flex items-center gap-2 bg-surface-container-lowest text-on-surface px-3 py-2 rounded-full shadow-lg hover:bg-surface-container-low transition-colors"
            >
              <span className="font-label-md text-label-md font-medium">
                Jadwal Kelas / Matkul
              </span>
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  calendar_add_on
                </span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
