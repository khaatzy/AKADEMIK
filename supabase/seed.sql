-- ==========================================================
-- STUDIKA ACADEMIC COMPANION - SEED DATA SCRIPT
-- ==========================================================
-- Catatan: Script ini dapat dijalankan setelah pengguna terdaftar
-- atau menggunakan demo auth UUID di lingkungan pengembangan lokal.

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  course_kalkulus_id uuid := '10000000-0000-0000-0000-000000000001'::uuid;
  course_strukdat_id uuid := '10000000-0000-0000-0000-000000000002'::uuid;
  course_web_id uuid      := '10000000-0000-0000-0000-000000000003'::uuid;
  course_fisika_id uuid   := '10000000-0000-0000-0000-000000000004'::uuid;
  session_ai_id uuid      := '20000000-0000-0000-0000-000000000001'::uuid;
begin
  -- 1. Create demo user in auth.users if in local testing
  if not exists (select 1 from auth.users where id = demo_user_id) then
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      demo_user_id,
      'authenticated',
      'authenticated',
      'mahasiswa@kampus.ac.id',
      crypt('Studika2026!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Samiaji Rahadian","nim":"220411100042","program_studi":"Teknik Informatika","semester":4}',
      now(),
      now()
    );
  end if;

  -- 2. Upsert profile
  insert into public.profiles (id, full_name, avatar_path, nim, program_studi, semester)
  values (
    demo_user_id,
    'Samiaji Rahadian',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    '220411100042',
    'Teknik Informatika',
    4
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    nim = excluded.nim;

  -- 3. Upsert courses
  insert into public.courses (id, user_id, name, code, lecturer, color)
  values
    (course_kalkulus_id, demo_user_id, 'Kalkulus Multivariabel', 'MAT-201', 'Dr. Ir. Hendra Prasetyo, M.T.', '#D97706'),
    (course_strukdat_id, demo_user_id, 'Struktur Data & Algoritma', 'IF-204', 'Siti Rahmawati, S.Kom., M.Cs.', '#4F46E5'),
    (course_web_id, demo_user_id, 'Pemrograman Web Lanjut', 'IF-301', 'Bambang Sudarsono, M.T.', '#059669'),
    (course_fisika_id, demo_user_id, 'Fisika Dasar II', 'FIS-102', 'Prof. Dr. Agus Salim', '#7C3AED')
  on conflict (id) do nothing;

  -- 4. Upsert schedules
  insert into public.schedules (user_id, course_id, day_of_week, start_time, end_time, room)
  values
    (demo_user_id, course_kalkulus_id, 'Senin', '08:00', '10:30', 'Gedung Kuliah Bersama R.302'),
    (demo_user_id, course_strukdat_id, 'Senin', '13:00', '15:30', 'Lab Komputer C-201'),
    (demo_user_id, course_web_id, 'Rabu', '09:00', '11:30', 'Lab Rekayasa Perangkat Lunak'),
    (demo_user_id, course_fisika_id, 'Kamis', '10:00', '12:00', 'Ruang Teori Fisika 104');

  -- 5. Upsert tasks
  insert into public.tasks (user_id, course_id, title, description, due_at, priority, is_done)
  values
    (demo_user_id, course_kalkulus_id, 'Resume Jurnal Turunan Parsial & Gradien', 'Buat rangkuman maksimal 3 halaman format PDF bersumber dari 2 jurnal internasional terakreditasi.', now() + interval '2 days', 'high', false),
    (demo_user_id, course_strukdat_id, 'Implementasi Self-Balancing AVL Tree', 'Tulis kode Python / C++ disertai benchmark rotasi kiri-kanan serta pengujian 10.000 nodes.', now() + interval '1 day', 'urgent', false),
    (demo_user_id, course_web_id, 'Desain Wireframe UI/UX Aplikasi Akademik', 'Selesaikan 5 layar antarmuka di Figma dengan prinsip Warm Editorial Focus.', now() + interval '4 days', 'medium', false),
    (demo_user_id, course_fisika_id, 'Laporan Akhir Praktikum Osilasi Harmonik Teredam', 'Unggah tabel pengamatan regresi linier dan grafik respon amplitudo terhadap waktu.', now() - interval '1 day', 'low', true);

  -- 6. Upsert exams
  insert into public.exams (user_id, course_id, title, scheduled_at, room, countdown_label)
  values
    (demo_user_id, course_kalkulus_id, 'Ujian Tengah Semester: Kalkulus Multivariabel', now() + interval '72 hours', 'Auditorium Barat Lt. 2', '72 jam lagi');

  -- 7. Upsert files (Vault)
  insert into public.files (user_id, course_id, name, storage_path, mime_type, size_bytes, kind)
  values
    (demo_user_id, course_kalkulus_id, 'Diktat_Lengkap_Kalkulus_Vektor_Bab4.pdf', demo_user_id || '/diktat_kalkulus.pdf', 'application/pdf', 3879731, 'document'),
    (demo_user_id, course_strukdat_id, 'Catatan_Papan_Tulis_AVL_Rotation.png', demo_user_id || '/catatan_avl.png', 'image/png', 2149580, 'image'),
    (demo_user_id, course_web_id, 'Rangkuman_Nextjs15_ServerActions.docx', demo_user_id || '/rangkuman_nextjs.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1450280, 'document');

  -- 8. Upsert chat sessions & messages
  insert into public.chat_sessions (id, user_id, title)
  values (session_ai_id, demo_user_id, 'Diskusi Vektor Gradien & Matriks Jacobian')
  on conflict (id) do nothing;

  insert into public.chat_messages (session_id, user_id, role, content)
  values
    (session_ai_id, demo_user_id, 'user', 'Jelaskan perbedaan mendasar antara metode eliminasi Gauss-Jordan dan invers matriks untuk menyelesaikan SPL 3 variabel!'),
    (session_ai_id, demo_user_id, 'assistant', 'Metode Gauss-Jordan mengubah matriks augmented menjadi bentuk eselon baris tereduksi (RREF) dengan kompleksitas O(n^3/3), sedangkan metode invers matriks memerlukan komputasi A^(-1) yang memakan biaya komputasi O(n^3) dan rentan terhadap ketidakstabilan numerik jika determinan mendekati nol.')
  on conflict do nothing;

end $$;
