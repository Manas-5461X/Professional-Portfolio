import { useEffect, useRef } from 'react';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Vector3,
  Raycaster,
  Vector2,
  PCFSoftShadowMap,
  Color
} from 'three';
import { buildRoom, RoomBuildResult } from './roomGeometry';
import { HotspotId, ROOM_HOTSPOTS } from './roomHotspots';

interface RoomCanvasProps {
  isDark: boolean;
  activeHotspot: HotspotId;
  onSelectHotspot: (id: HotspotId) => void;
  onHoverHotspot: (id: HotspotId | null) => void;
  onUpdateScreenPositions: (positions: Record<HotspotId, { x: number; y: number; visible: boolean }>) => void;
  isDrawerOpen: boolean;
}

export function RoomCanvas({
  isDark,
  activeHotspot,
  onSelectHotspot,
  onHoverHotspot,
  onUpdateScreenPositions,
  isDrawerOpen
}: RoomCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomDataRef = useRef<RoomBuildResult | null>(null);
  const activeHotspotRef = useRef<HotspotId>(activeHotspot);
  const isDrawerOpenRef = useRef<boolean>(isDrawerOpen);
  const isDarkRef = useRef<boolean>(isDark);

  activeHotspotRef.current = activeHotspot;
  isDrawerOpenRef.current = isDrawerOpen;
  isDarkRef.current = isDark;

  // Reactively update 3D materials on theme switch
  useEffect(() => {
    if (roomDataRef.current) {
      roomDataRef.current.updateTheme(isDark);
    }
  }, [isDark]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrameId: number;
    let renderer: WebGLRenderer;
    const scene = new Scene();

    const isMobile = window.innerWidth < 768;
    const initialPreset = isMobile
      ? ROOM_HOTSPOTS[activeHotspotRef.current].camera.mobile
      : ROOM_HOTSPOTS[activeHotspotRef.current].camera.desktop;

    const camera = new PerspectiveCamera(
      initialPreset.fov,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(...initialPreset.position);
    const lookAtTarget = new Vector3(...initialPreset.target);
    camera.lookAt(lookAtTarget);

    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error('WebGL init failed:', e);
      return;
    }

    // Background color matching portfolio theme
    const updateClearColor = (dark: boolean) => {
      renderer.setClearColor(new Color(dark ? '#121210' : '#EEEAE2'));
    };
    updateClearColor(isDarkRef.current);

    // Global ambient and directional lighting
    const ambientLight = new AmbientLight(isDarkRef.current ? 0x22242a : 0xfffaee, isDarkRef.current ? 0.7 : 1.3);
    scene.add(ambientLight);

    const sunDirLight = new DirectionalLight(isDarkRef.current ? 0x93c5fd : 0xfff7ed, isDarkRef.current ? 0.9 : 1.8);
    sunDirLight.position.set(7, 14, 8);
    sunDirLight.castShadow = true;
    sunDirLight.shadow.mapSize.width = 2048;
    sunDirLight.shadow.mapSize.height = 2048;
    sunDirLight.shadow.camera.near = 0.5;
    sunDirLight.shadow.camera.far = 30;
    const shadowD = 6;
    sunDirLight.shadow.camera.left = -shadowD;
    sunDirLight.shadow.camera.right = shadowD;
    sunDirLight.shadow.camera.top = shadowD;
    sunDirLight.shadow.camera.bottom = -shadowD;
    sunDirLight.shadow.bias = -0.0004;
    scene.add(sunDirLight);

    // Build the 3D room
    const roomData = buildRoom(isDarkRef.current);
    roomDataRef.current = roomData;
    scene.add(roomData.group);

    // Camera animation state
    const currentCamPos = camera.position.clone();
    const currentLookTarget = lookAtTarget.clone();
    let currentFov = camera.fov;

    // Subtle drag/orbit controls when in overview
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let orbitOffsetYaw = 0;
    let orbitOffsetPitch = 0;
    const raycaster = new Raycaster();
    const mouseNorm = new Vector2(-1000, -1000);

    const onPointerDown = (e: PointerEvent) => {
      if (activeHotspotRef.current !== 'overview') return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && activeHotspotRef.current === 'overview') {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        orbitOffsetYaw = Math.max(-0.4, Math.min(0.4, orbitOffsetYaw + deltaX * 0.004));
        orbitOffsetPitch = Math.max(-0.25, Math.min(0.25, orbitOffsetPitch - deltaY * 0.003));
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Hotspot click raycasting
    const onClick = (e: MouseEvent) => {
      // If clicking inside a drawer or button, ignore
      if ((e.target as HTMLElement).closest('.room-ui-overlay')) return;

      const rect = container.getBoundingClientRect();
      const clickNorm = new Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(clickNorm, camera);

      const interactive = roomData.interactiveMeshes;
      const categories: { id: HotspotId; objects: any[] }[] = [
        { id: 'workstation', objects: interactive.workstation },
        { id: 'serverRack', objects: interactive.serverRack },
        { id: 'whiteboard', objects: interactive.whiteboard },
        { id: 'bookshelf', objects: interactive.bookshelf },
        { id: 'trophyStand', objects: interactive.trophyStand }
      ];

      for (const cat of categories) {
        const hits = raycaster.intersectObjects(cat.objects, true);
        if (hits.length > 0) {
          onSelectHotspot(cat.id);
          return;
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onClick);

    // Responsive resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Main 60fps render loop
    let hoveredId: HotspotId | null = null;

    const animate = (time: number) => {
      animFrameId = requestAnimationFrame(animate);

      // Update clear color if theme changed
      updateClearColor(isDarkRef.current);

      // Determine destination camera preset
      const mobile = window.innerWidth < 768;
      const targetPreset = mobile
        ? ROOM_HOTSPOTS[activeHotspotRef.current].camera.mobile
        : ROOM_HOTSPOTS[activeHotspotRef.current].camera.desktop;

      const targetPos = new Vector3(...targetPreset.position);
      const targetLook = new Vector3(...targetPreset.target);
      const targetFov = targetPreset.fov;

      // Apply subtle orbit yaw/pitch offset only when in overview
      if (activeHotspotRef.current === 'overview') {
        const radius = Math.sqrt(targetPos.x * targetPos.x + targetPos.z * targetPos.z);
        const currentAngle = Math.atan2(targetPos.z, targetPos.x);
        const newAngle = currentAngle + orbitOffsetYaw;
        targetPos.x = Math.cos(newAngle) * radius;
        targetPos.z = Math.sin(newAngle) * radius;
        targetPos.y += orbitOffsetPitch * 4;
      }

      // Smooth interpolation (spring-like ease)
      const lerpFactor = 0.065;
      currentCamPos.lerp(targetPos, lerpFactor);
      currentLookTarget.lerp(targetLook, lerpFactor);
      currentFov += (targetFov - currentFov) * lerpFactor;

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookTarget);
      if (Math.abs(camera.fov - currentFov) > 0.05) {
        camera.fov = currentFov;
        camera.updateProjectionMatrix();
      }

      // Animate Server Rack blinking LEDs
      const t = time * 0.005;
      roomData.blinkingLeds.forEach((led, idx) => {
        const blink = Math.sin(t * (idx % 3 + 2) + idx) > 0.1;
        led.visible = blink;
      });

      // Animate ambient dust motes
      const positions = roomData.dustPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += 0.0015;
        if (positions[i * 3 + 1] > 4.2) {
          positions[i * 3 + 1] = 0.5;
        }
      }
      roomData.dustPoints.geometry.attributes.position.needsUpdate = true;

      // Raycast hover detection (only when no drawer is open)
      if (!isDrawerOpenRef.current && mouseNorm.x > -900) {
        raycaster.setFromCamera(mouseNorm, camera);
        const interactive = roomData.interactiveMeshes;
        const categories: { id: HotspotId; objects: any[] }[] = [
          { id: 'workstation', objects: interactive.workstation },
          { id: 'serverRack', objects: interactive.serverRack },
          { id: 'whiteboard', objects: interactive.whiteboard },
          { id: 'bookshelf', objects: interactive.bookshelf },
          { id: 'trophyStand', objects: interactive.trophyStand }
        ];

        let found: HotspotId | null = null;
        for (const cat of categories) {
          const hits = raycaster.intersectObjects(cat.objects, true);
          if (hits.length > 0) {
            found = cat.id;
            break;
          }
        }

        if (found !== hoveredId) {
          hoveredId = found;
          onHoverHotspot(hoveredId);
          container.style.cursor = found ? 'pointer' : 'default';
        }
      }

      // Project 3D Hotspot positions to 2D screen coordinates
      const screenCoords: Record<HotspotId, { x: number; y: number; visible: boolean }> = {} as any;
      const rect = container.getBoundingClientRect();
      const keys: HotspotId[] = ['workstation', 'serverRack', 'whiteboard', 'bookshelf', 'trophyStand'];

      keys.forEach((k) => {
        const hotspot = ROOM_HOTSPOTS[k];
        const v = new Vector3(...hotspot.worldPosition);
        v.project(camera);

        const isBehind = v.z > 1;
        const screenX = ((v.x + 1) * rect.width) / 2;
        const screenY = ((-v.y + 1) * rect.height) / 2;
        const inBounds = screenX > 20 && screenX < rect.width - 20 && screenY > 60 && screenY < rect.height - 40;

        screenCoords[k] = {
          x: Math.round(screenX),
          y: Math.round(screenY),
          visible: !isBehind && inBounds
        };
      });

      onUpdateScreenPositions(screenCoords);

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [onSelectHotspot, onHoverHotspot, onUpdateScreenPositions]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden select-none" />;
}
