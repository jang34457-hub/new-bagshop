/**
 * @file PopularSlider.js
 * @description 인기상품 목록 슬라이더(Carousel) 컴포넌트 (6개 노출 + 더보기 버튼)
 */

import { popularProducts } from '../data/products.js';

/**
 * 인기상품 목록 슬라이더 컴포넌트를 렌더링하고 슬라이드 전환 및 '더보기' 모달 이벤트를 처리합니다.
 * @param {HTMLElement} parentElement - 렌더링할 부모 DOM 요소
 * @param {Object} props - 전달 프로퍼티
 * @param {Function} props.onAddToCart - 상품 장바구니 추가 이벤트 콜백
 * @param {Function} props.onOpenMoreModal - '더보기' 버튼 클릭 이벤트 콜백
 * @returns {void}
 */
export function renderPopularSlider(parentElement, { onAddToCart, onOpenMoreModal }) {
  // 요구사항: 상품은 6개까지 기본 노출
  const displayProducts = popularProducts.slice(0, 6);

  const html = `
    <section class="popular-section" id="popular">
      <div class="popular-container">
        <!-- Section Header -->
        <div class="section-header">
          <div class="title-group">
            <span class="section-sub">TOP TRENDING ITEMS</span>
            <h2 class="section-title">인기상품 BEST COLLECTION</h2>
          </div>
          
          <!-- Slider Navigation Arrows -->
          <div class="slider-controls">
            <button class="slider-arrow prev-btn" id="popular-prev" aria-label="이전 상품">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="slider-arrow next-btn" id="popular-next" aria-label="다음 상품">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Slider Window Container -->
        <div class="slider-viewport" id="popular-viewport">
          <div class="slider-track" id="popular-track">
            ${displayProducts.map((prod, idx) => {
              const origPrice = prod.price;
              const discPrice = Math.round(prod.price * (1 - prod.discountRate / 100));
              return `
                <div class="product-card" data-id="${prod.id}">
                  <div class="card-image-wrap">
                    <img src="${prod.image}" alt="${prod.name}" loading="lazy" class="card-img" />
                    <div class="badge-group">
                      ${prod.isBest ? '<span class="badge best">BEST</span>' : ''}
                      ${prod.isNew ? '<span class="badge new">NEW</span>' : ''}
                      <span class="badge discount">-${prod.discountRate}%</span>
                    </div>
                    
                    <button class="quick-cart-btn" data-id="${prod.id}" aria-label="장바구니 담기">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      <span>담기</span>
                    </button>
                  </div>

                  <div class="card-content">
                    <span class="card-category">${prod.category}</span>
                    <h3 class="card-title">${prod.name}</h3>
                    <p class="card-subtitle">${prod.subtitle}</p>
                    
                    <div class="card-rating">
                      <span class="star-icon">★</span>
                      <span class="rating-val">${prod.rating}</span>
                      <span class="rev-count">(${prod.reviewCount})</span>
                    </div>

                    <div class="card-price-row">
                      <span class="card-price">${discPrice.toLocaleString()}원</span>
                      <del class="card-orig-price">${origPrice.toLocaleString()}원</del>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Slider Pagination Dots -->
        <div class="slider-dots" id="popular-dots">
          ${displayProducts.map((_, idx) => `
            <button class="dot-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="${idx + 1}번 슬라이드"></button>
          `).join('')}
        </div>

        <!-- Requirements 3: 그 외 인기상품 '더보기' 버튼 -->
        <div class="more-products-wrapper">
          <button class="more-products-btn" id="open-more-btn">
            <span>더 많은 인기상품 전체보기 (Total ${popularProducts.length}개)</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

      </div>
    </section>
  `;

  parentElement.innerHTML = html;

  // --- 슬라이더 로직 구현 ---
  const track = parentElement.querySelector('#popular-track');
  const prevBtn = parentElement.querySelector('#popular-prev');
  const nextBtn = parentElement.querySelector('#popular-next');
  const dots = parentElement.querySelectorAll('.dot-btn');
  const cards = parentElement.querySelectorAll('.product-card');

  let currentIndex = 0;
  const totalItems = displayProducts.length;

  /**
   * 인덱스에 맞춰 슬라이더 트랙 트랜스폼 위치를 업데이트합니다.
   * @param {number} index - 이동할 슬라이드 인덱스
   * @returns {void}
   */
  const goToSlide = (index) => {
    if (index < 0) index = totalItems - 1;
    if (index >= totalItems) index = 0;
    currentIndex = index;

    // 슬라이더 이동 비율 계산 (반응형 카드 크기 감안)
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 320; // 24px gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  };

  prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
    });
  });

  // 윈도우 리사이즈 시 위치 재조정
  window.addEventListener('resize', () => goToSlide(currentIndex));

  // 장바구니 담기 버튼 이벤트
  const cartBtns = parentElement.querySelectorAll('.quick-cart-btn');
  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const targetProduct = popularProducts.find(p => p.id === id);
      if (targetProduct && typeof onAddToCart === 'function') {
        const discPrice = Math.round(targetProduct.price * (1 - targetProduct.discountRate / 100));
        onAddToCart({
          ...targetProduct,
          quantity: 1,
          finalPrice: discPrice,
          selectedColor: '기본 메인'
        });
      }
    });
  });

  // '더보기' 버튼 클릭 이벤트 (요구사항 3)
  const openMoreBtn = parentElement.querySelector('#open-more-btn');
  openMoreBtn?.addEventListener('click', () => {
    if (typeof onOpenMoreModal === 'function') {
      onOpenMoreModal();
    }
  });
}
