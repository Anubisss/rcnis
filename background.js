'use strict';

// CORS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetch(request.url, request.options)
    .then(res => res.json())
    .then(res => sendResponse(res))
    .catch(err => console.log('fetch error', err));
  return true;
});
