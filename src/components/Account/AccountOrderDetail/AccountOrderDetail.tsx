import { NavLink } from 'react-router-dom';
import './AccountOrderDetail.scss';
import Header from '../../HeaderAll/Header/Header';
import Footer from '../../Footer/Footer';

function AccountOrderDetail() {
  return (
    <>
      <Header />
      <div className="account">
        <hgroup>
          <h1>Détail de la commande</h1>
          <p>Parce que chaque action compte</p>
        </hgroup>
        <div className="account-content">
          <div className="account-content-menu">
            <nav>
              <NavLink to="/account">Informations personnelles</NavLink>
              <NavLink to="/account/orders">Mes Commandes</NavLink>
              <NavLink to="/account/bookmarks">Mes Favoris</NavLink>
            </nav>
          </div>
          <div className="account-content-Dinfo">
            <section>
              <h2>Détail de la commande n°1</h2>
              <div className="grid-order">
                <p> </p>
                <p>Produits</p>
                <p>Qté</p>
                <p>Prix unitaire</p>
                <div className="account-content-Dinfo-detail">
                  <div className="img-container">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Adansonia_grandidieri04.jpg/800px-Adansonia_grandidieri04.jpg"
                      alt="illustrtation arbre n°1"
                    />
                  </div>
                  <em>
                    <strong>Pommier</strong>
                    <span>France</span>
                  </em>
                  <em>3</em>
                  <em>28.97 €</em>
                </div>
              </div>
            </section>
            <div className="account-buttonContainer">
              <p className="detail-order">
                Montant total de la commande : $86.91
              </p>
              <button type="button">Evaluer cette commande</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AccountOrderDetail;
