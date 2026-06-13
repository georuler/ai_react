import { useState } from 'react';
import { products } from '@/data/products';
import type { Product } from '@/types/product';

const categories = ['전체', '니트', '셔츠', '팬츠', '티셔츠', '자켓', '원피스', '스커트', '아우터'];
const brands = ['전체', 'BENETTON', 'SISLEY'];

function ProductCard({ product }: { product: Product }) {
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden group hover:border-border-light transition-all hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-tertiary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-accent text-white text-[11px] font-bold rounded-md">NEW</span>
          )}
          {product.isBest && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-md">BEST</span>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-[11px] font-bold rounded-md">
            {discount}%
          </span>
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <span className="text-[11px] text-[#6b7280] uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-sm font-medium mt-1 mb-2 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold text-red-400">{product.salePrice.toLocaleString()}원</span>
              <span className="text-xs text-[#6b7280] line-through">{product.price.toLocaleString()}원</span>
            </>
          ) : (
            <span className="text-sm font-bold">{product.price.toLocaleString()}원</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [category, setCategory] = useState('전체');
  const [brand, setBrand] = useState('전체');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    if (category !== '전체' && p.category !== category) return false;
    if (brand !== '전체' && p.brand !== brand) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">
          상품 목록
          <span className="ml-2 text-base font-normal text-[#6b7280]">({filtered.length.toLocaleString()})</span>
        </h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>상품 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">상품 목록</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Brand filter */}
          <div className="flex items-center gap-1 bg-bg-secondary border border-border-color rounded-lg p-1">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  brand === b ? 'bg-accent text-white' : 'text-[#9ca3b8] hover:text-[#e8eaf0]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          {/* Category filter */}
          <div className="flex items-center gap-1 bg-bg-secondary border border-border-color rounded-lg p-1 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  category === c ? 'bg-accent text-white' : 'text-[#9ca3b8] hover:text-[#e8eaf0]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-xl text-[#6b7280] pointer-events-none">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="상품명 검색..."
            className="w-[240px] pl-[42px] pr-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-[#6b7280]">
          <span className="material-symbols-outlined text-4xl mb-3 block">inventory_2</span>
          검색 결과가 없습니다.
        </div>
      )}
    </>
  );
}
