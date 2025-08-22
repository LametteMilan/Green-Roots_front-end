import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './Notices.css';
function Notices() {
  return (
    <div className="container-notices">
      <Header />
      <h2>Mentions légales</h2>

      <hgroup className="banner-notices">
        <h3>Editeur du site</h3>
        <p>
          Nom de l'entreprise : [Nom de l'entreprise] Forme juridique : [Forme
          juridique de l'entreprise] Adresse : [Adresse] Téléphone : [Numéro de
          téléphone] E-mail : [Adresse e-mail] Directeur de la publication :
          [Nom du directeur de la publication, si applicable] Numéro
          d'immatriculation au registre du commerce et des sociétés (RCS) :
          [Numéro RCS] Capital social : [Montant du capital social, si
          applicable] TVA intracommunautaire : [Numéro de TVA
          intracommunautaire, si applicable]
        </p>
      </hgroup>
      {/* voir si on présente sous forme de liste */}
      <hgroup className="banner-notices">
        <h3>Hébergement</h3>
        <p>
          Nom de l'hébergeur : [Nom de l'hébergeur] Adresse : [Adresse de
          l'hébergeur] Téléphone : [Numéro de téléphone de l'hébergeur] E-mail :
          [Adresse e-mail de l'hébergeur]
        </p>
      </hgroup>

      <hgroup className="banner-notices">
        <h3>Propriété intellectuelle</h3>
        <p>
          Le site et chacun des éléments qui le composent (tels que textes,
          images, photographies, vidéos, etc.) sont la propriété exclusive de
          [Nom de l'entreprise] ou sont utilisés avec l'autorisation de leurs
          propriétaires respectifs. Toute reproduction, représentation ou
          utilisation, intégrale ou partielle, des éléments du site est
          strictement interdite sans autorisation préalable écrite de [Nom de
          l'entreprise].
        </p>
      </hgroup>

      <hgroup className="banner-notices">
        <h3>Collecte et traitemet des données personnelles</h3>
        <p>
          Les informations collectées via ce site sont destinées à [Nom de
          l'entreprise]. Vous disposez d'un droit d'accès, de rectification et
          de suppression des données vous concernant. Pour exercer ce droit,
          veuillez nous contacter à l'adresse suivante : [adresse e-mail de
          contact].
        </p>
      </hgroup>

      <hgroup className="banner-notices">
        <h3>Cookies</h3>
        <p>
          Ce site utilise des cookies. Vous pouvez vous opposer à
          l'enregistrement de cookies en configurant votre navigateur de la
          manière appropriée.
        </p>
      </hgroup>

      <hgroup className="banner-notices">
        <h3>Limitation de responsabilité</h3>
        <p>
          [Nom de l'entreprise] ne peut être tenu responsable des dommages
          directs ou indirects causés au matériel de l'utilisateur lors de
          l'accès au site.
        </p>
      </hgroup>

      <hgroup className="banner-notices">
        <h3>Modification des mentions légales</h3>
        <p>
          [Nom de l'entreprise] se réserve le droit de modifier ces mentions
          légales à tout moment. Les utilisateurs du site sont invités à les
          consulter régulièrement.
        </p>
      </hgroup>
      <div className="button-container">
        <button type="button" className="back-home">
          <NavLink to="/">Retourner à l'accueil</NavLink>
        </button>
      </div>

      <Footer />
    </div>
  );
}
export default Notices;
