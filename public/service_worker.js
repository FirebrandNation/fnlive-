"use strict"

const cacheName = 'LGLOPTV_app-v1.0';
const staticAssets = [
  './',
  './index.html',
  './css/app.css',
  './css/materialize.css',
  './js/app.js',
  './js/materialize.js'
];


self.addEventListener('install', async (event)=>{
  console.log('install event');
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
	//intercept fetch events and servE thE cached content
	console.log('fetch event');
	const req = event.request;

	//determine whether the request is for a JSON file
	if (/.*(json)$/.test(req.url)) {

		//we want our cache to work in that any JSON calls should first go to the network and attempt to get the most up to date information
		//Then store that in the cache before returning. That way, if the network is down, we always have the most recent version available. We'll call this strategy networkFirst.
		event.respondWith(networkFirst(req));
	} else {
		event.respondWith(cacheFirst(req));
	}
});

//
async function networkFirst(req) {
	//We then try to fetch the request from the network.
	//If that succeeds, we put a clone of the response in our cache (requests can only be read once) and return the response.
	//If the network call fails, we return the latest cached version.
	const cache = await caches.open(cacheName);
		try {
			const fresh = await fetch(req);
		    cache.put(req, fresh.clone());
		    return fresh;
	    } catch (e) {
	    	const cachedResponse = await cache.match(req);
	    	return cachedResponse;
	    }
}


async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);

  //return either the cached response if there is one, or delegate the request to the network
  return cachedResponse || networkFirst(req);
}



