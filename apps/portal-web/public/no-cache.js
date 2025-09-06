// Script para limpar cache do navegador
(function() {
  // Adiciona timestamp às URLs para evitar cache
  function addTimestampToUrl(url) {
    // Não modificar URLs de API importantes ou URLs de Supabase
    if (typeof url === 'string' && 
        (url.includes('supabase') || 
         url.includes('auth') || 
         url.includes('.supabase.co'))) {
      return url;
    }
    
    const separator = url.indexOf('?') !== -1 ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
  }

  // Interceptar todas as requisições de fetch e adicionar timestamp
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string') {
      url = addTimestampToUrl(url);
    } else if (url instanceof Request) {
      // Não modificar requisições para Supabase
      if (!url.url.includes('supabase') && 
          !url.url.includes('auth') && 
          !url.url.includes('.supabase.co')) {
        url = new Request(addTimestampToUrl(url.url), url);
      }
    }
    return originalFetch.call(this, url, options);
  };

  // Limpar cache local, exceto para armazenamentos essenciais
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        // Não deletar caches relacionados à autenticação
        if (!cacheName.includes('auth') && !cacheName.includes('supabase')) {
          caches.delete(cacheName);
          console.log('Cache deletado:', cacheName);
        }
      });
    });
  }

  console.log('Script anti-cache inicializado com proteção para API:', new Date().toISOString());
})();
