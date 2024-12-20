'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  categoryName?: string;
  productName?: string;
}

export default function Breadcrumbs({ categoryName, productName }: BreadcrumbProps) {
  return (
    <nav className="breadcrumbs">
      <ul>
        <li>
          <Link href="/">Главная</Link>
        </li>
        <li>
          <span> &gt; </span>
          <Link href="/catalog">Каталог товаров</Link>
        </li>
        {categoryName && (
          <li>
            <span> &gt; </span>
            <Link href={`/catalog?category=${encodeURIComponent(categoryName)}`}>
              {categoryName}
            </Link>
          </li>
        )}
        {productName && (
          <li>
            <span> &gt; </span>
            <span>{productName}</span>
          </li>
        )}
      </ul>
    </nav>
  );
}
