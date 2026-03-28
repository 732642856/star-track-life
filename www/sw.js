/**
 * 紫微斗数角色设计工具 - Service Worker
 * 支持离线使用
 */

const CACHE_NAME = 'ziwei-character-design-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// 安装时缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('缓存失败:', err);
      })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，直接返回
        if (response) {
          return response;
        }
        
        // 否则发起网络请求
        return fetch(event.request)
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应（因为响应流只能读取一次）
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // 网络请求失败时，尝试返回离线页面
            console.log('网络请求失败，使用离线缓存');
          });
      })
  );
});
