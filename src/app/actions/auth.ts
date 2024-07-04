// import { createSession } from '@/app/lib/session';

import { createSession, deleteSession } from '@/lib/auth/session';
import { FormState } from '@/lib/definition/signup';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API

  // Current steps:
  // 4. Create user session
  // await createSession(user.id);
  // 5. Redirect user
  redirect('/profile');
}

export async function logout() {
  deleteSession();
  redirect('/login');
}
