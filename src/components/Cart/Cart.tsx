import './Cart.scss';
import Header from '../HeaderAll/Header/Header';
import Footer from '../Footer/Footer';
import type ICart from '../../@types/cart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type IProducts from '../../@types/products';
import { NavLink } from 'react-router-dom';

interface CartProps {
  cart: ICart | null;
  setCart: React.Dispatch<React.SetStateAction<ICart | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function Cart({ cart, setCart, isLoading, setIsLoading }: CartProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');
  const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;

  const [qtyProductsCart, setQtyProductsCart] = useState<
    { id_cart: number; id_product: number; product_quantity: number }[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(
    null,
  );

  // state pour la modale de suppression
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const [paiementModal, setPaiementModal] = useState(false);
  const [paiementOrder, setPaiementOrder] = useState(false);
  const [orderCreate, setOrderCreate] = useState(false);
  const [totalPaiement, setTotalPaiement] = useState('');
  const [ordernumber, setOrdernumber] = useState();

  const isCartEmpty =
    !cart || !Array.isArray(cart.products) || cart.products.length === 0;

  useEffect(() => {
    setIsLoading(true);
    const getProductsCart = async () => {
      try {
        const response = await axios.get(`${base_url}/product-carts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setQtyProductsCart(response.data);

        const res = await axios.get(`${base_url}/carts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCart(res.data);
      } catch (e) {
        console.error('Erreur lors de la récupération du panier :', e);
      }
      setIsLoading(false);
    };

    if (token) {
      getProductsCart();
    }
  }, [setCart, token]);

  //fonction pour vider les prdoutis du panier après avoir passé une commande
  const emptyCart = async () => {
    if (!cart || !Array.isArray(cart.products)) return;

    try {
      for (const product of cart.products) {
        await axios.delete(
          `${base_url}/product-carts/${cart.id_cart}/${product.id_product}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      // Ensuite, on remet le cart à vide côté front
      setCart({ ...cart, products: [] });

      // Et on vide aussi les quantités
      setQtyProductsCart([]);

      console.log('Panier vidé avec succès.');
    } catch (error) {
      console.error('Erreur lors du vidage du panier :', error);
      alert('Une erreur est survenue lors du vidage du panier.');
    }
  };

  const createNewOrder = async () => {
    if (!decoded) return;

    try {
      const response = await axios.post(
        `${base_url}/orders`,
        {
          order_status: 'validé',
          order_total: subtotal,
          id_user: decoded.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Création de la commande :', response.data);
      setOrdernumber(response.data.id_order);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (paiementOrder) {
      console.log('Lancement de la requête de commande');
      createNewOrder();
      emptyCart();
    }
  }, [paiementOrder]);

  // envoi requête poru supprimer un produit selectionné
  useEffect(() => {
    console.log('le delete confirm :', deleteConfirmed);

    // fonction pour supprimer un produit du panier
    const handleDelete = async (idCart: number, idProduct: number) => {
      if (!deleteConfirmed) return;

      try {
        const response = await axios.delete(
          `${base_url}/product-carts/${idCart}/${idProduct}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('nouveau tableau de produits', response.data);

        const res = await axios.get(`${base_url}/carts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCart(res.data);
      } catch (error) {
        console.error('Erreur lors de la suppression du produit', error);
        alert('Une erreur est survenue lors de la suppression du produit.');
      }
    };

    if (selectedProduct !== null) {
      handleDelete(cart!.id_cart, selectedProduct.id_product);
      closeModal();
    }
  }, [deleteConfirmed, selectedProduct]);

  const updateProductsCart = async (
    idCart: number | undefined,
    idProduct: number,
    productQuantity: number,
  ) => {
    if (!idCart) return;

    try {
      const response = await axios.put(
        `${base_url}/product-carts/${idCart}/${idProduct}`,
        { product_quantity: productQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log('Produit mis à jour :', response.data);
      setQtyProductsCart((prev) =>
        prev.map((item) =>
          item.id_product === idProduct
            ? { ...item, product_quantity: productQuantity }
            : item,
        ),
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
    }
  };

  const updateQty = (id_product: number, delta: number) => {
    setQtyProductsCart((prev) => {
      const updated = prev.map((item) =>
        item.id_product === id_product
          ? {
              ...item,
              product_quantity: Math.max(item.product_quantity + delta, 1),
            }
          : item,
      );

      const updatedProduct = updated.find(
        (item) => item.id_product === id_product,
      );
      if (updatedProduct) {
        updateProductsCart(
          cart?.id_cart,
          id_product,
          updatedProduct.product_quantity,
        );
      }

      return updated;
    });
  };

  const closeModal = () => {
    setPaiementModal(false);
    setOrderCreate(false);
  };

  const subtotal = isCartEmpty
    ? '0.00'
    : cart.products
        .reduce((sum, product) => {
          const match = qtyProductsCart.find(
            (item) => item.id_product === product.id_product,
          );
          return (
            sum + (match ? product.product_price * match.product_quantity : 0)
          );
        }, 0)
        .toFixed(2);

  return (
    <div>
      <Header />
      <hgroup className="hgroup-cart">
        <h1>Votre panier</h1>
        <p>Prêt à concrétiser votre action ?</p>
      </hgroup>
      <div className="account-content-cart">
        {isLoading ? (
          <div className="loader" />
        ) : isCartEmpty ? (
          <p className="empty-cart">Votre Panier est vide</p>
        ) : (
          <>
            <section className="section-account">
              <div className="account-content-detail tableau">
                <div className="img-container" />
                <p>Articles</p>
                <p>Quantité</p>
                <p>Prix</p>
              </div>

              {cart.products.map((product) => {
                const productQty = qtyProductsCart.find(
                  (item) => item.id_product === product.id_product,
                );

                return (
                  <section key={product.id_product} className="section-cart">
                    <div className="account-content-detail">
                      <div className="img-container">
                        <img
                          src={`${base_url}/public/${product.image_product}`}
                          alt={product.product_name}
                        />
                      </div>
                      <em className="descripriton-product">
                        <strong>{product.product_name}</strong>
                        <span>{product.product_localisation}</span>
                      </em>
                      <em className="qtyModify">
                        <button
                          type="button"
                          className="btn-qty"
                          onClick={() => updateQty(product.id_product, -1)}
                        >
                          -
                        </button>
                        <span className="product-qty">
                          | {productQty?.product_quantity ?? 0} |
                        </span>
                        <button
                          type="button"
                          className="btn-qty"
                          onClick={() => updateQty(product.id_product, +1)}
                        >
                          +
                        </button>
                      </em>
                      <em className="price-qty">
                        {(
                          product.product_price *
                          (productQty?.product_quantity ?? 0)
                        ).toFixed(2)}{' '}
                        €
                      </em>
                    </div>

                    <button
                      className="delete-button__container"
                      type="button"
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeleteConfirmed(true);
                      }}
                    >
                      <img
                        className="delete__button"
                        src="/assets/trash-can.png"
                        alt="delete"
                      />
                    </button>
                  </section>
                );
              })}
            </section>

            <p className="detail-cart">
              Sous-total ({cart.products.length} articles) :{' '}
              <strong>{subtotal}€</strong>
            </p>

            <div className="cart-buttonContainer">
              <button
                type="button"
                className="cart-button"
                onClick={() => {
                  setPaiementModal(true);
                  setTotalPaiement(subtotal);
                }}
              >
                Paiement
              </button>
            </div>
          </>
        )}
      </div>
      {/* modal pour paiement */}
      {paiementModal && (
        <div className="modal-overlay">
          <div className="paiement-modal-content">
            <button type="button" className="close-button" onClick={closeModal}>
              x
            </button>
            <header className="paiement-header">
              <img
                className="paiement-header-logo"
                src="./src/assets/logo_greenroots.webp"
                alt=""
              />
              <strong className="paiement-header-totalPrice">
                {subtotal} €
              </strong>
            </header>
            <div className="modal-inputs">
              <p>Votre carte</p>
              <input
                className="modal-inputs-value"
                type="text"
                placeholder="💳 Numéro de carte"
              />
              <div className="modal-inputs-spaceBtw">
                <input
                  className="modal-inputs-value month-and-code"
                  type="text"
                  pattern="(0[1-9]|1[0-2])/20[2-9][0-9]"
                  placeholder="📅 MM/AAAA"
                />
                <input
                  className="modal-inputs-value month-and-code"
                  type="number"
                  placeholder="🔒 123"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button
                className="button-paiement"
                type="button"
                onClick={() => {
                  setPaiementOrder(true);
                  closeModal();
                  setOrderCreate(true);
                }}
              >
                Payer {subtotal} €
              </button>
            </div>
          </div>
        </div>
      )}
      {/* modal pour création de commande */}
      {orderCreate && (
        <div className="modal-overlay">
          <div className="paiement-modal-content">
            <button type="button" className="close-button" onClick={closeModal}>
              x
            </button>
            <header className="paiement-header">
              <img
                className="paiement-header-logo"
                src="./src/assets/logo_greenroots.webp"
                alt=""
              />
              <strong className="paiement-header-totalPrice">
                {totalPaiement} €
              </strong>
            </header>
            <div className="modal-inputs">
              <p>Votre transaction</p>
              <article>
                <h1>Votre marchand</h1>
                <p>Green Roots</p>
              </article>
              <article>
                <h1>Montant</h1>
                <p>{totalPaiement} €</p>
              </article>
              <article>
                <h1>N° de commande</h1>
                <p>961959{ordernumber}</p>
              </article>
            </div>
            <div className="modal-buttons">
              <NavLink
                to="/account/orders"
                className="button-continue"
                onClick={() => {
                  closeModal();
                }}
              >
                Accèder à mes commandes
              </NavLink>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Cart;
