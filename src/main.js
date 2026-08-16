/**
 * @file main.js
 * @description 가방 쇼핑몰 애플리케이션 메인 엔트리 포인트
 */

import './styles/main.css';
import { renderNavbar } from './components/Navbar.js';
import { renderMdShowcase } from './components/MdShowcase.js';
import { renderPopularSlider } from './components/PopularSlider.js';
import { renderMoreProductsModal } from './components/MoreProductsModal.js';
import { renderCartDrawer } from './components/CartDrawer.js';

/**
 * 애플리케이션 상태 (State)
 */
const appState = {
  /** @type {Array<Object>} 장바구니 상품 배열 */
  cart: [],
};

/**
 * 토스트 메시지를 화면 우측 하단에 노출합니다.
 * @param {string} message - 표시할 메시지 텍스트
 * @returns {void}
 */
export function showToast(message) {
  const toastContainer = document.getElementById('app-toast');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'lux-toast';
  toast.innerHTML = message;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}

/**
 * 장바구니 수량을 갱신하고 헤더 뱃지를 업데이터합니다.
 * @returns {void}
 */
function updateCartBadge() {
  const totalCount = appState.cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById('cart-badge-count');
  if (badge) {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  }
}

/**
 * 상품을 장바구니에 추가합니다.
 * @param {Object} product - 추가할 상품 객체
 * @returns {void}
 */
function handleAddToCart(product) {
  const existingIndex = appState.cart.findIndex(
    item => item.id === product.id && item.selectedColor === product.selectedColor
  );

  if (existingIndex > -1) {
    appState.cart[existingIndex].quantity += product.quantity || 1;
  } else {
    appState.cart.push({ ...product });
  }

  updateCartBadge();
  showToast(`🛍️ "${product.name}" (${product.selectedColor || '기본'}) 장바구니 담기 완료!`);
}

/**
 * 장바구니 Drawer를 엽니다.
 * @returns {void}
 */
function handleOpenCart() {
  const drawerRoot = document.getElementById('app-drawer');
  if (!drawerRoot) return;

  renderCartDrawer(drawerRoot, {
    cartItems: appState.cart,
    onClose: () => {},
    onUpdateQuantity: (index, newQty) => {
      appState.cart[index].quantity = newQty;
      updateCartBadge();
      handleOpenCart(); // Drawer 리렌더링
    },
    onRemoveItem: (index) => {
      const removed = appState.cart.splice(index, 1);
      updateCartBadge();
      handleOpenCart(); // Drawer 리렌더링
      if (removed.length > 0) {
        showToast(`🗑️ ${removed[0].name} 상품이 삭제되었습니다.`);
      }
    },
    onCheckout: () => {
      if (appState.cart.length === 0) return;
      showToast('🎉 주문이 완료되었습니다! 3D 감동 배송 서비스로 빠르게 배송됩니다.');
      appState.cart = [];
      updateCartBadge();
      const overlay = document.getElementById('cart-drawer-overlay');
      if (overlay) overlay.classList.remove('open');
    }
  });
}

/**
 * 인기상품 '더보기' 그리드 모달을 엽니다.
 * @returns {void}
 */
function handleOpenMoreModal() {
  const modalRoot = document.getElementById('app-modal');
  if (!modalRoot) return;

  renderMoreProductsModal(modalRoot, {
    onClose: () => {},
    onAddToCart: (product) => {
      handleAddToCart(product);
    }
  });
}

/**
 * 앱 전체 컴포넌트를 초기화하고 바인딩합니다.
 * @returns {void}
 */
function initApp() {
  const navbarRoot = document.getElementById('app-navbar');
  const showcaseRoot = document.getElementById('app-showcase');
  const popularRoot = document.getElementById('app-popular');

  // 1. 네비게이션 헤더 바인딩 (Requirements 1)
  if (navbarRoot) {
    renderNavbar(navbarRoot, {
      cartCount: 0,
      onOpenCart: handleOpenCart
    });
  }

  // 2. MD 추천 상품 3D 쇼케이스 바인딩 (Requirements 1 & 2)
  if (showcaseRoot) {
    renderMdShowcase(showcaseRoot, {
      onAddToCart: handleAddToCart
    });
  }

  // 3. 인기상품 슬라이더 바인딩 (Requirements 1 & 3: 6개 노출 & 더보기 버튼)
  if (popularRoot) {
    renderPopularSlider(popularRoot, {
      onAddToCart: handleAddToCart,
      onOpenMoreModal: handleOpenMoreModal
    });
  }
}

// DOM 준비 후 초기화 실행
document.addEventListener('DOMContentLoaded', initApp);
