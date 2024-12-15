import { useState } from 'react';
import Link from "next/link";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="nav">
      <div className="nav__burger" onClick={toggleMenu}>
        <img src={isOpen ? "/burger-menu-open.svg" : "/burger-menu-closed.svg"} alt={isOpen ? "Close" : "Menu"} width={40} height={40} />
      </div>
      <ul className={`nav__list ${isOpen ? 'nav__list--active' : ''}`}>
        <li className="nav__item">
          <Link href="/">Home</Link>
        </li>
        <li className="nav__item">
          <Link href="/catalog">Catalog</Link>
        </li>
        <li className="nav__item">
          <Link href="/">Contact Us</Link>
        </li>
        <li className="nav__item">
          <Link href="/">Blog</Link>
        </li>
      </ul>
    </nav>
  );
}