import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import type IOrders from '../../@types/orders';
import './Dashboard.css';

interface ordersProps {
  orders: IOrders[];
  setOrders: React.Dispatch<React.SetStateAction<IOrders[]>>;
}

function Dashboard({ orders, setOrders }: ordersProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  // Nombre de commandes visibles initialement
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${base_url}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    };
    fetchOrders();
  }, [base_url, token, setOrders]);

  // Calcul du montant total (en s'assurant que order_total est un nombre)
  const totalAmount = orders
    .reduce((acc, order) => acc + Number(order.order_total), 0)
    .toFixed(2);

  return (
    <div>
      <Header />
      <hgroup className="dashboard__banner">
        <h2>Administration</h2>
        <p>Gestion des commandes et des produits en toute simplicité</p>
      </hgroup>
      <div className="container-dashboard">
        <section className="dashboard__panel">
          <button type="button">
            <NavLink to="/dashboard">Commandes</NavLink>
          </button>
          <button type="button">
            <NavLink to="/dashboard/products">Produits</NavLink>
          </button>
          <button type="button">
            <NavLink to="/dashboard/addProducts">Ajouter produit</NavLink>
          </button>
        </section>

        <section className="dashboard__orders">
          <h3>Historique des commandes passées :</h3>
          {orders.length === 0 ? (
            <p>Aucune commande pour le moment.</p>
          ) : (
            <>
              {orders.slice(0, visibleCount).map((order) => (
                <article key={order.id_order}>
                  <p>Commande n°{order.id_order}</p>
                  <p>Montant : {order.order_total} €</p>
                </article>
              ))}

              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 5)}
                disabled={visibleCount >= orders.length}
              >
                Voir plus
              </button>
            </>
          )}

          <p>Montant total des commandes : {totalAmount} $</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;

