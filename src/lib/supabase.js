/*
  SQL for deleted_qap_reports table:

  CREATE TABLE IF NOT EXISTS deleted_qap_reports (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    project_no TEXT,
    project_name TEXT,
    customer TEXT,
    report_type TEXT,
    status TEXT,
    data JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE deleted_qap_reports DISABLE ROW LEVEL SECURITY;
*/

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://omymhtcuzxmxejvdkhor.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teW1odGN1enhteGVqdmRraG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MjQ3MjksImV4cCI6MjA5NDAwMDcyOX0.d0u1tR3Hr8ovrepW1_EQfkZ6E729gseSNHqCB31ryIc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
