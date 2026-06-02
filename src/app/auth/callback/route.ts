import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth exchange error:", error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth-callback-failed`);
    }
  }

  // URL to redirect to after successful sign in
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
