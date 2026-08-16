/**
 * @file CartDrawer.js
 * @description 사이드 슬라이딩 장바구니 Drawer 컴포넌트
 */

/**
 * 장바구니 Drawer UI를 렌더링하고 수량 조절, 삭제, 결제 시뮬레이션 이벤트를 처리합니다.
 * @param {HTMLElement} parentElement - 렌더링될 DOM 컨테이너
 * @param {Object} props - 프로퍼티
 * @param {Array} props.cartItems - 장바구니 상품 목록 배열
 * @param {Function} props.onClose - 장바구니 닫기 콜백
 * @param {Function} props.onUpdateQuantity - 수량 업데이트 콜백
 * @param {Function} props.onRemoveItem - 아이템 삭제 콜백
 * @param {Function} props.onCheckout - 주문하기 콜백
 * @returns {void}
 */
export function renderCartDrawer(parentElement, { cartItems = [], onClose, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  const html = `
    <div class="cart-drawer-overlay" id="cart-drawer-overlay">
      <div class="cart-drawer-panel">
        
        <!-- Drawer Header -->
        <div class="drawer-header">
          <div class="drawer-title-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3>쇼핑 장바구니</h3>
            <span class="drawer-count">(${cartItems.length})</span>
          </div>
          <button class="drawer-close-btn" id="cart-close-btn" aria-label="장바구니 닫기">&times;</button>
        </div>

        <!-- Drawer Item List -->
        <div class="drawer-body">
          ${cartItems.length === 0 ? `
            <div class="cart-empty-state">
              <div class="empty-icon">👜</div>
              <p>장바구니가 비어 있습니다.</p>
              <span class="empty-sub">MD 추천 상품 및 인기 상품을 둘러보세요!</span>
            </div>
          ` : `
            <div class="cart-items-list">
              ${cartItems.map((item, index) => `
                <div class="cart-item-card">
                  <div class="item-img-box" style="background-color: ${item.colorHex || '#2a2a32'};">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : '<div class="bag-3d-icon">🛍️ 3D</div>'}
                  </div>
                  <div class="item-details">
                    <h4 class="item-title">${item.name}</h4>
                    <span class="item-opt">옵션: ${item.selectedColor || '기본'}</span>
                    <span class="item-unit-price">${item.finalPrice.toLocaleString()}원</span>
                    
                    <div class="item-qty-row">
                      <div class="qty-btn-group">
                        <button class="cart-qty-btn minus" data-index="${index}">-</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="cart-qty-btn plus" data-index="${index}">+</button>
                      </div>
                      <button class="item-delete-btn" data-index="${index}">삭제</button>
                    </div>
                  </div>
                  <div class="item-subtotal">
                    ${(item.finalPrice * item.quantity).toLocaleString()}원
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Drawer Footer -->
        ${cartItems.length > 0 ? `
          <div class="drawer-footer">
            <div class="price-summary-row">
              <span>총 상품 금액</span>
              <span class="sum-val">${totalPrice.toLocaleString()}원</span>
            </div>
            <div class="price-summary-row shipping">
              <span>배송비</span>
              <span class="free-ship">무료 배송 (EVENT)</span>
            </div>
            <div class="divider"></div>
            <div class="price-summary-row total">
              <span>최종 결제 금액</span>
              <span class="total-val">${totalPrice.toLocaleString()}원</span>
            </div>

            <button class="checkout-btn" id="cart-checkout-btn">
              주문하기 / 구매 진행
            </button>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  parentElement.innerHTML = html;

  const overlay = parentElement.querySelector('#cart-drawer-overlay');
  const closeBtn = parentElement.querySelector('#cart-close-btn');
  const checkoutBtn = parentElement.querySelector('#cart-checkout-btn');

  // 슬라이드 애니메이션
  setTimeout(() => overlay?.classList.add('open'), 10);

  const handleClose = () => {
    overlay?.classList.remove('open');
    setTimeout(() => {
      parentElement.innerHTML = '';
      if (typeof onClose === 'function') onClose();
    }, 250);
  };

  closeBtn?.addEventListener('click', handleClose);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) handleClose();
  });

  // 수량 조절 버튼
  const minusBtns = parentElement.querySelectorAll('.cart-qty-btn.minus');
  const plusBtns = parentElement.querySelectorAll('.cart-qty-btn.plus');
  const delBtns = parentElement.querySelectorAll('.item-delete-btn');

  minusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (cartItems[idx].quantity > 1) {
        if (typeof onUpdateQuantity === 'function') onUpdateQuantity(idx, cartItems[idx].quantity - 1);
      } else {
        if (typeof onRemoveItem === 'function') onRemoveItem(idx);
      }
    });
  });

  plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (typeof onUpdateQuantity === 'function') onUpdateQuantity(idx, cartItems[idx].quantity + 1);
    });
  });

  delBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (typeof onRemoveItem === 'function') onRemoveItem(idx);
    });
  });

  checkoutBtn?.addEventListener('click', () => {
    if (typeof onCheckout === 'function') onCheckout();
  });
}
