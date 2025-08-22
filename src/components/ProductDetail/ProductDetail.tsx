import { useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './ProductDetail.css';
import type IProducts from '../../@types/products';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type ICart from '../../@types/cart';
import { useAuth } from '../../contexts/AuthContext';

interface ProductDetailProps {
  allBookmarks: IProducts[];
  setAllBookmarks: React.Dispatch<React.SetStateAction<IProducts[]>>;
  cart: ICart | null;
  setCart: React.Dispatch<React.SetStateAction<ICart | null>>;
}

function ProductDetail({
  allBookmarks,
  setAllBookmarks,
  cart,
  setCart,
}: ProductDetailProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const params = useParams();
  const { isAuthenticated } = useAuth();

  const token = localStorage.getItem('token');
  const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = decoded?.userId;

  const [addCartCo, setAddCartCo] = useState(false);
  const [oneProduct, setOneProduct] = useState<IProducts | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State favoris
  const [addBookmark, setAddBookmark] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmAddBookmark, setConfirmAddBookmark] = useState(false);

  // State panier
  const [showCartModal, setShowCartModal] = useState(false);
  const [isAlreadyInCart, setIsAlreadyInCart] = useState(false);

  const quantityDefault = 1;

  const closeModal = () => {
    setShowModal(false);
    setShowCartModal(false);
    setAddBookmark(false);
    setAddCartCo(false);
  };

  const getOneProduct = async () => {
    setErrorMessage('');
    try {
      const response = await axios.get(`${base_url}/products/${params.id}`);
      setOneProduct(response.data);
    } catch (e) {
      setErrorMessage('Erreur de fetch du plant');
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getOneProduct();
  }, []);

  // 💾 Ajout au favoris
  useEffect(() => {
    if (!addBookmark || !userId || !params.id) return;

    const addProductToBookmark = async () => {
      try {
        const response = await axios.post(
          `${base_url}/bookmarks/${userId}/products/${params.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const alreadyExists = allBookmarks.some(
          (product) => product.id_product === Number(response.data.id_product),
        );

        if (!alreadyExists) {
          const bookmarksResponse = await axios.get(
            `${base_url}/bookmarks/${userId}/products`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setAllBookmarks(bookmarksResponse.data);
          setConfirmAddBookmark(true);
        } else {
          setConfirmAddBookmark(false);
        }
      } catch (error) {
        console.error('Erreur ajout favoris :', error);
        setConfirmAddBookmark(false);
      } finally {
        setAddBookmark(false);
        setShowModal(true);
      }
    };

    addProductToBookmark();
  }, [addBookmark, userId, params.id]);

  // 🛒 Fonction d’ajout au panier avec axios
  const handleAddToCart = async () => {
    if (!oneProduct || !userId) return;

    try {
      // Ajoute le produit au panier
      await axios.post(
        `${base_url}/product-carts`,
        {
          id_cart: cart!.id_cart,
          id_product: oneProduct.id_product,
          product_quantity: quantityDefault,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Récupère les nouveaux produits du panier après l'ajout
      const updatedCart = await axios.get(`${base_url}/product-carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(updatedCart.data); // Met à jour le panier avec les nouveaux produits
      setIsAlreadyInCart(false); // On réinitialise l'état de la présence dans le panier
    } catch (e) {
      console.error("Erreur lors de l'ajout au panier :", e);
    } finally {
      setShowCartModal(true); // Affiche la modal une fois l'ajout effectué
    }
  };

  return (
    <div className="container-productDetail">
      {/* Modal  confirmation ajout favoris*/}
      {showModal && (
        <div className="modal-message">
          <div className="modal-message-content">
            <button type="button" className="close-button" onClick={closeModal}>
              x
            </button>
            {confirmAddBookmark ? (
              <>
                <img
                  className="success-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f6/OOjs_UI_icon_check-constructive.svg"
                  alt=""
                />
                <strong className="succesful">Importation réussie</strong>
                <p className="success-message">
                  Produit {oneProduct?.product_name} ajouté aux favoris
                </p>
              </>
            ) : (
              <>
                <img
                  className="error-icon"
                  src="../src/assets/erreur.png"
                  alt=""
                />
                <strong className="error">Oopss ... </strong>
                <p className="error-message">
                  Ce produit est déjà dans vos favoris
                </p>
              </>
            )}
            <button type="button" className="button-retry" onClick={closeModal}>
              Continuer
            </button>
          </div>
        </div>
      )}
      {/* Modal confirmation ajout au panier */}
      {showCartModal && (
        <div className="modal-message">
          <div className="modal-message-content">
            <button type="button" className="close-button" onClick={closeModal}>
              x
            </button>
            {!isAlreadyInCart ? (
              <>
                <img
                  className="success-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f6/OOjs_UI_icon_check-constructive.svg"
                  alt=""
                />
                <strong className="succesful">Ajouté au panier</strong>
                <p className="success-message">
                  {oneProduct?.product_name} a été ajouté au panier
                </p>
              </>
            ) : (
              <>
                <img
                  className="error-icon"
                  src="../src/assets/erreur.png"
                  alt=""
                />
                <strong className="error">Déjà présent</strong>
                <p className="error-message">
                  Ce produit est déjà dans votre panier
                </p>
              </>
            )}
            <button
              type="button"
              className="button-continue"
              onClick={closeModal}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
      {/* Modal ajout au panier ou favoris alors que user non connecté */}
      {(addBookmark || addCartCo) && !isAuthenticated && (
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

      {/* Corps */}
      {errorMessage && <p>{errorMessage}</p>}
      {isLoading && <div className="loader" />}
      <Header />

      <section className="banner__product">
        <hgroup>
          <h2>{oneProduct?.product_name}</h2>
          <p>Localisation : {oneProduct?.product_localisation}</p>
        </hgroup>
        <p className="price">{oneProduct?.product_price}€</p>
      </section>

      <section className="container__img">
        <img
          src={`${base_url}/public/${oneProduct?.image_product}`}
          className="img-detailProd"
          alt={oneProduct?.product_name}
        />
      </section>

      <section className="banner__description">
        <p>{oneProduct?.product_description}</p>
        <div>
          <button
            className="button_addBookmarks"
            type="button"
            onClick={() => setAddBookmark(true)}
          >
            Ajouter aux favoris
          </button>
          <button
            type="button"
            onClick={() => {
              handleAddToCart();
              setAddCartCo(true);
            }}
          >
            Ajouter au panier
          </button>
        </div>
      </section>

      <section className="reviews">
        <h3>Nos clients en parlent :</h3>
        <article>
          <p className="author">David Gor</p>
          <p className="duration">Il y a 5 min</p>
          <p className="comment">
            Expérience d’achat au top, content d’avoir pu contribuer à une bonne
            action !
          </p>
        </article>

        <article>
          <p className="author">Marie Dupont</p>
          <p className="duration">Il y a 10 min</p>
          <p className="comment">
            J’ai adoré le concept de GreenRoots, je suis ravie d’avoir pu
            acheter un arbre !
          </p>
        </article>
      </section>

      <Footer />
    </div>
  );
}

export default ProductDetail;
