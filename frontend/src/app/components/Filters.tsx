'use client';

import { useState, useEffect } from 'react';

interface FiltersProps {
  products: Product[];
  category?: Category;
  onFilterChange: (filteredProducts: Product[]) => void;
}

export default function Filters({ products, category, onFilterChange }: FiltersProps) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string[] }>({});

  const brands = Array.from(
    new Set(products.map((product) => product.brandName).filter((brand): brand is string => !!brand))
  );

  const uniqueSpecValues = category?.specSchema
  ? Object.keys(category.specSchema).reduce((acc, key) => {
      acc[key] = Array.from(
        new Set(
          products
            .flatMap((product) =>
              product.specs
                ? product.specs
                    .filter((spec) => spec.key === key)
                    .map((spec) => spec.type)
                : []
            )
            .filter((value): value is string | number => value !== undefined)
        )
      );
      return acc;
    }, {} as { [key: string]: (string | number)[] })
  : {};



  // Обработчики изменения фильтров
  const handlePriceChange = (key: 'min' | 'max', value: number) => {
    setPriceRange((prev) => ({ ...prev, [key]: value }));
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [key]: prev[key]?.includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...(prev[key] || []), value],
    }));
  };

  // Применение фильтров
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brandName || '');

        const matchesSpecs = Object.entries(selectedSpecs).every(([key, values]) =>
          values.some((value) =>
            product.specs
              ? product.specs.some((spec) => spec.key === key && spec.type === value)
              : false
          )
        );
        

      return matchesPrice && matchesBrand && matchesSpecs;
    });

    onFilterChange(filtered);
  }, [products, priceRange, selectedBrands, selectedSpecs, onFilterChange]);

  return (
    <div className="filters">
      <div className="filter filter--price">
        <h3>Цена</h3>
        <label>
          Min Price: {priceRange.min}
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', Number(e.target.value))}
          />
        </label>
        <label>
          Max Price: {priceRange.max}
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
          />
        </label>
      </div>

      <div className="filter filter--brand">
        <h3>Бренды</h3>
        {brands.map((brand) => (
          <label key={brand}>
            <input
              type="checkbox"
              value={brand}
              onChange={() => handleBrandChange(brand)}
            />
            {brand}
          </label>
        ))}
      </div>

      <div className="filter filter--specs">
        <h3>Характеристики</h3>
        {Object.entries(uniqueSpecValues).map(([key, values]) => (
          <div key={key} className="filter__spec">
            <h4>{key}</h4>
            {values.map((value) => (
              <label key={value} className="filter__checkbox">
                <input
                  type="checkbox"
                  value={value.toString()}
                  onChange={() => handleSpecChange(key, value.toString())}
                />
                {value}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
