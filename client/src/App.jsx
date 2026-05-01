import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RegisterClient from './pages/RegisterClient';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Consent from './pages/Consent';

function Navbar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/register-app', label: 'Register app' },
    { to: '/login', label: 'Sign in' },
    { to: '/signup', label: 'Create account' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-white text-black font-bold text-xs rounded-md">R</span>
          <span className="text-sm font-semibold text-white">Rachit's Auth</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                location.pathname === to
                  ? 'text-white bg-white/10'
                  : 'text-muted hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-app" element={<RegisterClient />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/consent" element={<Consent />} />
      </Routes>
    </BrowserRouter>
  );
}
