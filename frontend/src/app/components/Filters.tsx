'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FiltersProps {
  products: Product[];
  category?: Category;
  onFilterChange: (filteredProducts: Product[]) => void;
}

export default function Filters({ products, category, onFilterChange }: FiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brandName || '');

      const matchesSpecs =
        Object.entries(selectedSpecs).length === 0 ||
        Object.entries(selectedSpecs).every(([key, values]) =>
          values.some((value) =>
            product.specs?.some((spec) => spec.key === key && spec.type === value)
          )
        );

      return matchesPrice && matchesBrand && matchesSpecs;
    });

    onFilterChange(filtered);
  }, [products, priceRange, selectedBrands, selectedSpecs, onFilterChange]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs((prev) => {
      const newSpecs = { ...prev };
      if (newSpecs[key]?.includes(value)) {
        newSpecs[key] = newSpecs[key]?.filter((v) => v !== value);
        if (newSpecs[key]?.length === 0) delete newSpecs[key];
      } else {
        newSpecs[key] = [...(newSpecs[key] || []), value];
      }
      return newSpecs;
    });
  };

  return (
    <Box className="filters">
      <Typography variant="h6">Цена</Typography>
      <Slider
        value={priceRange}
        min={Math.min(...products.map((p) => p.price)) || 0}
        max={Math.max(...products.map((p) => p.price)) || 10000}
        step={100}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
      />
      <Box>
        <div className='filters__price-range'>
          <label> Минимальная цена
            <input
              type="number"
              value={priceRange[0] === 0 ? '' : priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value) || 0, priceRange[1]])
              }
            />
          </label>
          <label>Максимальная цена
            <input
              type="number"
              value={priceRange[1] === 10000 ? '' : priceRange[1]}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setPriceRange([priceRange[0], value === '' ? 10000 : value]);
              }}
            />
          </label>
        </div>
      </Box>

      {category && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{
            fontFamily: 'Jura, Arial, sans-serif',
          }}
          >
            <Typography variant="h6"  style={{
            fontFamily: 'Jura, Arial, sans-serif',
          }}>Бренды</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul className='filters__list'>
              {Array.from(new Set(products.map((product) => product.brandName))).map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(brand!)}
                      onChange={() => handleBrandChange(brand!)}
                    />
                  }
                  label={brand}
                />
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      )}

      {category && (
        <Accordion>
           <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{
            fontFamily: 'Jura, Arial, sans-serif',
          }}
          >
            <Typography variant="h6"  style={{
            fontFamily: 'Jura, Arial, sans-serif',
          }}>Характеристики</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(
              products.reduce((acc, product) => {
                product.specs?.forEach((spec) => {
                  if (!acc[spec.key]) {
                    acc[spec.key] = new Set<string>();
                  }
                  acc[spec.key].add(spec.type);
                });
                return acc;
              }, {} as Record<string, Set<string>>)
            ).map(([key, values]) => (
              <Accordion key={key}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{key}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {[...values].map((value) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={selectedSpecs[key]?.includes(value) || false}
                          onChange={() => handleSpecChange(key, value)}
                        />
                      }
                      label={value}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
