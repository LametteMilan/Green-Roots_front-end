import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AccountOrders.scss';
import Header from '../../HeaderAll/Header/Header';
import Footer from '../../Footer/Footer';
import type IOrders from '../../../@types/orders';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

interface ordersProps {
  orders: IOrders[];
  setOrders: React.Dispatch<React.SetStateAction<IOrders[]>>;
}

function AccountOrders({ orders, setOrders }: ordersProps) {
  const user = useAuth();
  const base_url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${base_url}/users/${user.user?.id}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    };
    fetchOrders();
  }, [base_url, token, setOrders]);

  const totalAmount = orders
    .reduce((acc, order) => acc + Number(order.order_total), 0)
    .toFixed(2);

  return (
    <>
      <Header />
      <div className="orders">
        <hgroup>
          <h1>Vos commandes</h1>
          <p>L'ensemble de vos actions se trouve ici ...</p>
        </hgroup>
        <div className="orders-content">
          <div className="orders-content-menu">
            <nav>
              <NavLink to="/account">Informations personnelles</NavLink>
              <NavLink to="/account/orders">Mes Commandes</NavLink>
              <NavLink to="/account/bookmarks">Mes Favoris</NavLink>
            </nav>
          </div>

          <div className="orders-content-info">
            <section>
              <h2>Historique de vos commandes</h2>
              {orders.length === 0 ? (
                <p>Aucune commande trouvée.</p>
              ) : (
                orders.slice(0, visibleCount).map((order) => (
                  <div key={order.id_order} className="orders-buttonContainer">
                    <NavLink
                      to={`/account/orders/detail/${order.id_order}`}
                      className="orders-button"
                    >
                      <em className="em-order">Commande n°{order.id_order}</em>
                      <p>
                        <span>Montant</span>
                        <em>{Number(order.order_total).toFixed(2)} €</em>
                      </p>
                    </NavLink>
                  </div>
                ))
              )}

              {visibleCount < orders.length && (
                <div className="account-buttonContainer">
                  <button
                    type="button"
                    className="button-more"
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                  >
                    Voir +
                  </button>
                </div>
              )}
            </section>

            <p>Montant total de vos commandes : {totalAmount} €</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AccountOrders;
