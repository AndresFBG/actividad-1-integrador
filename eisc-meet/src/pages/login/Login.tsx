// eisc-meet/src/pages/login/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import useAuthStore from '../../stores/useAuthStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login con Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Guardar información del usuario en el store
      setUser({
        email: user.email || '',
        displayName: user.displayName || 'Usuario',
        photoURL: user.photoURL || '',
        uid: user.uid
      });

      console.log('✅ Login exitoso:', user.email);
      
      // Redirigir al perfil
      navigate('/profile');
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Has cerrado la ventana de inicio de sesión');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('Dominio no autorizado. Configura localhost en Firebase Console');
      } else {
        setError('Error al iniciar sesión con Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page">
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Iniciar Sesión</h1>

        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            color: '#c00', 
            padding: '12px', 
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#f8f8f8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {loading ? 'Cargando...' : 'Continuar con Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;