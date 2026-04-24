import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rutas públicas
  if (request.nextUrl.pathname.startsWith('/login')) {
    return supabaseResponse
  }

  // Sin sesión → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Obtener rol del perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role
  const path = request.nextUrl.pathname

  // Si no hay rol o el rol no coincide con la sección, redirigir a la sección correcta
  // pero SOLO si estamos intentando acceder a una sección protegida.
  
  if (path.startsWith('/trabajador')) {
    if (role === 'administrador') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    if (role !== 'trabajador') {
      // Si no es trabajador y no es admin, quizá perfil incompleto o error
      // Para evitar bucles, solo redirigimos si no estamos ya en login
      return supabaseResponse
    }
  }

  if (path.startsWith('/admin')) {
    if (role === 'trabajador') {
      return NextResponse.redirect(new URL('/trabajador/dashboard', request.url))
    }
    if (role !== 'administrador') {
      return supabaseResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts).*)'],
}
