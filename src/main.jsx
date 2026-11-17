import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { PanierProvider } from '@/contexts/PanierContext.jsx';
import App from '@/App.jsx';
import './index.css';

// Le point d'entrée : React prend la main sur <div id="root"> d'index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PanierProvider>
          <App />
        </PanierProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
