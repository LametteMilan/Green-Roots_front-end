import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './Landing.css';
import type IProducts from '../../@types/products';
import { useAuth } from '../../contexts/AuthContext';
// --- Je remplace l'import axios classique par l'instance axiosClient configurée ---
import axiosClient from '../../axiosClient';  // <-- instance axios avec withCredentials: true
import { useEffect, useState } from 'react';
import type ICart from '../../@types/cart';
import ModalAddToCart from '../ModalAddToCart/ModalAddToCart';
// --- Import du hook qui récupère le token CSRF ---
import { useCsrfToken } from '../../hooks/useCsrfToken';

interface ProductsProps {
  allProducts: IProducts[];
  cart: ICart | null;
  setCart: React.Dispatch<React.SetStateAction<ICart | null>>;
}

function Landing({ allProducts, cart, setCart }: ProductsProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const quantityDefault = 1;

  // --- Suppression du token JWT stocké localement car on utilise le cookie httpOnly---
  // const token = localStorage.getItem('token'); // 

  const [addToCartModal, setAddToCartModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessageCart, setErrorMessageCart] = useState('');
  const [addCartCo, setAddCartCo] = useState(false);

  const lastThreeProducts = allProducts.slice(-3);
  console.log('Derniers produits :', lastThreeProducts);

  const { isAuthenticated } = useAuth();
  console.log('Utilisateur authentifié :', isAuthenticated);

  // --- Récupération du token CSRF via le hook fourni ---
  const csrfToken = useCsrfToken();

  const fetchCart = async () => {
    try {
      console.log("Appel à l'API pour récupérer le panier...");
      // Utilisation d'axiosClient qui envoie automatiquement les cookies (JWT)
      const response = await axiosClient.get(`${base_url}/carts`);
      console.log("Réponse de l'API panier :", response.data);
      setCart(response.data);
      console.log('Panier mis dans le state :', response.data);
    } catch (e) {
      console.error('Erreur API panier :', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Appel de fetchCart');
      fetchCart();
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: number) => {
    if (!cart) {
      console.warn("Panier non chargé, impossible d'ajouter au panier.");
      return;
    }

    try {
      // J'impose le token CSRF dans le header comme le backend le demande
      if (!csrfToken) {
        throw new Error('Token CSRF manquant, impossible d’ajouter au panier');
      }

      const response = await axiosClient.post(
        `${base_url}/product-carts`,
        {
          id_cart: cart.id_cart,
          id_product: productId,
          product_quantity: quantityDefault,
        },
        {
          headers: {
            'x-csrf-token': csrfToken,  // <-- J'ajoute le token CSRF dans l'en-tête
          },
        }
      );

      console.log('Produit ajouté au panier', response.data);
      setErrorMessageCart(`${response.data}`);
      setSuccessMessage(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      setErrorMessageCart("Erreur lors de l'ajout au panier");
      setSuccessMessage(false);
    }
    setAddToCartModal(true);
  };

  const closeModal = () => {
    setAddCartCo(false);
  };

  return (
    <div className="landing">
      <Header />
      <section className="landing__banner">
        <hgroup className="landing-hgroup">
          <h2>GreenRoots c'est quoi ?</h2>
          <p>
            GreenRoots est un site engagé pour l’environnement. Nous vendons des
            plants d’arbres pour contribuer ensemble à la reforestation.
          </p>
        </hgroup>

        <button type="button">
          <NavLink to="/aboutUs">En savoir plus</NavLink>
        </button>
      </section>

      <section className="landing__products">
        <h2>Nos plants d'arbres</h2>
        {lastThreeProducts.map((product) => (
          <article key={product.id_product}>
            <NavLink to={`/products/${product.id_product}`}>
              <img
                src={`${base_url}/public/${product.image_product}`}
                alt={product.product_name}
              />
            </NavLink>
            <h3>{product.product_name}</h3>
            <p>{product.product_price}€</p>
            <button
              type="button"
              onClick={() => {
                setAddCartCo(true);
                addToCart(product.id_product);
              }}
            >
              Ajouter au panier
            </button>
          </article>
        ))}
      </section>

      <section className="landing__engagement">
        <h2>Pourquoi planter ?</h2>
        <article>
          <img src="/assets/panet-icon.svg" alt="icon" />
          <p>Lutte contre le réchauffement climatique</p>
        </article>

        <article>
          <img src="/assets/bee-icon.svg" alt="icon" />
          <p>Préservation de la biodiversité</p>
        </article>

        <article>
          <img src="/assets/water-icon.svg" alt="icon" />
          <p>Protection des sols et de l'eau</p>
        </article>

        <article>
          <img src="/assets/graduate-icon.svg" alt="icon" />
          <p>Sensibilisation et éducation</p>
        </article>
      </section>
      <Footer />
      {/* Affichage de la modale d'ajout au panier si user connecté */}
      {addToCartModal && (
        <ModalAddToCart
          successMessage={successMessage}
          errorMessageCart={errorMessageCart}
          setErrorMessageCart={setErrorMessageCart}
          setAddToCartModal={setAddToCartModal}
        />
      )}

      {addCartCo && !isAuthenticated && (
        <div className="modal-message">
          <div className="modal-message-content">
            <img className="error-icon" src="../src/assets/erreur.png" alt="" />
            <strong className="error">Oopss ... </strong>
            <p className="error-message">Vous devez être connecté</p>
            <button type="button" className="button-retry" onClick={closeModal}>
              ↩️ retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
