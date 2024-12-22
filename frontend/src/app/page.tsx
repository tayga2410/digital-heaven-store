
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductsSection from './components/ProductsSection';
import BestOffersSection from './components/BestOffersSection';

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <ProductsSection />
      <BestOffersSection />
    </div>
  );
}
