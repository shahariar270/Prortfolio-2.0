import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import './assets/styles/editorial.scss';
import { router } from './route';
import { store } from './store';
import './assets/icons/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
