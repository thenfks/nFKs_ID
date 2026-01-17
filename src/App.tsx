import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChooseAccount from './pages/ChooseAccount';
import Consent from './pages/Consent';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/account/Dashboard';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/customToast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route element={<AuthLayout />}>
              <Route path="/consent" element={<Consent />} />
            </Route>
          </Route>

          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/choose-account" element={<ChooseAccount />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
