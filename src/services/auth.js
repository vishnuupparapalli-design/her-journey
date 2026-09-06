import { supabase } from './supabaseClient';

// Helper to convert names like "My Girlfriend" into "my-girlfriend"
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Signs her in using her Display Name + Passphrase.
 * If she is visiting for the first time, it automatically registers her!
 */
export async function authenticateWithPassphrase(displayName, passphrase) {
  const cleanName = slugify(displayName);
  const internalEmail = `${cleanName}@her-journey.internal`;

  if (!displayName || displayName.trim().length < 2) {
    throw new Error('Please enter a name with at least 2 letters.');
  }

  if (!passphrase || passphrase.length < 6) {
    throw new Error('Please enter a memorable passphrase of at least 6 characters.');
  }

  // 1. First, attempt to sign in (in case she already has an account)
  let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: internalEmail,
    password: passphrase,
  });

  // 2. If user doesn't exist yet, sign her up!
  if (signInError && signInError.message.includes('Invalid login credentials')) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: internalEmail,
      password: passphrase,
    });

    if (signUpError) {
      throw signUpError;
    }

    signInData = signUpData;
  } else if (signInError) {
    throw signInError;
  }

  const user = signInData.user;
  if (!user) throw new Error('Authentication failed. Please try again.');

  // 3. Ensure her record exists in the public.respondents table
  const { error: respondentError } = await supabase
    .from('respondents')
    .upsert(
      {
        id: user.id,
        display_name: displayName.trim(),
        last_active_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (respondentError) {
    console.error('Error saving respondent profile:', respondentError);
  }

  return { user, displayName: displayName.trim() };
}

/**
 * Checks if she already has an active session in this browser.
 */
export async function getCurrentRespondent() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: respondent } = await supabase
    .from('respondents')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    user: session.user,
    displayName: respondent?.display_name || 'Traveler',
  };
}

/**
 * Signs out of the current session
 */
export async function signOutRespondent() {
  await supabase.auth.signOut();
}