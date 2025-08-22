import './ModalAddToCart.scss';

import { NavLink } from "react-router-dom";

interface ModalAddCartProps {
  successMessage: boolean;
  errorMessageCart: string;
  setErrorMessageCart: React.Dispatch<React.SetStateAction<string>>;
  setAddToCartModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddToCart = ({
  successMessage,
  setErrorMessageCart,
  errorMessageCart,
  setAddToCartModal,
}: ModalAddCartProps) => {
  const closeModal = () => {
    setAddToCartModal(false);
  };

  return (
    <div className="modal-message">
      <div className="modal-message-content">
        {successMessage ? (
          <>
            <img
              className="success-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/f/f6/OOjs_UI_icon_check-constructive.svg"
              alt=""
            />
            <strong className="succesful">Plant ajouté au panier</strong>
            <p className="success-message">{errorMessageCart}</p>
            <NavLink to="/cart" className="button-continue"
                onClick={() => {
                  closeModal();
                  setErrorMessageCart('');
                }}>
                voir mon panier
            </NavLink>
            <button type="button" className="button-continue return"
                onClick={() => {
                  closeModal();
                  setErrorMessageCart('');
                }}>
                ↩️ retour
            </button>
          </>
        ) : (
          <>
            <img className="error-icon" src="../src/assets/erreur.png" alt="" />
            <strong className="error">Oopss ... </strong>
            <p className="error-message">{errorMessageCart}</p>
            <button type="button" className="button-retry" onClick={closeModal}>
              Réessayer plus tard ...
            </button>
          </>
        )}
      </div>
    </div>
  );
};
4;
export default ModalAddToCart;
