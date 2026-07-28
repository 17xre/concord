const CACHE_NAME = 'concord-travel-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './app-icon.png',
    './header-banner.jpeg',
    './footer-banner.jpeg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Montserrat:wght@400;600;700;800;900&display=swap'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية مؤقتاً للعمل بدون إنترنت
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// تفعيل الخدمة وحذف الكاش القديم إن وجد
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// استراتيجية الجلب: البحث في الكاش أولاً، ثم الجلب من الشبكة
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // العودة بالملف المخزن مؤقتاً إذا وجد، أو استكماله من الشبكة
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
