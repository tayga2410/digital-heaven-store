import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__section">
          <h3 className='footer__title'>О магазине</h3>
          <ul className='footer__list'>
            <li><Link className='footer__link' href="/about">О нас</Link></li>
            <li><Link className='footer__link' href="/delivery-rules">Правила доставки</Link></li>
            <li><Link className='footer__link' href="/payment-methods">Способы оплаты</Link></li>
            <li><Link className='footer__link' href="/warranty-returns">Гарантия и возврат</Link></li>
          </ul>
        </div>

        <div className="footer__section">
        <h3 className='footer__title'>Помощь покупателям</h3>
          <ul className='footer__list'>
            <li><Link className='footer__link' href="/how-to-order">Как оформить заказ</Link></li>
            <li><Link className='footer__link' href="/faq">Часто задаваемые вопросы</Link></li>
            <li><Link className='footer__link' href="/support">Техническая поддержка</Link></li>
            <li><Link className='footer__link' href="/privacy-policy">Политика конфиденциальности</Link></li>
          </ul>
        </div>

        <div className="footer__section">
        <h3 className='footer__title'>Популярные категории</h3>
          <ul className='footer__list'>
            <li><Link className='footer__link' href="/catalog?category=Phones">Смартфоны</Link></li>
            <li><Link className='footer__link' href="/category/laptops">Ноутбуки</Link></li>
            <li><Link className='footer__link' href="/catalog?category=Headphones">Наушники</Link></li>
            <li><Link className='footer__link' href="/category/game-consoles">Игровые приставки</Link></li>
            <li><Link className='footer__link' href="/category/accessories">Аксессуары</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Digital Heaven. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
