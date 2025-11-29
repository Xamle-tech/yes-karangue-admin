import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-[#305669] to-[#1F3A4A] mb-4">
            <span className="text-2xl font-bold text-white">YK</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Yes Karangue</h1>
          <p className="text-gray-600 mt-2">Tableau de bord administrateur</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yeskarangue.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305669] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#305669] focus:ring-[#305669]"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-[#305669] hover:text-[#1F3A4A] font-medium"
              >
                Mot de passe oublié?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#305669] to-[#1F3A4A] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Besoin d'aide?{' '}
              <a
                href="#"
                className="text-[#305669] hover:text-[#1F3A4A] font-medium"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>

        {/* Role Hints */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">💡 Astuce de connexion</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• Email contenant <strong>"agent"</strong> → Espace Agent (enregistrement colis)</p>
            <p>• Autres emails → Espace Admin (gestion complète)</p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>🔒 Sécurité:</strong> Connexion HTTPS - Toutes les données sont
            chiffrées en transit.
          </p>
        </div>
      </div>
    </div>
  );
}
