import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dlxzqartjnevsihdqyrf.supabase.co'
const supabaseKey = 'sb_publishable_vpoRKTgn2ZsaZ0Fx19yMiA_pGnipxYd'

export const supabase = createClient(supabaseUrl, supabaseKey)
