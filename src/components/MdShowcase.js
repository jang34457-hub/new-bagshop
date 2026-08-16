/**
 * @file MdShowcase.js
 * @description MD 추천 상품 3D 인터랙티브 쇼케이스 UI 컴포넌트
 */

import { mdRecommendedProduct } from '../data/products.js';
import { ThreeBagViewer } from './ThreeBagViewer.js';

/**
 * MD 추천 상품 3D 쇼케이스 UI를 렌더링하고 Three.js 뷰어 및 색상 스와치 컨트롤러를 바인딩합니다.
 * @param {HTMLElement} parentElement - 렌더링될 부모 DOM 요소
 * @param {Object} props - 전달 프로퍼티
 * @param {Function} props.onAddToCart - 장바구니 담기 클릭 시 호출되는 이벤트 콜백
 * @returns {ThreeBagViewer} 생성된 ThreeBagViewer 인스턴스
 */
export function renderMdShowcase(parentElement, { onAddToCart }) {
  const p = mdRecommendedProduct;
  const originalPrice = p.price;
  const discountedPrice = Math.round(p.price * (1 - p.discountRate / 100));

  const html = `
    <section class="md-showcase-section" id="showcase">
      <!-- Section Title Badge -->
      <div class="showcase-header text-center">
        <span class="showcase-tag">✨ MD's CHOICE & SPECIAL SHOWCASE</span>
        <h2 class="showcase-title">메종 3D 시그니처 레더 토트백</h2>
        <p class="showcase-subtext">Three.js 3D 실시간 에셋으로 나만의 프리미엄 가방 색상을 커스터마이징해 보세요</p>
      </div>

      <!-- Main Showcase Grid (Central 3D Canvas Showcase) -->
      <div class="showcase-main-grid">
        
        <!-- Center Large 3D Showcase Canvas Container -->
        <div class="showcase-3d-card">
          <!-- 3D Hint Badge -->
          <div class="hint-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
            </svg>
            <span>마우스로 360° 드래그 회전해보세요</span>
          </div>

          <!-- Three.js Canvas Container -->
          <div class="three-canvas-wrapper" id="md-three-container"></div>

          <!-- Quick Lighting / View Badges -->
          <div class="canvas-foot-info">
            <span class="info-pill">3D Procedural Mesh</span>
            <span class="info-pill">Real-time Material Lighting</span>
          </div>
        </div>

        <!-- Right Product Control Panel & Color Swatch -->
        <div class="showcase-info-panel">
          <div class="panel-header">
            <div class="category-badge">${p.category}</div>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="score">${p.rating}</span>
              <span class="reviews">(${p.reviewCount}개 리뷰)</span>
            </div>
          </div>

          <h3 class="product-heading">${p.name}</h3>
          <p class="product-desc">${p.description}</p>

          <!-- Price Display -->
          <div class="price-container">
            <span class="discount-percent">${p.discountRate}%</span>
            <span class="current-price">${discountedPrice.toLocaleString()}원</span>
            <del class="original-price">${originalPrice.toLocaleString()}원</del>
          </div>

          <!-- Color Customizer Swatch Section (요구사항 2: 색상 변경 기능) -->
          <div class="color-picker-section">
            <div class="color-picker-header">
              <span class="picker-label">가방 색상 선택 (Color Customization):</span>
              <span class="selected-color-name" id="selected-color-name">${p.colors[0].name} (${p.colors[0].tag})</span>
            </div>
            
            <div class="color-swatch-list" id="color-swatch-list">
              ${p.colors.map((c, index) => `
                <button 
                  class="color-swatch-btn ${index === 0 ? 'active' : ''}" 
                  data-hex="${c.hex}" 
                  data-name="${c.name}"
                  data-tag="${c.tag}"
                  aria-label="${c.name}"
                  style="background-color: ${c.hex};"
                >
                  <span class="swatch-check">✓</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Product Feature Specs List -->
          <div class="product-specs-list">
            <h4>주요 제품 특징</h4>
            <ul>
              ${p.features.map(f => `<li><span class="bullet">✓</span> ${f}</li>`).join('')}
            </ul>
          </div>

          <!-- Action Buttons (Quantity & Add to Cart) -->
          <div class="action-row">
            <div class="quantity-selector">
              <button class="qty-btn" id="qty-minus" aria-label="수량 감소">-</button>
              <input type="number" id="product-qty" value="1" min="1" max="99" readonly />
              <button class="qty-btn" id="qty-plus" aria-label="수량 증가">+</button>
            </div>

            <button class="add-to-cart-btn" id="showcase-add-cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>장바구니 담기</span>
            </button>

            <button class="buy-now-btn" id="showcase-buy-now">
              바로 구매하기
            </button>
          </div>

        </div>

      </div>
    </section>
  `;

  parentElement.innerHTML = html;

  // 1. Three.js 3D 뷰어 초기화
  const threeContainer = parentElement.querySelector('#md-three-container');
  const threeViewer = new ThreeBagViewer(threeContainer, p.colors[0].hex);

  // 2. 색상 스와치 클릭 이벤트 처리
  const swatchButtons = parentElement.querySelectorAll('.color-swatch-btn');
  const colorNameEl = parentElement.querySelector('#selected-color-name');

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const hex = btn.getAttribute('data-hex');
      const name = btn.getAttribute('data-name');
      const tag = btn.getAttribute('data-tag');

      if (colorNameEl) {
        colorNameEl.textContent = `${name} (${tag})`;
      }

      // Three.js 3D 가방 색상 부드럽게 업데이트
      threeViewer.setBagColor(hex);
    });
  });

  // 3. 수량 조절 이벤트
  const qtyInput = parentElement.querySelector('#product-qty');
  const minusBtn = parentElement.querySelector('#qty-minus');
  const plusBtn = parentElement.querySelector('#qty-plus');

  minusBtn?.addEventListener('click', () => {
    let current = parseInt(qtyInput.value, 10) || 1;
    if (current > 1) qtyInput.value = current - 1;
  });

  plusBtn?.addEventListener('click', () => {
    let current = parseInt(qtyInput.value, 10) || 1;
    if (current < 99) qtyInput.value = current + 1;
  });

  // 4. 장바구니 및 구매 이벤트
  const addCartBtn = parentElement.querySelector('#showcase-add-cart');
  addCartBtn?.addEventListener('click', () => {
    const selectedSwatch = parentElement.querySelector('.color-swatch-btn.active');
    const colorName = selectedSwatch ? selectedSwatch.getAttribute('data-name') : p.colors[0].name;
    const colorHex = selectedSwatch ? selectedSwatch.getAttribute('data-hex') : p.colors[0].hex;
    const qty = parseInt(qtyInput.value, 10) || 1;

    if (typeof onAddToCart === 'function') {
      onAddToCart({
        ...p,
        selectedColor: colorName,
        colorHex: colorHex,
        quantity: qty,
        finalPrice: discountedPrice
      });
    }
  });

  const buyNowBtn = parentElement.querySelector('#showcase-buy-now');
  buyNowBtn?.addEventListener('click', () => {
    addCartBtn.click();
  });

  return threeViewer;
}
