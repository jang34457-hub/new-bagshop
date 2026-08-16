/**
 * @file MoreProductsModal.js
 * @description 인기상품 '더보기' 전체 목록을 모달 팝업으로 제공하는 컴포넌트
 */

import { popularProducts } from '../data/products.js';

/**
 * '더보기' 인기상품 그리드 모달 HTML을 생성하고 필터링 및 장바구니 담기 이벤트를 바인딩합니다.
 * @param {HTMLElement} parentElement - 모달이 붙을 컨테이너 요소
 * @param {Object} props - 프로퍼티
 * @param {Function} props.onClose - 모달 닫기 콜백
 * @param {Function} props.onAddToCart - 장바구니 추가 콜백
 * @returns {void}
 */
export function renderMoreProductsModal(parentElement, { onClose, onAddToCart }) {
  const categories = ['전체', '토트백', '숄더백', '크로스백', '버킷백', '클러치', '백팩', '파우치'];

  const html = `
    <div class="modal-overlay" id="more-products-overlay">
      <div class="modal-content-container">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div>
            <span class="modal-tag">LUXE POPULAR COLLECTION</span>
            <h2 class="modal-title">인기 가방 상품 전체보기</h2>
          </div>
          <button class="modal-close-btn" id="close-modal-btn" aria-label="모달 닫기">&times;</button>
        </div>

        <!-- Category Filter Tabs -->
        <div class="modal-filter-tabs">
          ${categories.map((cat, idx) => `
            <button class="filter-tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Grid Products Container -->
        <div class="modal-grid-body" id="modal-grid-body">
          <!-- Rendered by renderProductGrid() -->
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <p class="footer-note">전 제품 이탈리아 고급 가축 원피 및 정품 품질 보증서가 동봉됩니다.</p>
          <button class="modal-confirm-btn" id="modal-close-foot">닫기</button>
        </div>

      </div>
    </div>
  `;

  parentElement.innerHTML = html;

  const overlay = parentElement.querySelector('#more-products-overlay');
  const closeBtn = parentElement.querySelector('#close-modal-btn');
  const footCloseBtn = parentElement.querySelector('#modal-close-foot');
  const gridBody = parentElement.querySelector('#modal-grid-body');
  const filterBtns = parentElement.querySelectorAll('.filter-tab-btn');

  /**
   * 카테고리 필터에 따라 모달 내 그리드 카드를 렌더링합니다.
   * @param {string} filterCategory - 선택한 카테고리 이름
   * @returns {void}
   */
  const renderProductGrid = (filterCategory = '전체') => {
    const filtered = filterCategory === '전체'
      ? popularProducts
      : popularProducts.filter(p => p.category.includes(filterCategory) || filterCategory.includes(p.category));

    if (filtered.length === 0) {
      gridBody.innerHTML = `<div class="empty-grid">해당 카테고리의 상품이 존재하지 않습니다.</div>`;
      return;
    }

    gridBody.innerHTML = filtered.map(prod => {
      const origPrice = prod.price;
      const discPrice = Math.round(prod.price * (1 - prod.discountRate / 100));
      return `
        <div class="modal-product-card">
          <div class="modal-card-img-wrap">
            <img src="${prod.image}" alt="${prod.name}" />
            <span class="modal-discount-tag">-${prod.discountRate}%</span>
          </div>
          <div class="modal-card-info">
            <span class="m-cat">${prod.category}</span>
            <h4 class="m-title">${prod.name}</h4>
            <div class="m-price-row">
              <span class="m-disc-price">${discPrice.toLocaleString()}원</span>
              <del class="m-orig-price">${origPrice.toLocaleString()}원</del>
            </div>
            <button class="m-add-cart-btn" data-id="${prod.id}">
              장바구니 담기
            </button>
          </div>
        </div>
      `;
    }).join('');

    // 새로 생성된 장바구니 담기 버튼 리스너 연결
    const addBtns = gridBody.querySelectorAll('.m-add-cart-btn');
    addBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const item = popularProducts.find(p => p.id === id);
        if (item && typeof onAddToCart === 'function') {
          const discPrice = Math.round(item.price * (1 - item.discountRate / 100));
          onAddToCart({
            ...item,
            quantity: 1,
            finalPrice: discPrice,
            selectedColor: '기본 옵션'
          });
        }
      });
    });
  };

  // 초기 렌더링
  renderProductGrid('전체');

  // 필터 탭 클릭
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-cat');
      renderProductGrid(category);
    });
  });

  // 닫기 리스너
  const handleClose = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      parentElement.innerHTML = '';
      if (typeof onClose === 'function') onClose();
    }, 250);
  };

  closeBtn?.addEventListener('click', handleClose);
  footCloseBtn?.addEventListener('click', handleClose);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) handleClose();
  });

  // Open animation class
  setTimeout(() => overlay.classList.add('open'), 10);
}
