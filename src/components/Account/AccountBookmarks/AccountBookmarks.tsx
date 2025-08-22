import './AccountBookMarks.scss';
import Header from '../../HeaderAll/Header/Header';
import Footer from '../../Footer/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type IProducts from '../../../@types/products';
import { NavLink } from 'react-router-dom';
import type ICart from '../../../@types/cart';
import ModalAddToCart from '../../ModalAddToCart/ModalAddToCart';

interface BookmarksProps {
  allBookmarks: IProducts[];
  setAllBookmarks: React.Dispatch<React.SetStateAction<IProducts[]>>;
  cart: ICart | null;
}

function AccountBookmarks({
  allBookmarks,
  setAllBookmarks,
  cart,
}: BookmarksProps) {
  const base_url = import.meta.env.VITE_BASE_URL;

  const token = localStorage.getItem('token');
  let decoded: { userId: number } | null = null;

  const quantityDefault = 1;

  const [addToCartModal, setAddToCartModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessageCart, setErrorMessageCart] = useState('');

  if (token) {
    try {
      decoded = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Erreur de décodage du token', e);
    }
  }

  // Récupération des favoris de l'utilisateur connecté
  useEffect(() => {
    if (!token || !decoded) return;

    const getBookmarks = async () => {
      try {
        const response = await axios.get(
          `${base_url}/bookmarks/${decoded!.userId}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAllBookmarks(response.data);
      } catch (e) {
        console.error('Erreur récupération favoris', e);
      }
    };

    getBookmarks();
  }, []);

  // Fonction de suppression d’un produit des favoris
  const handleWithdrawBookmark = async (product: IProducts) => {
    if (!token || !decoded) return;

    try {
      const response = await axios.delete(
        `${base_url}/bookmarks/${decoded.userId}/products/${product.id_product}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const updatedBookmarks = allBookmarks.filter(
          (p) => p.id_product !== product.id_product,
        );
        setAllBookmarks(updatedBookmarks);
      } else {
        throw new Error('Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression favori', error);
      alert('Une erreur est survenue lors de la suppression.');
    }
  };

  //ajouter au panier
  const handleAddToCart = async (product: IProducts) => {
      
    if (!product || !cart?.id_cart) return; 
  
    try {
      await axios.post(
        `${base_url}/product-carts`,
        {
          id_cart: cart.id_cart,
          id_product: product.id_product,
          product_quantity: quantityDefault,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
  
      // const updatedCart = await axios.get(`${base_url}/product-carts`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
  
      // setCart(updatedCart.data);

      setErrorMessageCart("produit ajouté");
      setSuccessMessage(true);
      setAddToCartModal(true);
      
    } catch (e) {
      console.error("Erreur lors de l'ajout au panier :", e);
      setErrorMessageCart('Erreur lors de l\'ajout au panier');
      setSuccessMessage(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bookmarks">
        <hgroup>
          <h1>Vos favoris</h1>
          <p>Ici se trouve votre action pour demain ...</p>
        </hgroup>

        {allBookmarks.length === 0 ? (
          <p className="noBookmarks">Aucun favori</p>
        ) : (
          <section className="section-fav">
            {allBookmarks.map((product) => (
              <article key={product.id_product}>
                <div className="img-container">
                  <NavLink to={`/products/${product.id_product}`}>
                    <img
                      className="img-bookmarks"
                      src={`${base_url}/public/${product.image_product}`}
                      alt={product.product_name}
                    />
                  </NavLink>
                </div>
                <div className="description">
                  <h2>{product.product_name}</h2>
                  <p>{product.product_price}€</p>
                </div>
                <button
                  type="button"
                  className="description-buttonAdd"
                  onClick={() => handleAddToCart(product)}
                >
                  Ajouter au panier
                </button>
                <button
                  type="button"
                  className="description-buttonDel"
                  onClick={() => handleWithdrawBookmark(product)}
                >
                  Retirer
                </button>
              </article>
            ))}
          </section>
        )}
      </div>
      {/* Affichage de la modale d'édition */}
      {addToCartModal && (
        <ModalAddToCart
          successMessage={successMessage}
          errorMessageCart={errorMessageCart}
          setErrorMessageCart={setErrorMessageCart}
          setAddToCartModal={setAddToCartModal}
        />
      )}
      <Footer />
    </>
  );
}

export default AccountBookmarks;
