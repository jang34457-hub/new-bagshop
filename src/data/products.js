/**
 * @file products.js
 * @description 가방 쇼핑몰의 MD 추천 상품 및 인기 상품 데이터 모듈
 */

/**
 * @typedef {Object} ColorOption
 * @property {string} name - 색상 명칭
 * @property {string} hex - 16진수 색상 코드 (Three.js 및 UI 스와치용)
 * @property {string} tag - 색상 태그
 */

/**
 * @typedef {Object} Product
 * @property {number} id - 상품 고유 ID
 * @property {string} name - 상품명
 * @property {string} subtitle - 부제목 / 설명
 * @property {number} price - 정가 (원)
 * @property {number} discountRate - 할인율 (%)
 * @property {number} rating - 별점 (5점 만점)
 * @property {number} reviewCount - 리뷰 개수
 * @property {string} category - 카테고리
 * @property {string} image - 대표 이미지 URL
 * @property {string[]} tags - 태그 목록
 * @property {boolean} [isBest] - 베스트셀러 여부
 * @property {boolean} [isNew] - 신상품 여부
 */

/** @type {ColorOption[]} MD 추천 상품 색상 옵션 리스트 */
export const mdColorOptions = [
  { name: '클래식 블랙', hex: '#1e1e24', tag: 'Classic Black' },
  { name: '카라멜 브라운', hex: '#8c533e', tag: 'Caramel Brown' },
  { name: '올리브 그린', hex: '#3b4e3e', tag: 'Olive Green' },
  { name: '버건디 레드', hex: '#6b2d39', tag: 'Burgundy Red' },
  { name: '오프 화이트', hex: '#e8e5de', tag: 'Off White' },
  { name: '네이비 블루', hex: '#26384f', tag: 'Navy Blue' },
];

/** @type {Product} MD 추천 상품 데이터 */
export const mdRecommendedProduct = {
  id: 101,
  name: '메종 3D 시그니처 레더 토트백',
  subtitle: 'Handcrafted Italian Calfskin 3D Limited Showcase Edition',
  price: 890000,
  discountRate: 15,
  rating: 4.9,
  reviewCount: 248,
  category: '토트백 / 숄더백',
  description: '최상급 이탈리안 카프스킨 가죽과 고유의 3D 스트럭처 구조로 설계된 프리미엄 토트백입니다. 수공예 스티치와 은은한 샴페인 골드 버클이 시그니처 럭셔리를 선사합니다.',
  features: [
    '100% 이탈리안 천연 송아지 가죽 사용',
    '3D 커스터마이징 텍스처 & 매터리얼',
    '탈부착 가능한 인너 크로스 스트랩 제공',
    '마그네틱 메인 클로저 & 내부 지퍼 포켓'
  ],
  colors: mdColorOptions
};

/** @type {Product[]} 인기 상품 목록 데이터 (10개 이상 데이터, 슬라이더 6개 + 더보기용) */
export const popularProducts = [
  {
    id: 1,
    name: '아치 엠보스 크로스바디 백',
    subtitle: 'Arch Embossed Crossbody Bag',
    price: 320000,
    discountRate: 10,
    rating: 4.8,
    reviewCount: 182,
    category: '크로스백',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    tags: ['BEST', 'HOT'],
    isBest: true
  },
  {
    id: 2,
    name: '모나코 소프트 레더 숄더백',
    subtitle: 'Monaco Soft Leather Shoulder Bag',
    price: 450000,
    discountRate: 20,
    rating: 4.9,
    reviewCount: 310,
    category: '숄더백',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    tags: ['BEST', 'SALE'],
    isBest: true
  },
  {
    id: 3,
    name: '클래식 보스턴 미니 버킷백',
    subtitle: 'Classic Boston Mini Bucket Bag',
    price: 280000,
    discountRate: 15,
    rating: 4.7,
    reviewCount: 95,
    category: '버킷백',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    tags: ['NEW'],
    isNew: true
  },
  {
    id: 4,
    name: '루미에르 스퀘어 클러치',
    subtitle: 'Lumière Square Leather Clutch',
    price: 210000,
    discountRate: 5,
    rating: 4.6,
    reviewCount: 64,
    category: '클러치',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
    tags: ['HOT']
  },
  {
    id: 5,
    name: '베네치아 시그니처 캔버스 파우치',
    subtitle: 'Venezia Signature Canvas Pouch',
    price: 185000,
    discountRate: 10,
    rating: 4.9,
    reviewCount: 420,
    category: '파우치',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80',
    tags: ['BEST'],
    isBest: true
  },
  {
    id: 6,
    name: '센트럴 모던 시티 백팩',
    subtitle: 'Central Modern City Leather Backpack',
    price: 520000,
    discountRate: 25,
    rating: 4.8,
    reviewCount: 143,
    category: '백팩',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80',
    tags: ['SALE'],
    isNew: true
  },
  {
    id: 7,
    name: '셀린드 호보 플랩백',
    subtitle: 'Celinde Hobo Leather Flap Bag',
    price: 490000,
    discountRate: 15,
    rating: 4.9,
    reviewCount: 88,
    category: '숄더백',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=600&q=80',
    tags: ['NEW']
  },
  {
    id: 8,
    name: '헤리티지 앤티크 트래블 더플백',
    subtitle: 'Heritage Antique Travel Duffle Bag',
    price: 680000,
    discountRate: 12,
    rating: 5.0,
    reviewCount: 76,
    category: '여행가방',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    tags: ['PREMIUM']
  },
  {
    id: 9,
    name: '비엔나 위빙 스퀘어 토트백',
    subtitle: 'Vienna Woven Square Leather Tote',
    price: 410000,
    discountRate: 10,
    rating: 4.7,
    reviewCount: 119,
    category: '토트백',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    tags: ['BEST']
  },
  {
    id: 10,
    name: '아틀리에 미니 벨트 크로스백',
    subtitle: 'Atelier Mini Belt Crossbody Bag',
    price: 240000,
    discountRate: 8,
    rating: 4.8,
    reviewCount: 54,
    category: '크로스백',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    tags: ['NEW']
  }
];
