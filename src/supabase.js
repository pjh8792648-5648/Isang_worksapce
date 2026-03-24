import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dlxzqartjnevsihdqyrf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRseHpxYXJ0am5ldnNpaGRxeXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjEyNzIsImV4cCI6MjA40Tg5NzI3Mn0.Xol5jvsyyiL2OUki6QhCffxVDZLaOxYR_jRijgZ1Kfg'

export const supabase = createClient(supabaseUrl, supabaseKey)
