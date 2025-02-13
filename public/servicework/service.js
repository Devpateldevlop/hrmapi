self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("v1").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/manifest.json",
          
        ]);
      })
    );
  });
  self.addEventListener('install', function(event) {
    console.log('Service Worker installed');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', function(event) {
    console.log('Service Worker activated');
    event.waitUntil(clients.claim()); 
  });
  
  
  self.addEventListener("activate", (event) => {
    const cacheWhitelist = ["v1"];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  
  self.addEventListener("sync", function (event) {
  
  
    debugger;
  
    if (event.tag === "mySyncTag") {
      setInterval(() => {
        console.log('Sync event triggered!');
        self.addEventListener('install', function(event) {
          console.log('Service Worker installed');
          self.skipWaiting();
        });
        
        self.addEventListener('activate', function(event) {
          console.log('Service Worker activated');
          event.waitUntil(clients.claim()); 
        });
        
      }, 3000);
      event.waitUntil(this.scheduleNotification(11, 29));
    }
  });
  
  function scheduleNotification(hour, minute) {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hour, minute, 0, 0);
  
    if (targetTime <= now) {
      targetTime.setDate(now.getDate() + 1);
    }
  
    const timeDifference = targetTime - now;
  

  }
  
  function syncData() {
    
    console.log("Syncing data in the background...");
  
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Data synced successfully");
        resolve();
      }, 2000);
    });
>>>>>>> 7f10fb3e (deep59)
  }
  
  self.addEventListener("fetch", function (event) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
    
  
        return response || fetch(event.request);
      })
    );
  });
  