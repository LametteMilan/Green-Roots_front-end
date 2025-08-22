import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Login } from '../../auth/Login';
import { SignUp } from '../../auth/SignUp'; // Import du nouveau composant
import './HeaderMenu.scss';

interface LoginProps {
  setmenuBurger: React.Dispatch<React.SetStateAction<boolean>>;
}

function HeaderMenu({ setmenuBurger }: LoginProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // true pour login, false pour signup
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Ne pas fermer si on clique sur la barre de scroll
    const isScrollbar = event.clientX > document.documentElement.offsetWidth;
    
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      // Vérifier si le clic est en dehors de la modale ET pas sur la barre de scroll
      if (!isScrollbar) {
        setShowAuthModal(false);
      }
    }
  };

  if (showAuthModal) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showAuthModal]);

  const handleLogout = () => {
    logout();
    setmenuBurger(false);
    navigate('/');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setmenuBurger(false);
  };

  const toggleAuthForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="modal-menu">
      <div className="modal-content-menu">
        <button
          className="button-close-menu"
          type="button"
          onClick={() => setmenuBurger(false)}
        >
          x
        </button>
        <ul className="modal-content-menu-ul">
          <NavLink className="link-menu" to="/" onClick={() => setmenuBurger(false)}>
            <li className="modal-content-menu-li">Accueil</li>
          </NavLink>
          <NavLink className="link-menu" to="/products" onClick={() => setmenuBurger(false)}>
            <li className="modal-content-menu-li">Nos Plants</li>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink className="link-menu" to="/account" onClick={() => setmenuBurger(false)}>
                <li className="modal-content-menu-li">Mon compte</li>
              </NavLink>
              <NavLink className="link-menu" to="/cart" onClick={() => setmenuBurger(false)}>
                <li className="modal-content-menu-li">Mon Panier</li>
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink className="link-menu" to="/dashboard" onClick={() => setmenuBurger(false)}>
                  <li className="modal-content-menu-li">Dashboard</li>
                </NavLink>
              )}
              <button
                type="button"
                className="modal-content-menu-li button-sign"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                className="modal-content-menu-li button-sign"
                onClick={() => {
                  setShowAuthModal(true);
                  setShowLogin(true);
                }}
              >
                Se connecter/s'inscrire
              </button>
              {showAuthModal && (
                <div className="auth-modal-container">
                  <div ref={modalRef} className="auth-modal-content">
                    {showLogin ? (
                      <>
                        <Login onSuccess={handleAuthSuccess} />
                        <div className="auth-switch">
                          <span>Pas encore de compte ? </span>
                          <button 
                            type="button" 
                            className="switch-button"
                            onClick={toggleAuthForm}
                          >
                            S'inscrire
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <SignUp onSuccess={handleAuthSuccess} />
                        <div className="auth-switch">
                          <span>Déjà un compte ? </span>
                          <button 
                            type="button" 
                            className="switch-button"
                            onClick={toggleAuthForm}
                          >
                            Se connecter
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default HeaderMenu;