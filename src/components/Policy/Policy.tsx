import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './Policy.css';
function Policy() {
  return (
    <div className='container-policy'>
      <Header />
      <h2 className='policy-title'>Politique de confidentialité</h2>

      <hgroup className='banner-policy'>
        <h3>Introduction</h3>
        <p>
          Bienvenue sur GreenRoots ! Nous attachons une grande importance à la
          protection de vos données personnelles et à votre vie privée. Cette
          politique de confidentialité vous explique quelles informations nous
          collectons, comment nous les utilisons et comment nous les protégeons.
        </p>
      </hgroup>

      <hgroup className='banner-policy'>
        <h3>Collecte des informations</h3>
        <p>
          Nous collectons des informations lorsque vous vous inscrivez sur notre
          site, passez une commande, remplissez un formulaire ou participez à un
          sondage. Les informations collectées peuvent inclure votre nom,
          adresse e-mail, adresse postale, numéro de téléphone et informations
          de carte de crédit.
        </p>
      </hgroup>

      <hgroup className='banner-policy'>
        <h3>Utilisation des informations</h3>
        <p>
          Les informations que nous collectons auprès de vous peuvent être
          utilisées de l'une des manières suivantes :
        </p>
      </hgroup>
      <ul className='policy-list'>
        <li>
          Pour personnaliser votre expérience et répondre à vos besoins
          individuels.
        </li>
        <li>
          Pour améliorer notre site web en fonction des informations et des
          retours que nous recevons de vous.
        </li>
        <li>
          Pour traiter les transactions : vos informations, qu'elles soient
          publiques ou privées, ne seront ni vendues, échangées, transférées ou
          données à une autre société pour quelque raison que ce soit, sans
          votre consentement, sauf dans le but exprès de livrer le produit ou le
          service demandé.
        </li>
      </ul>

      <button type="button" className='back-home'><NavLink to="/">Retourner à l'accueil</NavLink></button>
      <Footer />
    </div>
  );
}

export default Policy;
