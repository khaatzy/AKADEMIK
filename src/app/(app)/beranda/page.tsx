'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/data/profile';
import { getTasks, toggleTaskStatus } from '@/lib/data/tasks';
import { getDashboardSchedules } from '@/lib/data/schedules';
import { getExams } from '@/lib/data/exams';
import { Profile, TaskItem, ScheduleItem, ExamItem } from '@/types';

export default function BerandaPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [profData, tasksData, schData, examData] = await Promise.all([
        getProfile(),
        getTasks(),
        getDashboardSchedules(),
        getExams(),
      ]);
      setProfile(profData);
      setTasks(tasksData.slice(0, 4));
      setSchedules(schData);
      setExams(examData.slice(0, 2));
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleTask = async (id: string) => {
    const updated = await toggleTaskStatus(id);
    if (!updated) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    showToast(
      updated.isDone
        ? `Tugas "${updated.title}" ditandai selesai! 🎉`
        : `Tugas "${updated.title}" dikembalikan ke daftar aktif.`
    );
  };

  // Calculate dynamic progress based on tasks
  const completedCount = tasks.filter((t) => t.isDone).length;
  const totalCount = tasks.length || 4;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col w-full px-margin pb-space-2xl gap-space-xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2 font-label-md text-label-md transition-all animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Greeting & Daily Progress Hero */}
      <section className="flex flex-col gap-space-md pt-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                Halo, {profile?.name || 'Maya'}!
              </span>
              <span className="text-2xl animate-bounce">☀️</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Fokus tenang, progres gemilang hari ini.
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high text-primary flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">
              local_fire_department
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">
                verified
              </span>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                Target Belajar Harian
              </span>
            </div>
            <span className="font-code-sm text-code-sm text-primary font-medium">
              {completedCount}/{totalCount} Selesai ({percentage}%)
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant z-10">
            {completedCount === totalCount
              ? 'Luar biasa! Semua target belajarmu hari ini tercapai!'
              : `${totalCount - completedCount} langkah lagi menuju target belajarmu hari ini!`}
          </p>
          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden z-10 mt-1">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Quick Action Strip */}
      <section className="flex flex-col gap-space-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-bold">
          Aksi Cepat
        </span>
        <div className="grid grid-cols-3 gap-2.5">
          {/* Tanya Tutor AI */}
          <Link
            href="/tutor-ai"
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container hover:bg-secondary-fixed/50 transition-all text-center gap-1.5 shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">neurology</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface leading-tight font-medium">
              Tanya Tutor AI
            </span>
          </Link>

          {/* Upload Catatan Baru */}
          <Link
            href="/materi"
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container hover:bg-tertiary-fixed/60 transition-all text-center gap-1.5 shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">upload_file</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface leading-tight font-medium">
              Upload Catatan
            </span>
          </Link>

          {/* Mulai Timer Belajar */}
          <button
            type="button"
            onClick={() => showToast('Timer Fokus Pomodoro 25 menit dimulai! Semangat belajar.')}
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container hover:bg-primary-fixed/60 transition-all text-center gap-1.5 shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface leading-tight font-medium">
              Timer Fokus
            </span>
          </button>
        </div>
      </section>

      {/* AI Recommendation Banner (Summarized PDF) */}
      <section className="flex flex-col">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-lg flex flex-col gap-space-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Sintesis AI Terbaru
            </span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              Kemarin, 21:40
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Rangkuman: Bab 4 Termodinamika.pdf
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              AI telah mengekstrak 12 konsep esensial, 5 formula kunci siklus Carnot, dan menyusun 8 kartu latihan kilat untukmu.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/materi"
              className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-transform hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Baca Ringkasan (4 Mnt)
            </Link>
            <button
              type="button"
              onClick={() => showToast('8 Kartu latihan Termodinamika disimpan ke koleksi!')}
              aria-label="Simpan kartu flashcard"
              className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">style</span>
            </button>
          </div>
        </div>
      </section>

      {/* Exam Countdown Widget */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              event_upcoming
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Pengingat Ujian Mendatang
            </h2>
          </div>
          <Link
            href="/jadwal"
            className="font-label-md text-label-md text-primary hover:underline font-semibold"
          >
            Semua (4)
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-space-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${
                    exam.daysLeftLabel === 'H-2'
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="font-label-sm text-label-sm uppercase tracking-wide leading-none">
                    Hari
                  </span>
                  <span className="font-headline-md text-headline-md font-bold leading-tight">
                    {exam.daysLeftLabel}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                      {exam.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                      {exam.priorityLabel}
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant truncate">
                      {exam.dateLabel}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push('/jadwal')}
                aria-label={`Review materi ${exam.title}`}
                className="w-9 h-9 rounded-full bg-surface-container text-primary flex items-center justify-center flex-shrink-0 hover:bg-primary-fixed transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Class Schedule */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              calendar_today
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Jadwal Kelas Hari Ini
            </h2>
          </div>
          <span className="font-code-sm text-code-sm text-on-surface-variant">
            {schedules.length} Sesi
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {schedules.map((sch) => {
            const isCompleted = sch.status === 'completed';
            const isInProgress = sch.status === 'in_progress';

            return (
              <div
                key={sch.id}
                className={`flex items-start gap-3 p-space-md rounded-xl shadow-sm transition-all ${
                  isCompleted
                    ? 'bg-surface-container-lowest opacity-80'
                    : isInProgress
                    ? 'bg-surface-container-low shadow-md relative overflow-hidden'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <div className="flex flex-col items-center pt-0.5 flex-shrink-0 w-14">
                  <span
                    className={`font-code-sm text-code-sm font-medium ${
                      isInProgress ? 'text-primary font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {sch.startTime}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant/70">
                    {sch.endTime}
                  </span>
                </div>
                <div
                  className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${
                    isInProgress
                      ? 'bg-primary'
                      : isCompleted
                      ? 'bg-surface-container-highest'
                      : 'bg-secondary'
                  }`}
                ></div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                      {sch.courseName}
                    </span>
                    {isCompleted && (
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                    )}
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-primary animate-ping"></span>
                        Berlangsung
                      </span>
                    )}
                    {!isCompleted && !isInProgress && (
                      <span className="font-code-sm text-code-sm text-secondary font-medium">
                        Nanti Siang
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {sch.room} • {sch.lecturer}
                  </span>
                  <div className="mt-2">
                    {isInProgress ? (
                      <button
                        type="button"
                        onClick={() => router.push('/materi')}
                        className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          open_in_new
                        </span>
                        {sch.actionText}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => router.push('/materi')}
                        className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isCompleted ? 'folder' : 'download'}
                        </span>
                        {sch.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Priority Tasks & Interactive Checklist */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              task_alt
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Tugas Prioritas Hari Ini
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push('/jadwal')}
            className="font-label-md text-label-md text-primary flex items-center gap-0.5 font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Tambah
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm gap-space-sm transition-all ${
                task.isDone ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  aria-label={task.isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    task.isDone
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-primary hover:bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-opacity ${
                      task.isDone ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    check
                  </span>
                </button>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-body-md text-body-md text-on-surface font-medium truncate ${
                      task.isDone ? 'line-through text-on-surface-variant' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.isDone ? (
                      <span className="font-code-sm text-code-sm text-on-surface-variant">
                        Selesai {task.completedAt || 'Hari ini'}
                      </span>
                    ) : (
                      <>
                        <span
                          className={`font-code-sm text-code-sm font-medium flex items-center gap-0.5 ${
                            task.priority === 'urgent' ? 'text-error' : 'text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">alarm</span>
                          {task.dueTime}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                            task.priority === 'urgent'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                          }`}
                        >
                          {task.priorityLabel}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Menu opsi tugas"
                onClick={() => showToast(`Pilihan untuk "${task.title}"`)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Motivation Card */}
      <section className="flex flex-col">
        <div className="p-space-lg rounded-xl bg-surface-container flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">psychology_alt</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">
              Tips Mindful Hari Ini
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
              &ldquo;Istirahat 5 menit setelah 25 menit sesi fokus membantu konsolidasi memori di hippocampus secara optimal.&rdquo;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
