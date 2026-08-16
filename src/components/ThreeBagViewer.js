/**
 * @file ThreeBagViewer.js
 * @description Three.js를 사용하여 3D 가방 에셋을 렌더링하고 색상 변경 인터랙션을 처리하는 모듈
 */

import * as THREE from 'three';

/**
 * Three.js 3D 가방 뷰어 클래스
 */
export class ThreeBagViewer {
  /**
   * ThreeBagViewer 인스턴스를 생성합니다.
   * @param {HTMLElement} containerElement - 3D Canvas가 렌더링될 DOM 컨테이너
   * @param {string} initialColor - 초기 가방 색상 Hex 값 (예: '#1e1e24')
   */
  constructor(containerElement, initialColor = '#1e1e24') {
    this.container = containerElement;
    this.currentColor = new THREE.Color(initialColor);
    this.targetColor = new THREE.Color(initialColor);
    
    // 마우스 회전 인터랙션 관련 변수
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotationY = 0.4;
    this.targetRotationX = 0.1;
    
    this.init();
  }

  /**
   * Three.js 씬, 카메라, 조명, 가방 모델 및 이벤트 리스너를 초기화합니다.
   * @private
   * @returns {void}
   */
  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. 씬 생성
    this.scene = new THREE.Scene();
    this.scene.background = null; // 투명 배경으로 Glassmorphism 쇼케이스 조화

    // 2. 카메라 생성
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0.5, 6.5);

    // 3. 렌더러 생성
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);

    // 4. 조명 세팅 (럭셔리 스포트라이트 및 환경 광원)
    this.setupLighting();

    // 5. 3D 가방 그룹 및 마테리얼 생성
    this.bagGroup = new THREE.Group();
    this.scene.add(this.bagGroup);
    this.createBagMesh();

    // 6. 바닥 그림자 메시
    this.createShadowPlane();

    // 7. 인터랙션 이벤트 리스너 바인딩
    this.bindEvents();

    // 8. 애니메이션 루프 시작
    this.clock = new THREE.Clock();
    this.animate();
  }

  /**
   * 씬의 조명을 연출합니다.
   * @private
   * @returns {void}
   */
  setupLighting() {
    // 은은한 앰비언트 라이트
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // 메인 방향광 (주광)
    const mainLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001;
    this.scene.add(mainLight);

    // 보조 채움광 (Fill Light)
    const fillLight = new THREE.DirectionalLight(0x88bbff, 1.2);
    fillLight.position.set(-5, 3, -2);
    this.scene.add(fillLight);

    // 림 라이트 (후광 포인트 라이트)
    const rimLight = new THREE.PointLight(0xffd7aa, 2, 10);
    rimLight.position.set(0, 4, -4);
    this.scene.add(rimLight);
  }

  /**
   * Three.js 절차적 조형 기법으로 하이퀄리티 3D 토트백 메시를 조립합니다.
   * @private
   * @returns {void}
   */
  createBagMesh() {
    // 가방 바디 및 스트랩 마테리얼 (메인 가죽 마테리얼)
    this.bagMaterial = new THREE.MeshPhysicalMaterial({
      color: this.currentColor,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
      reflectivity: 0.5,
    });

    // 버클 및 지퍼 골드 메탈 마테리얼
    const goldMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6ca65,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1.5,
    });

    // 가방 안감 / 스티치 마테리얼
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x221d1b,
      roughness: 0.8,
    });

    // --- 1. 메인 가방 바디 (Main Body) ---
    // 가방 가로/세로/두께
    const bodyWidth = 2.4;
    const bodyHeight = 1.9;
    const bodyDepth = 1.1;

    // 가방 메인 형태 (약간의 사다리꼴 형태의 곡선)
    const shape = new THREE.Shape();
    const w = bodyWidth / 2;
    const h = bodyHeight / 2;
    const r = 0.25; // 모서리 둥글기

    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w * 0.85, h - r);
    shape.quadraticCurveTo(w * 0.85, h, w * 0.85 - r, h);
    shape.lineTo(-w * 0.85 + r, h);
    shape.quadraticCurveTo(-w * 0.85, h, -w * 0.85, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const extrudeSettings = {
      steps: 2,
      depth: bodyDepth,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.12,
      bevelOffset: 0,
      bevelSegments: 5,
    };

    const bodyGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    bodyGeometry.center();

    const bodyMesh = new THREE.Mesh(bodyGeometry, this.bagMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bagGroup.add(bodyMesh);

    // --- 2. 전면 정품 시그니처 플랩 포켓 (Front Flap Pocket) ---
    const pocketShape = new THREE.Shape();
    const pw = 0.9;
    const ph = 0.6;
    pocketShape.moveTo(-pw, -ph);
    pocketShape.lineTo(pw, -ph);
    pocketShape.lineTo(pw, ph * 0.5);
    pocketShape.quadraticCurveTo(0, ph * 1.1, -pw, ph * 0.5);
    pocketShape.lineTo(-pw, -ph);

    const pocketExtrude = {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    };
    const pocketGeo = new THREE.ExtrudeGeometry(pocketShape, pocketExtrude);
    pocketGeo.center();
    const pocketMesh = new THREE.Mesh(pocketGeo, this.bagMaterial);
    pocketMesh.position.set(0, -0.2, bodyDepth / 2 + 0.12);
    pocketMesh.castShadow = true;
    this.bagGroup.add(pocketMesh);

    // --- 3. 정면 골드 로고 메탈 엠블럼 ---
    const emblemGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32);
    emblemGeo.rotateX(Math.PI / 2);
    const emblemMesh = new THREE.Mesh(emblemGeo, goldMetalMaterial);
    emblemMesh.position.set(0, -0.15, bodyDepth / 2 + 0.22);
    this.bagGroup.add(emblemMesh);

    // --- 4. 손잡이 스트랩 (Handles - 좌/우 2개) ---
    const createHandle = (zPos) => {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.65, bodyHeight / 2 - 0.1, zPos),
        new THREE.Vector3(-0.65, bodyHeight / 2 + 1.25, zPos),
        new THREE.Vector3(0.65, bodyHeight / 2 + 1.25, zPos),
        new THREE.Vector3(0.65, bodyHeight / 2 - 0.1, zPos)
      );

      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.065, 12, false);
      const handleMesh = new THREE.Mesh(tubeGeo, this.bagMaterial);
      handleMesh.castShadow = true;
      this.bagGroup.add(handleMesh);

      // 손잡이 체결용 금속 고리 (Buckles)
      [-0.65, 0.65].forEach((xPos) => {
        const ringGeo = new THREE.TorusGeometry(0.09, 0.025, 16, 24);
        const ringMesh = new THREE.Mesh(ringGeo, goldMetalMaterial);
        ringMesh.position.set(xPos, bodyHeight / 2 - 0.05, zPos);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.castShadow = true;
        this.bagGroup.add(ringMesh);
      });
    };

    // 전면/후면 핸들 생성
    createHandle(bodyDepth / 2 - 0.08);
    createHandle(-bodyDepth / 2 + 0.08);

    // --- 5. 지퍼 디테일 (Zipper Top) ---
    const zipperGeo = new THREE.BoxGeometry(bodyWidth * 0.75, 0.05, 0.08);
    const zipperMesh = new THREE.Mesh(zipperGeo, goldMetalMaterial);
    zipperMesh.position.set(0, bodyHeight / 2 + 0.02, 0);
    this.bagGroup.add(zipperMesh);

    // 가방 초기 각도 설정
    this.bagGroup.rotation.y = this.targetRotationY;
    this.bagGroup.rotation.x = this.targetRotationX;
  }

  /**
   * 바닥에 은은한 럭셔리 그림자를 생성합니다.
   * @private
   * @returns {void}
   */
  createShadowPlane() {
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    
    // 바닥 섀도우 그래디언트 캔버스 생성
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.35;
    this.scene.add(shadowMesh);
  }

  /**
   * 마우스 드래그 및 터치 인터랙션을 바인딩합니다.
   * @private
   * @returns {void}
   */
  bindEvents() {
    const el = this.container;

    const onMouseDown = (e) => {
      this.isDragging = true;
      this.previousMousePosition = {
        x: e.clientX || (e.touches && e.touches[0].clientX),
        y: e.clientY || (e.touches && e.touches[0].clientY),
      };
    };

    const onMouseMove = (e) => {
      if (!this.isDragging) return;

      const currentX = e.clientX || (e.touches && e.touches[0].clientX);
      const currentY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = currentX - this.previousMousePosition.x;
      const deltaY = currentY - this.previousMousePosition.y;

      this.targetRotationY += deltaX * 0.008;
      this.targetRotationX += deltaY * 0.004;

      // X축 회전 각도 제한 (-30도 ~ +30도)
      this.targetRotationX = Math.max(-0.5, Math.min(0.5, this.targetRotationX));

      this.previousMousePosition = { x: currentX, y: currentY };
    };

    const onMouseUp = () => {
      this.isDragging = false;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    el.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // 윈도우 리사이즈 대응
    this.handleResize = () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('resize', this.handleResize);
  }

  /**
   * 외부 UI 스와치 클릭 시 가방 3D 색상을 변경합니다.
   * @param {string} hexColor - 변경할 16진수 색상 코드 (예: '#6b2d39')
   * @returns {void}
   */
  setBagColor(hexColor) {
    this.targetColor.set(hexColor);
  }

  /**
   * 프레임별 애니메이션 루프 (부유 효과, 회전 보간, 색상 부드러운 전환)
   * @private
   * @returns {void}
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // 1. 색상 부드러운 보간 (Lerp Color)
    this.currentColor.lerp(this.targetColor, 0.08);
    if (this.bagMaterial) {
      this.bagMaterial.color.copy(this.currentColor);
    }

    // 2. 마우스 드래그 회전 보간 (Damping)
    this.bagGroup.rotation.y += (this.targetRotationY - this.bagGroup.rotation.y) * 0.08;
    this.bagGroup.rotation.x += (this.targetRotationX - this.bagGroup.rotation.x) * 0.08;

    // 3. 은은한 자동 부유(Floating) 애니메이션 (드래그 중이 아닐 때)
    if (!this.isDragging) {
      this.bagGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      this.targetRotationY += 0.0025; // 매우 천천히 360도 회전
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 리소스를 정리하고 이벤트를 해제합니다.
   * @returns {void}
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
