import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Disable caching for this application
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

// Add cache-busting timestamp to prevent caching
const timestamp = new Date().getTime();
console.log(`App loaded at: ${new Date().toISOString()} (timestamp: ${timestamp})`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
