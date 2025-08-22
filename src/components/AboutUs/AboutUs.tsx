import './AboutUs.scss';
import Header from '../HeaderAll/Header/Header';
import Footer from '../Footer/Footer';

function AboutUs() {
  return (
    <>
      <Header />
      <section className="engagement">
        <h1 className="engagement-h1">Notre Engagement</h1>
        <h2 className="engagement-h2">🌱 Présentation du projet GreenRoots</h2>
        <p className="engagement-p">
          GreenRoots est une initiative écoresponsable qui a pour mission de
          lutter contre la déforestation en facilitant l’accès à la plantation
          d’arbres. À travers une plateforme en ligne intuitive, GreenRoots
          permet à chacun – particuliers, entreprises ou collectivités –
          d’acheter des plants d’arbres prêts à planter, pour reverdir notre
          planète un arbre à la fois.
        </p>
        <h2 className="engagement-h2">🌍 Objectifs du projet</h2>
        <ul className="engagement-ul">
          <li>Reboiser les zones dégradées</li>
          <li>Sensibiliser à l’importance de la biodiversité</li>
          <li>Encourager des gestes écologiques concrets et accessibles</li>
          <li>Offrir des cadeaux utiles, durables et porteurs de sens</li>
        </ul>
        <h2 className="engagement-h2">🛒 Fonctionnement du site</h2>
        <ul className='engagement-ul'>
          <li>
            Une gamme de plants sélectionnés avec soin (chêne, érable, pin,
            bouleau, etc.)
          </li>
          <li>Des fiches produits détaillées</li>
          <li>Un système de panier et de commande simple</li>
          <li>
            Des pages informatives sur nos valeurs, engagements, et mentions
            légales
          </li>
        </ul>
        <h2 className="engagement-h2">💚 Nos valeurs</h2>
        <ul className='engagement-ul'>
          <li>Transparence : chaque arbre compte, chaque geste est traçable</li>
          <li>
            Accessibilité : des prix justes pour permettre à tous de participer
          </li>
          <li>Impact : favoriser la plantation locale et responsable </li>
          <li>
            Éducation : transmettre l’importance des arbres à travers nos
            contenus
          </li>
        </ul>
      </section>
      <Footer />
    </>
  );
}

export default AboutUs;
