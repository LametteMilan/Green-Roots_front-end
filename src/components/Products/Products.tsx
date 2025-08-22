import { NavLink } from 'react-router-dom';
import type IProducts from '../../@types/products';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './Products.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type ICart from '../../@types/cart';
import ModalAddToCart from '../ModalAddToCart/ModalAddToCart';
import { useAuth } from '../../contexts/AuthContext';

interface ProductsProps {
  allProducts: IProducts[];
  cart: ICart | null;
}

function Products({ allProducts, cart }: ProductsProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const { isAuthenticated } = useAuth();

  //récupération de l'id du user connecté (on récupere le token de le local storage puis on le décode pour acceder à l'id ('decoded.userId'))
  const token = localStorage.getItem('token');

  const quantityDefault = 1;
  const [addCart, setAddCart] = useState(false);
  const [productToAdd, setProductToAdd] = useState<IProducts | null>(null);

  const [addToCartModal, setAddToCartModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessageCart, setErrorMessageCart] = useState('');

  const closeModal = () => {
    setAddCart(false);
  };

  useEffect(() => {
    if (!addCart || !productToAdd || !cart?.id_cart) return;
  
    const addProductToCart = async () => {
      try {
        const res = await axios.post(
          `${base_url}/product-carts`,
          {
            id_cart: cart.id_cart,
            id_product: productToAdd.id_product,
            product_quantity: quantityDefault,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('produit ajouté au panier:' ,res.data);
        setErrorMessageCart(`${res.data}`);
        setSuccessMessage(true);
        
      } catch (e) {
        console.error("Erreur lors de l'ajout au panier :", e);
        setErrorMessageCart('Erreur lors de l\'ajout au panier');
        setSuccessMessage(false);
      } finally {
        setAddCart(false);
        setProductToAdd(null);
        setAddToCartModal(true);
      }
    };
  
    addProductToCart();
  }, [addCart, productToAdd, cart?.id_cart]);
  
  return (
    <div>
      <Header />
      <hgroup className="banner__products">
        <h2>Nos arbres à planter</h2>
        <p>Ici se cultive l'avenir...</p>
      </hgroup>

      <section className="products">
      {allProducts.map((product) => (
        <article key={product.id_product}>
          <NavLink to={`/products/${product.id_product}`}> <img src={`${base_url}/public/${product.image_product}`} alt={product.product_name} /></NavLink>
          <hgroup>
            <h3>{product.product_name}</h3>
            <p>{product.product_price}€</p>
          </hgroup>
          <button type="button" className='btn-addCart' onClick={()=>{
            setAddCart(true);
            setProductToAdd(product);
            }}>Ajouter au panier</button>
        </article>
      ))}
      </section>
      <Footer />
      {/* Affichage de la modale ajouter au panier */}
      {addToCartModal && (
        <ModalAddToCart
          successMessage={successMessage}
          errorMessageCart={errorMessageCart}
          setErrorMessageCart={setErrorMessageCart}
          setAddToCartModal={setAddToCartModal}
        />
      )}
      {/* modal message erreursi user non connecté et ajouter au panier */}
      {addCart && !isAuthenticated && (
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

export default Products;
