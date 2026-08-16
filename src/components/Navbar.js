/**
 * @file Navbar.js
 * @description 가방 쇼핑몰 상단 네비게이션 헤더 컴포넌트
 */

/**
 * 네비게이션 바 HTML을 생성하고 이벤트를 연결합니다.
 * @param {HTMLElement} parentElement - 네비게이션이 렌더링될 부모 요소를 지정합니다.
 * @param {Object} props - 전달할 프로퍼티
 * @param {number} props.cartCount - 장바구니에 담긴 상품 개수
 * @param {Function} props.onOpenCart - 장바구니 클릭 이벤트 콜백
 * @returns {void}
 */
export function renderNavbar(parentElement, { cartCount = 0, onOpenCart }) {
  const html = `
    <header class="lux-navbar-header">
      <div class="lux-navbar-container">
        <!-- Brand Logo -->
        <a href="#" class="lux-logo">
          <span class="logo-mark">LUXE</span>
          <span class="logo-sub">MAISON 3D</span>
        </a>

        <!-- Navigation Menu Links -->
        <nav class="lux-nav-menu">
          <ul class="nav-list">
            <li class="nav-item active"><a href="#showcase" class="nav-link">MD 추천상품</a></li>
            <li class="nav-item"><a href="#popular" class="nav-link">인기상품</a></li>
            <li class="nav-item"><a href="#categories" class="nav-link">카테고리</a></li>
            <li class="nav-item"><a href="#customizer" class="nav-link badge-link">3D 커스텀 <span class="nav-badge">LIVE</span></a></li>
            <li class="nav-item"><a href="#story" class="nav-link">브랜드 스토어</a></li>
          </ul>
        </nav>

        <!-- Right Utilities (Search, Cart, User) -->
        <div class="lux-nav-actions">
          <button class="nav-action-btn search-btn" aria-label="검색">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <button class="nav-action-btn cart-btn" id="nav-cart-btn" aria-label="장바구니">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="cart-badge ${cartCount > 0 ? 'show' : ''}" id="cart-badge-count">${cartCount}</span>
          </button>

          <button class="nav-action-btn profile-btn" aria-label="마이페이지">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;

  parentElement.innerHTML = html;

  // 장바구니 버튼 클릭 이벤트 바인딩
  const cartBtn = parentElement.querySelector('#nav-cart-btn');
  if (cartBtn && typeof onOpenCart === 'function') {
    cartBtn.addEventListener('click', onOpenCart);
  }
}
