import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if we have a test user in cookies (for test authentication)
  const testUserCookie = request.cookies.get('test_user')?.value
  let testUser = null;
  
  if (testUserCookie) {
    try {
      testUser = JSON.parse(testUserCookie);
      console.log('Middleware: Test user found in cookie:', testUser.id);
    } catch (e) {
      console.log('Middleware: Invalid test user cookie, ignoring');
    }
  }
  
  console.log('Middleware check:', {
    pathname: request.nextUrl.pathname,
    hasUser: !!user,
    hasTestUser: !!testUser,
    userEmail: user?.email || testUser?.email,
    testUserId: testUser?.id
  });

  // Allow access if we have either a real user OR a test user
  const hasValidAuth = !!user || !!testUser;
  
  if (
    !hasValidAuth &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/api')
  ) {
    console.log('Middleware: Redirecting to login - no valid auth found');
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  console.log('Middleware: Access granted for', request.nextUrl.pathname);

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}
