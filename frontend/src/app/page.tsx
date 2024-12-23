
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductsSection from './components/ProductsSection';
import BestOffersSection from './components/BestOffersSection';
import AboutSection from './components/AboutSection';

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <ProductsSection />
      <BestOffersSection />
      <AboutSection />
    </div>
  );
}
