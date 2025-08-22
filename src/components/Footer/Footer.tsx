import { NavLink } from 'react-router-dom';
import './Footer.css';

function Footer () {
    return (
        <footer>
            <p><NavLink to="/notices">Mentions légales</NavLink></p>
            <p>2025 © GreenRoots - Tous droits réservés</p>
            <p><NavLink to="/policy">Confidentialité</NavLink></p>
        </footer>
    )
}

export default Footer;