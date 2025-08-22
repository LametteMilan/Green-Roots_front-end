import { useEffect, useState } from 'react';
import axiosClient from '../../axiosClient';
import type IUser from '../../@types/user';
import { NavLink } from 'react-router-dom';
import Header from '../HeaderAll/Header/Header';
import Footer from '../Footer/Footer';
import AccountModify from './AccountModify/AccountModify';

function Account() {
  const [accountForm, setAccountForm] = useState(false);
  const [connectedUser, setConnectedUser] = useState<IUser>({
    id_user: 0,
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    user_role: '',
    street: '',
    zip_code: '',
    country: '',
    city: '',
  });

  // Suppression de la récupération du token localStorage
  // const token = localStorage.getItem('token');
  // const decoded = JSON.parse(atob(token!.split('.')[1]));

  // Remplacer par la récupération du user via API backend (cookie JWT envoyé automatiquement)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosClient.get('/users/profile');
        setConnectedUser(response.data);
      } catch (error) {
        console.error('Erreur chargement profil utilisateur:', error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <>
      <Header />
      <div className="account">
        {accountForm && (
          <AccountModify
            setAccountForm={setAccountForm}
            connectedUser={connectedUser}
            setConnectedUser={setConnectedUser}
          />
        )}
        <hgroup>
          <h1>Votre compte</h1>
          <p>
            Connecté en tant que :{' '}
            <strong>
              {connectedUser?.first_name} {connectedUser?.last_name}
            </strong>
          </p>
        </hgroup>

        <div className="account-content">
          <div className="account-content-menu">
            <nav>
              <NavLink to="/account">Informations personnelles</NavLink>
              <NavLink to="/account/orders">Mes Commandes</NavLink>
              <NavLink to="/account/bookmarks">Mes Favoris</NavLink>
            </nav>
          </div>

          <div className="account-content-info">
            <section className="account-section">
              <h2>Informations personnelles</h2>
              <p className="info-p">
                <strong>Nom :</strong> {connectedUser?.last_name}
              </p>
              <p className="info-p">
                <strong>Prénom :</strong> {connectedUser?.first_name}
              </p>
              <p className="info-p">
                <strong>Email :</strong> {connectedUser?.email}
              </p>
              <p className="info-p">
                <strong>Mot de passe :</strong> ********
              </p>
            </section>

            <section className="account-content-info-bar">
              <h2>Adresse :</h2>
              <p className="info-p">
                <strong>Rue :</strong> {connectedUser?.street}
              </p>
              <p className="info-p">
                <strong>Code postal :</strong> {connectedUser?.zip_code}
              </p>
              <p className="info-p">
                <strong>Ville :</strong>
                {connectedUser?.city}
              </p>
              <p className="info-p">
                <strong>Pays :</strong>
                {connectedUser?.country}
              </p>
            </section>

            <div className="account-buttonContainer">
              <button
                type="button"
                className="account-button1"
                onClick={() => {
                  setAccountForm(true);
                }}
              >
                Modifier mes informations
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Account;
