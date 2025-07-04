import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import AdminContextProvider from './context/AdminContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AdminContextProvider>
        <App />
      </AdminContextProvider>
    </BrowserRouter>
);