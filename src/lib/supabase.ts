import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://lrmimuuizlwdblbeoqki.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybWltdXVpemx3ZGJsYmVvcWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMDc4ODIsImV4cCI6MjA1MzU4Mzg4Mn0._K4yF6aOHMOblws1QUBrbNArPup3joAScFffhmEB6pg";


export const supabase = createClient(supabaseUrl, supabaseKey);