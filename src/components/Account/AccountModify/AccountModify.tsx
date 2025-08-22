import { useEffect, useRef, useState } from 'react';
import './AccountModify.scss';
import type IUser from '../../../@types/user';
import axios from 'axios';

interface AccountProps {
  setAccountForm: React.Dispatch<React.SetStateAction<boolean>>;
  connectedUser: IUser;
  setConnectedUser: React.Dispatch<React.SetStateAction<IUser>>;
}

function AccountModify({ setAccountForm, connectedUser, setConnectedUser }: AccountProps) {
  const closeModal = () => {
    setAccountForm(false);
  };

  const token = localStorage.getItem('token');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    last_name: connectedUser.last_name,
    first_name: connectedUser.first_name,
    email: connectedUser.email,
    street: connectedUser.street,
    zip_code: connectedUser.zip_code.toString(),
    city: connectedUser.city,
    country: connectedUser.country,
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérification des mots de passe si nouveau mot de passe fourni
    if (passwordData.newPassword) {
      if (passwordData.newPassword.length < 8) {
        setPasswordError('Le mot de passe doit faire au moins 8 caractères');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Les mots de passe ne correspondent pas');
        return;
      }
    }

    const form = e.currentTarget;
    const formData1 = new FormData(form);
    const zipConv = String(formData1.get('zip_code'));

    const updatedUser: Partial<IUser> = {
      id_user: connectedUser.id_user,
      email: formData1.get('email') as string,
      first_name: formData1.get('first_name') as string,
      last_name: formData1.get('last_name') as string,
      street: formData1.get('street') as string,
      zip_code: zipConv,
      country: formData1.get('country') as string,
      city: formData1.get('city') as string,
    };

    // Ajout du nouveau mot de passe seulement si fourni
    if (passwordData.newPassword) {
      updatedUser.password = passwordData.newPassword;
    }

    try {
      const response = await axios.put(
        `/users/${connectedUser.id_user}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
   
      setConnectedUser(response.data);
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
      setPasswordError('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="modal-form-account">
      <div className="modal-form-account-content">
        <form onSubmit={handleSubmit}>
          <h1 className="h1-form">Modifier mes informations</h1>

          <div className="field-info">
            <label className="label" htmlFor="last_name">Nom</label>
            <input
              id="last_name"
              className="input"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              ref={nameInputRef}
            />
          </div>

          <div className="field-info">
            <label className="label" htmlFor="first_name">Prénom</label>
            <input
              id="first_name"
              className="input"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="field-info">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field-info">
            <label className="label" htmlFor="newPassword">
              Nouveau mot de passe (laisser vide pour ne pas changer)
            </label>
            <input
              id="password"
              className="input"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Nouveau mot de passe"
            />
          </div>

          {passwordData.newPassword && (
            <div className="field-info">
              <label className="label" htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </label>
              <input
                className="input"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmer le mot de passe"
              />
            </div>
          )}

          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}

          <h1 className="h1-form border-top">Mon adresse</h1>

          <div className="field-address">
            <label className="label" htmlFor="street">Rue</label>
            <input
              id="street"
              className="input"
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div>

          <div className="field-address">
            <label className="label" htmlFor="zip_code">Code postal</label>
            <input
              id="zip_code"
              className="input"
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
            />
          </div>

          <div className="field-address">
            <label className="label" htmlFor="city">Ville</label>
            <input
              id="city"
              className="input"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="field-address">
            <label className="label" htmlFor="country">Pays</label>
            <input
              id="country"
              className="input"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="control">
            <button
              className="button-cancel-form"
              type="button"
              onClick={closeModal}
            >
              Annuler
            </button>
            <button className="button-validate" type="submit">
              Modifier mes informations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountModify;
