import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Somente aplicar em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const response = NextResponse.next();
    
    // Adicionar headers para prevenir cache
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Adicionar timestamp único para cada resposta
    response.headers.set('X-No-Cache', Date.now().toString());
    
    return response;
  }
  
  return NextResponse.next();
}

// Aplicar o middleware a todas as rotas
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
