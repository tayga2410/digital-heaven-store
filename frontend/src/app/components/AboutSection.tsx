'use client';

import { useState } from 'react';

const ACCORDION_ITEMS = [
  {
    title: "Широкий ассортимент",
    content: "Digital Heaven предлагает обширный выбор гаджетов: от смартфонов и ноутбуков до аксессуаров и умных устройств.",
  },
  {
    title: "Конкурентные цены",
    content: "Наш магазин предлагает доступные цены и постоянные скидки на популярные товары.",
  },
  {
    title: "Быстрая доставка",
    content: "Мы гарантируем доставку в кратчайшие сроки, чтобы вы быстрее наслаждались своими покупками.",
  },
  {
    title: "Удобство покупок",
    content: "Простая и понятная навигация, удобные способы оплаты и надежная система заказа.",
  },
  {
    title: "Поддержка клиентов",
    content: "Наша служба поддержки готова ответить на ваши вопросы 24/7 и помочь с выбором.",
  },
  {
    title: "Гарантия качества",
    content: "Мы сотрудничаем только с надежными производителями и предоставляем гарантию на все товары.",
  },
  {
    title: "Безопасные платежи",
    content: "Ваши транзакции полностью защищены благодаря современной системе безопасности.",
  },
];

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="about container">
      <h2 className="about__title">Почему Digital Heaven?</h2>
      <div className="about__wrapper">
        {ACCORDION_ITEMS.map((item, index) => (
          <div key={index} className="about__item">
            <button
              className={`about__button ${activeIndex === index ? 'open' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              {item.title}
              <span className="about__icon">
                {activeIndex === index ? '-' : '+'}
              </span>
            </button>
            {activeIndex === index && (
              <div className="about__content">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
