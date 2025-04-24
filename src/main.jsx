import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
// import "react-image-gallery/styles/css/image-gallery.css";
// import '@fortawesome/fontawesome-free/js/all.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../src/components/Loading.jsx"
import MenuContext from './pages/Website/Context/contextMenu.jsx';
import WindowSizeContext from './pages/Website/Context/contextWindowSize.jsx';
import MarginLeftContext from './pages/Website/Context/marginContextj.jsx';
import CartContext from './pages/Website/Context/cart.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarginLeftContext>
      <WindowSizeContext>
        <MenuContext>
          <CartContext>
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </CartContext>
        </MenuContext>
      </WindowSizeContext>
    </MarginLeftContext>
  </StrictMode>,
)
