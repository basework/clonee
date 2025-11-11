import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type SpinOutcome = 'WIN' | 'LOSE' | 'TRY_AGAIN'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHENTICATED', message: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ code: 'UNAUTHENTICATED', message: 'Invalid session' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { stake } = await req.json()

    if (!stake || ![50000, 100000, 150000].includes(stake)) {
      return new Response(
        JSON.stringify({ code: 'BAD_STAKE', message: 'Invalid stake amount. Must be 50000, 100000, or 150000' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get current balance
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    const currentBalance = Number(profile.balance) || 0

    // Validate balance
    if (currentBalance < stake) {
      return new Response(
        JSON.stringify({ code: 'INSUFFICIENT_BALANCE', message: 'Insufficient balance' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Server-side outcome determination
    // LOSE: 60%, TRY_AGAIN: 25%, WIN: 15%
    const random = Math.random() * 100
    let outcome: SpinOutcome
    let delta: number

    if (random < 60) {
      // LOSE - 60%
      outcome = 'LOSE'
      delta = -stake
    } else if (random < 85) {
      // TRY_AGAIN - 25%
      outcome = 'TRY_AGAIN'
      delta = -stake
    } else {
      // WIN - 15%
      outcome = 'WIN'
      delta = stake * 2 // stake + profit
    }

    const newBalance = currentBalance + delta

    // Update balance atomically
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id)

    if (updateError) throw updateError

    // Create transaction record
    const transactionType = 
      outcome === 'WIN' ? 'spin_win' : 
      outcome === 'LOSE' ? 'spin_lose' : 
      'spin_try_again'

    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        type: transactionType,
        amount: Math.abs(delta),
        description: `Spin ${outcome} - Stake: ₦${stake.toLocaleString()}`,
        status: 'completed',
      })
      .select()
      .single()

    if (txError) throw txError

    console.log(`Spin completed for user ${user.id}: ${outcome}, stake: ${stake}, delta: ${delta}, new balance: ${newBalance}`)

    return new Response(
      JSON.stringify({
        outcome,
        stake,
        delta,
        newBalance,
        txId: transaction.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Spin error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorId = crypto.randomUUID()
    console.error(`Error ID ${errorId}:`, error)
    
    return new Response(
      JSON.stringify({ 
        code: 'SPIN_FAILED', 
        message: errorMessage,
        errorId 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
