import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../icons/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Appel API sécurisé au backend
      // Simulation login pour le moment - ACCEPTE N'IMPORTE QUEL EMAIL/MDP
      if (email && password) {
        // Déterminer le rôle basé sur l'email (pour démo)
        let userRole = 'admin';
        let redirectPath = '/dashboard';
        
        if (email.includes('agent') || email.toLowerCase().startsWith('agent')) {
          userRole = 'agent';
          redirectPath = '/agent';
        }
        
        // Stockage sécurisé du token (sera remplacé par une vraie auth)
        localStorage.setItem('authToken', 'token_' + Date.now());
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', email);
        
        // Redirection immédiate avec rechargement
        window.location.href = redirectPath;
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5F5F0] flex flex-col items-center justify-center p-4">
      {/* Subtle Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gray-100/40 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logo} 
            alt="Yes Karangue" 
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
            <p className="text-gray-600 text-sm">Accédez à votre espace admin</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD]/50 focus:border-[#5B9BAD] transition-all outline-none text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B9BAD]/50 focus:border-[#5B9BAD] transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#5B9BAD] focus:ring-[#5B9BAD] focus:ring-offset-0 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Se souvenir de moi
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-[#5B9BAD] hover:text-[#4A8999] font-medium transition"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5B9BAD] hover:bg-[#4A8999] text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Support Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Besoin d'aide?{' '}
              <a
                href="#"
                className="text-[#5B9BAD] hover:text-[#4A8999] font-medium transition"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2025 YES KARANGUE. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
