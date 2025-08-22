import { NavLink } from 'react-router-dom';
import './Header.css';
import { useState } from 'react';
import HeaderMenu from '../HeaderMenu/HeaderMenu';

function Header() {
  const [menuBurger, setmenuBurger] = useState(false);

  return (
    <header className='header'>
      {menuBurger && <HeaderMenu setmenuBurger={setmenuBurger} />}
      <div className='home_burger'>
        <NavLink className="link-home" to="/">
          <h1>Plantez aujourd'hui, respirez demain</h1>
        </NavLink>
        <button
          type="button"
          className="button-header"
          onClick={() => {
            setmenuBurger(true);
          }}
        >
          <img
            src="/assets/menu.png"
            alt="hamburger menu"
            className="burgerMenu"
          />
        </button>
      </div>
      <button type="button" className="header-button">
        <NavLink to="/products">Découvrir nos plants</NavLink>
      </button>
    </header>
  );
}
export default Header;
