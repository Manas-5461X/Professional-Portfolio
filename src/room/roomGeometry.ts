import {
  Group,
  Mesh,
  BoxGeometry,
  PlaneGeometry,
  CylinderGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Color,
  PointLight,
  SpotLight,
  DoubleSide,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  Object3D
} from 'three';
import {
  createIdeScreenTexture,
  createTerminalScreenTexture,
  createWhiteboardTexture,
  createWindowBackdropTexture
} from './roomTextures';

export interface RoomBuildResult {
  group: Group;
  interactiveMeshes: {
    workstation: Object3D[];
    serverRack: Object3D[];
    whiteboard: Object3D[];
    bookshelf: Object3D[];
    trophyStand: Object3D[];
  };
  blinkingLeds: Mesh[];
  dustPoints: Points;
  lights: {
    deskLampLight: SpotLight;
    serverRackLight: PointLight;
    sunLight: PointLight;
  };
  updateTheme: (isDark: boolean) => void;
}

export function buildRoom(isDark: boolean): RoomBuildResult {
  const group = new Group();
  const blinkingLeds: Mesh[] = [];

  // Theme palettes
  const getThemeColors = (dark: boolean) => ({
    wall: dark ? '#181816' : '#E8E3D7',
    floor: dark ? '#141412' : '#DFD9CC',
    baseboard: dark ? '#242422' : '#C7C0B0',
    deskWood: dark ? '#222220' : '#C8B8A2',
    deskMetal: dark ? '#111111' : '#2A2926',
    serverRack: dark ? '#101012' : '#1A1A1E',
    chairFabric: dark ? '#262624' : '#4A463F',
    rug: dark ? '#20201D' : '#D2CBBF',
    beanbag: dark ? '#282723' : '#B8B0A2',
    whiteboardFrame: dark ? '#333330' : '#C0BBB0',
    pedestal: dark ? '#222220' : '#DCD6C8'
  });

  const colors = getThemeColors(isDark);

  // Material registry for easy theme updates
  const wallMat = new MeshStandardMaterial({ color: new Color(colors.wall), roughness: 0.9, metalness: 0.05 });
  const floorMat = new MeshStandardMaterial({ color: new Color(colors.floor), roughness: 0.7, metalness: 0.1 });
  const baseboardMat = new MeshStandardMaterial({ color: new Color(colors.baseboard), roughness: 0.8 });
  const deskWoodMat = new MeshStandardMaterial({ color: new Color(colors.deskWood), roughness: 0.55, metalness: 0.1 });
  const deskMetalMat = new MeshStandardMaterial({ color: new Color(colors.deskMetal), roughness: 0.4, metalness: 0.8 });
  const serverRackMat = new MeshStandardMaterial({ color: new Color(colors.serverRack), roughness: 0.35, metalness: 0.7 });
  const chairMat = new MeshStandardMaterial({ color: new Color(colors.chairFabric), roughness: 0.8 });
  const rugMat = new MeshStandardMaterial({ color: new Color(colors.rug), roughness: 0.95 });
  const beanbagMat = new MeshStandardMaterial({ color: new Color(colors.beanbag), roughness: 0.9 });
  const pedestalMat = new MeshStandardMaterial({ color: new Color(colors.pedestal), roughness: 0.5 });

  // -------------------------------------------------------------
  // 1. FLOOR & ISOMETRIC WALLS
  // -------------------------------------------------------------
  const ROOM_SIZE = 8.4;
  const WALL_HEIGHT = 4.8;
  const WALL_THICK = 0.28;

  // Floor
  const floorGeo = new BoxGeometry(ROOM_SIZE, 0.4, ROOM_SIZE);
  const floorMesh = new Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.2, 0);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Back Wall (Z = -ROOM_SIZE / 2)
  const backWallGeo = new BoxGeometry(ROOM_SIZE + WALL_THICK, WALL_HEIGHT, WALL_THICK);
  const backWallMesh = new Mesh(backWallGeo, wallMat);
  backWallMesh.position.set(0, WALL_HEIGHT / 2, -ROOM_SIZE / 2 - WALL_THICK / 2);
  backWallMesh.receiveShadow = true;
  group.add(backWallMesh);

  // Left Wall (X = -ROOM_SIZE / 2)
  const leftWallGeo = new BoxGeometry(WALL_THICK, WALL_HEIGHT, ROOM_SIZE);
  const leftWallMesh = new Mesh(leftWallGeo, wallMat);
  leftWallMesh.position.set(-ROOM_SIZE / 2 - WALL_THICK / 2, WALL_HEIGHT / 2, 0);
  leftWallMesh.receiveShadow = true;
  group.add(leftWallMesh);

  // Baseboard trim along back and left walls
  const bbBack = new Mesh(new BoxGeometry(ROOM_SIZE, 0.18, 0.06), baseboardMat);
  bbBack.position.set(0, 0.09, -ROOM_SIZE / 2 + 0.03);
  group.add(bbBack);

  const bbLeft = new Mesh(new BoxGeometry(0.06, 0.18, ROOM_SIZE), baseboardMat);
  bbLeft.position.set(-ROOM_SIZE / 2 + 0.03, 0.09, 0);
  group.add(bbLeft);

  // -------------------------------------------------------------
  // 2. LOFT WINDOW WITH DYNAMIC SKY BACKDROP
  // -------------------------------------------------------------
  const winGroup = new Group();
  winGroup.position.set(-1.8, 2.7, -ROOM_SIZE / 2 + 0.02);

  const winFrameMat = new MeshStandardMaterial({ color: isDark ? 0x222222 : 0x4a4740, roughness: 0.5, metalness: 0.6 });
  const winWidth = 2.4;
  const winHeight = 2.0;
  const frameThickness = 0.08;

  // Window frame border
  const topF = new Mesh(new BoxGeometry(winWidth, frameThickness, 0.1), winFrameMat);
  topF.position.y = winHeight / 2;
  const botF = new Mesh(new BoxGeometry(winWidth, frameThickness, 0.1), winFrameMat);
  botF.position.y = -winHeight / 2;
  const leftF = new Mesh(new BoxGeometry(frameThickness, winHeight, 0.1), winFrameMat);
  leftF.position.x = -winWidth / 2;
  const rightF = new Mesh(new BoxGeometry(frameThickness, winHeight, 0.1), winFrameMat);
  rightF.position.x = winWidth / 2;
  const midVert = new Mesh(new BoxGeometry(frameThickness * 0.7, winHeight, 0.08), winFrameMat);
  const midHoriz = new Mesh(new BoxGeometry(winWidth, frameThickness * 0.7, 0.08), winFrameMat);
  winGroup.add(topF, botF, leftF, rightF, midVert, midHoriz);

  // Window sill
  const sill = new Mesh(new BoxGeometry(winWidth + 0.3, 0.08, 0.22), deskWoodMat);
  sill.position.set(0, -winHeight / 2 - 0.04, 0.06);
  winGroup.add(sill);

  // Window glass / backdrop plane
  const winBackdropMat = new MeshBasicMaterial({
    map: createWindowBackdropTexture(isDark),
    side: DoubleSide
  });
  const winBackdrop = new Mesh(new PlaneGeometry(winWidth - 0.08, winHeight - 0.08), winBackdropMat);
  winBackdrop.position.set(0, 0, -0.01);
  winGroup.add(winBackdrop);

  group.add(winGroup);

  // -------------------------------------------------------------
  // 3. WORKSTATION (DESK, DUAL MONITORS, KEYBOARD, CHAIR)
  // -------------------------------------------------------------
  const workstationGroup = new Group();
  workstationGroup.position.set(2.5, 0, -2.6);

  // Desk Top
  const deskWidth = 2.4;
  const deskDepth = 1.1;
  const deskThick = 0.07;
  const deskHeight = 1.18;

  const deskTop = new Mesh(new BoxGeometry(deskWidth, deskThick, deskDepth), deskWoodMat);
  deskTop.position.set(0, deskHeight, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  workstationGroup.add(deskTop);

  // Desk Legs (Minimalist steel loop legs)
  const legGeo = new BoxGeometry(0.06, deskHeight, deskDepth - 0.15);
  const leftLeg = new Mesh(legGeo, deskMetalMat);
  leftLeg.position.set(-deskWidth / 2 + 0.12, deskHeight / 2, 0);
  leftLeg.castShadow = true;
  const rightLeg = new Mesh(legGeo, deskMetalMat);
  rightLeg.position.set(deskWidth / 2 - 0.12, deskHeight / 2, 0);
  rightLeg.castShadow = true;
  workstationGroup.add(leftLeg, rightLeg);

  // Desk Mat (Leather / Felt pad)
  const matMat = new MeshStandardMaterial({ color: isDark ? 0x161616 : 0x333333, roughness: 0.9 });
  const deskMat = new Mesh(new BoxGeometry(1.4, 0.01, 0.65), matMat);
  deskMat.position.set(-0.1, deskHeight + deskThick / 2 + 0.006, 0.05);
  deskMat.receiveShadow = true;
  workstationGroup.add(deskMat);

  // Main Ultrawide Monitor (Landscape)
  const ultrawideGroup = new Group();
  ultrawideGroup.position.set(-0.15, deskHeight + deskThick / 2, -0.22);

  // Stand
  const standBase = new Mesh(new CylinderGeometry(0.14, 0.16, 0.02, 24), deskMetalMat);
  const standArm = new Mesh(new CylinderGeometry(0.025, 0.025, 0.38, 16), deskMetalMat);
  standArm.position.set(0, 0.19, -0.06);
  standArm.rotation.x = 0.15;
  ultrawideGroup.add(standBase, standArm);

  // Monitor Bezel
  const uwWidth = 1.18;
  const uwHeight = 0.62;
  const uwBezel = new Mesh(
    new BoxGeometry(uwWidth, uwHeight, 0.04),
    new MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 })
  );
  uwBezel.position.set(0, 0.44, 0);
  uwBezel.castShadow = true;
  ultrawideGroup.add(uwBezel);

  // Monitor Screen (CodeForensics IDE)
  const uwScreenMat = new MeshBasicMaterial({
    map: createIdeScreenTexture(isDark)
  });
  const uwScreen = new Mesh(new PlaneGeometry(uwWidth - 0.04, uwHeight - 0.04), uwScreenMat);
  uwScreen.position.set(0, 0.44, 0.022);
  ultrawideGroup.add(uwScreen);
  workstationGroup.add(ultrawideGroup);

  // Vertical Secondary Monitor (Portrait)
  const vertMonitorGroup = new Group();
  vertMonitorGroup.position.set(0.72, deskHeight + deskThick / 2, -0.16);
  vertMonitorGroup.rotation.y = -0.32; // Angled toward user

  const vStand = new Mesh(new CylinderGeometry(0.11, 0.12, 0.02, 20), deskMetalMat);
  const vArm = new Mesh(new CylinderGeometry(0.022, 0.022, 0.45, 16), deskMetalMat);
  vArm.position.set(0, 0.22, -0.05);
  vertMonitorGroup.add(vStand, vArm);

  const vWidth = 0.42;
  const vHeight = 0.72;
  const vBezel = new Mesh(new BoxGeometry(vWidth, vHeight, 0.035), deskMetalMat);
  vBezel.position.set(0, 0.44, 0);
  vertMonitorGroup.add(vBezel);

  // Vertical Screen (DPI Engine Terminal)
  const vScreenMat = new MeshBasicMaterial({
    map: createTerminalScreenTexture(isDark)
  });
  const vScreen = new Mesh(new PlaneGeometry(vWidth - 0.03, vHeight - 0.03), vScreenMat);
  vScreen.position.set(0, 0.44, 0.019);
  vertMonitorGroup.add(vScreen);
  workstationGroup.add(vertMonitorGroup);

  // Mechanical Keyboard
  const kbGroup = new Group();
  kbGroup.position.set(-0.15, deskHeight + deskThick / 2 + 0.012, 0.12);
  const kbBase = new Mesh(
    new BoxGeometry(0.48, 0.02, 0.18),
    new MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 })
  );
  kbGroup.add(kbBase);
  // Keyboard key row
  const keyMat = new MeshStandardMaterial({ color: isDark ? 0x27272a : 0x3f3f46, roughness: 0.5 });
  const keyHighlightMat = new MeshBasicMaterial({ color: 0xff5a28 });
  const keysMesh = new Mesh(new BoxGeometry(0.44, 0.01, 0.15), keyMat);
  keysMesh.position.y = 0.012;
  const spacebar = new Mesh(new BoxGeometry(0.14, 0.012, 0.024), keyHighlightMat);
  spacebar.position.set(0, 0.014, 0.05);
  kbGroup.add(keysMesh, spacebar);
  workstationGroup.add(kbGroup);

  // Mouse
  const mouse = new Mesh(
    new BoxGeometry(0.08, 0.025, 0.13),
    new MeshStandardMaterial({ color: 0x1f1f23, roughness: 0.4 })
  );
  mouse.position.set(0.3, deskHeight + deskThick / 2 + 0.015, 0.12);
  workstationGroup.add(mouse);

  // BITS Pilani Coffee Mug
  const mugGroup = new Group();
  mugGroup.position.set(-0.7, deskHeight + deskThick / 2 + 0.08, 0.0);
  const mugBody = new Mesh(
    new CylinderGeometry(0.05, 0.045, 0.11, 20),
    new MeshStandardMaterial({ color: 0xff4d1c, roughness: 0.3, metalness: 0.1 })
  );
  const mugInside = new Mesh(
    new CylinderGeometry(0.042, 0.042, 0.02, 16),
    new MeshStandardMaterial({ color: 0x2c1d11, roughness: 0.9 })
  );
  mugInside.position.y = 0.046;
  mugGroup.add(mugBody, mugInside);
  workstationGroup.add(mugGroup);

  // Architectural Desk Lamp
  const lampGroup = new Group();
  lampGroup.position.set(-0.95, deskHeight + deskThick / 2, -0.32);
  const lampBase = new Mesh(new CylinderGeometry(0.1, 0.11, 0.025, 20), deskMetalMat);
  const lampArm1 = new Mesh(new CylinderGeometry(0.012, 0.012, 0.35, 12), deskMetalMat);
  lampArm1.position.set(0, 0.18, 0);
  lampArm1.rotation.z = -0.3;
  const lampArm2 = new Mesh(new CylinderGeometry(0.012, 0.012, 0.32, 12), deskMetalMat);
  lampArm2.position.set(0.12, 0.42, 0);
  lampArm2.rotation.z = 0.6;
  const lampShade = new Mesh(
    new CylinderGeometry(0.04, 0.09, 0.12, 16),
    new MeshStandardMaterial({ color: isDark ? 0xff5a28 : 0x2a2825, roughness: 0.4, metalness: 0.5 })
  );
  lampShade.position.set(0.24, 0.48, 0);
  lampShade.rotation.z = 1.2;
  lampGroup.add(lampBase, lampArm1, lampArm2, lampShade);

  // Desk Lamp Spotlight
  const deskLampLight = new SpotLight(0xffb86c, isDark ? 3.2 : 1.2, 3.8, Math.PI / 4, 0.4, 1.2);
  deskLampLight.position.set(0.24, 0.48, 0);
  deskLampLight.target.position.set(0.24, -0.5, 0.4);
  lampGroup.add(deskLampLight);
  lampGroup.add(deskLampLight.target);
  workstationGroup.add(lampGroup);

  // Ergonomic Swivel Chair
  const chairGroup = new Group();
  chairGroup.position.set(0, 0, 0.7);

  // 5-star base with wheels
  const baseCenter = new Mesh(new CylinderGeometry(0.06, 0.06, 0.08, 16), deskMetalMat);
  baseCenter.position.y = 0.12;
  chairGroup.add(baseCenter);
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const spoke = new Mesh(new BoxGeometry(0.04, 0.03, 0.32), deskMetalMat);
    spoke.position.set(Math.sin(angle) * 0.16, 0.1, Math.cos(angle) * 0.16);
    spoke.rotation.y = angle;
    chairGroup.add(spoke);
  }
  // Hydraulic stem
  const stem = new Mesh(new CylinderGeometry(0.035, 0.035, 0.38, 16), deskMetalMat);
  stem.position.y = 0.32;
  chairGroup.add(stem);

  // Seat Cushion
  const seat = new Mesh(new BoxGeometry(0.56, 0.09, 0.52), chairMat);
  seat.position.y = 0.54;
  chairGroup.add(seat);

  // Backrest (Ergonomic curve mesh)
  const backrest = new Mesh(new BoxGeometry(0.52, 0.68, 0.06), chairMat);
  backrest.position.set(0, 0.94, 0.25);
  backrest.rotation.x = -0.08;
  chairGroup.add(backrest);

  // Armrests
  const armL = new Mesh(new BoxGeometry(0.06, 0.22, 0.3), deskMetalMat);
  armL.position.set(-0.31, 0.72, 0.05);
  const armR = new Mesh(new BoxGeometry(0.06, 0.22, 0.3), deskMetalMat);
  armR.position.set(0.31, 0.72, 0.05);
  chairGroup.add(armL, armR);

  workstationGroup.add(chairGroup);
  group.add(workstationGroup);

  // -------------------------------------------------------------
  // 4. SYSTEMS & SECURITY SERVER RACK (19" CABINET)
  // -------------------------------------------------------------
  const serverRackGroup = new Group();
  serverRackGroup.position.set(3.4, 0, 1.2);
  serverRackGroup.rotation.y = -Math.PI / 2; // Facing into the room

  const rackW = 1.0;
  const rackH = 2.4;
  const rackD = 0.85;

  // Frame enclosure
  const rackOuter = new Mesh(new BoxGeometry(rackW, rackH, rackD), serverRackMat);
  rackOuter.position.y = rackH / 2;
  rackOuter.castShadow = true;
  serverRackGroup.add(rackOuter);

  // Dark internal recess
  const rackRecess = new Mesh(
    new BoxGeometry(rackW - 0.14, rackH - 0.2, 0.1),
    new MeshStandardMaterial({ color: 0x08080a, roughness: 0.9 })
  );
  rackRecess.position.set(0, rackH / 2, rackD / 2 - 0.04);
  serverRackGroup.add(rackRecess);

  // Server Chassis Units & Network Switches
  const chassisMat = new MeshStandardMaterial({ color: 0x1f2024, roughness: 0.4, metalness: 0.6 });
  const ledGreenMat = new MeshBasicMaterial({ color: 0x10b981 });
  const ledAmberMat = new MeshBasicMaterial({ color: 0xf59e0b });
  const ledCyanMat = new MeshBasicMaterial({ color: 0x06b6d4 });

  const numUnits = 7;
  const uHeight = 0.22;
  const startY = 0.35;

  for (let u = 0; u < numUnits; u++) {
    const unitY = startY + u * (uHeight + 0.05);
    const unitMesh = new Mesh(new BoxGeometry(rackW - 0.18, uHeight, 0.14), chassisMat);
    unitMesh.position.set(0, unitY, rackD / 2 - 0.02);
    serverRackGroup.add(unitMesh);

    // Ventilation grilles / faceplate slots
    const slot = new Mesh(new BoxGeometry(0.35, 0.04, 0.02), new MeshBasicMaterial({ color: 0x09090b }));
    slot.position.set(-0.16, unitY, rackD / 2 + 0.052);
    serverRackGroup.add(slot);

    // Blinking status LEDs on each unit
    for (let led = 0; led < 6; led++) {
      const mat = led % 3 === 0 ? ledCyanMat : led % 2 === 0 ? ledAmberMat : ledGreenMat;
      const ledDot = new Mesh(new SphereGeometry(0.012, 8, 8), mat);
      ledDot.position.set(0.12 + led * 0.038, unitY + 0.02, rackD / 2 + 0.055);
      blinkingLeds.push(ledDot);
      serverRackGroup.add(ledDot);
    }
  }

  // DPI Engine Network Appliance Badge
  const dpiApplianceBadge = new Mesh(
    new BoxGeometry(0.48, 0.08, 0.01),
    new MeshBasicMaterial({ color: 0xff5a28 })
  );
  dpiApplianceBadge.position.set(-0.12, 1.72, rackD / 2 + 0.058);
  serverRackGroup.add(dpiApplianceBadge);

  // Soft internal cabinet point light
  const serverRackLight = new PointLight(0x06b6d4, isDark ? 1.6 : 0.8, 2.4);
  serverRackLight.position.set(0, 1.4, rackD / 2 + 0.15);
  serverRackGroup.add(serverRackLight);

  group.add(serverRackGroup);

  // -------------------------------------------------------------
  // 5. ARCHITECTURAL WHITEBOARD (LEFT WALL)
  // -------------------------------------------------------------
  const wbGroup = new Group();
  wbGroup.position.set(-ROOM_SIZE / 2 + 0.04, 2.4, -0.6);
  wbGroup.rotation.y = Math.PI / 2; // Glued to left wall

  const wbW = 2.8;
  const wbH = 1.7;

  // Frame
  const wbFrame = new Mesh(
    new BoxGeometry(wbW + 0.08, wbH + 0.08, 0.04),
    new MeshStandardMaterial({ color: colors.whiteboardFrame, roughness: 0.3, metalness: 0.8 })
  );
  wbGroup.add(wbFrame);

  // Board surface with architecture diagrams
  const wbSurfaceMat = new MeshBasicMaterial({
    map: createWhiteboardTexture(isDark)
  });
  const wbSurface = new Mesh(new PlaneGeometry(wbW, wbH), wbSurfaceMat);
  wbSurface.position.z = 0.022;
  wbGroup.add(wbSurface);

  // Marker tray & pens
  const tray = new Mesh(new BoxGeometry(wbW - 0.4, 0.03, 0.12), deskMetalMat);
  tray.position.set(0, -wbH / 2 - 0.02, 0.06);
  wbGroup.add(tray);

  const markerColors = [0xff4d1c, 0x0284c7, 0x111111, 0x10b981];
  markerColors.forEach((mCol, idx) => {
    const pen = new Mesh(
      new CylinderGeometry(0.01, 0.01, 0.14, 10),
      new MeshStandardMaterial({ color: mCol, roughness: 0.4 })
    );
    pen.rotation.z = Math.PI / 2;
    pen.position.set(-0.2 + idx * 0.12, -wbH / 2 + 0.02, 0.06);
    wbGroup.add(pen);
  });

  group.add(wbGroup);

  // -------------------------------------------------------------
  // 6. BOOKSHELF & CS LIBRARY (BACK WALL)
  // -------------------------------------------------------------
  const bsGroup = new Group();
  bsGroup.position.set(0.65, 0, -ROOM_SIZE / 2 + 0.32);

  const bsW = 1.4;
  const bsH = 2.9;
  const bsD = 0.42;
  const bsThick = 0.04;

  const bsWoodMat = deskWoodMat;

  // Outer frame
  const bsTop = new Mesh(new BoxGeometry(bsW, bsThick, bsD), bsWoodMat);
  bsTop.position.y = bsH;
  const bsBot = new Mesh(new BoxGeometry(bsW, bsThick, bsD), bsWoodMat);
  bsBot.position.y = 0.04;
  const bsLeft = new Mesh(new BoxGeometry(bsThick, bsH, bsD), bsWoodMat);
  bsLeft.position.set(-bsW / 2 + bsThick / 2, bsH / 2, 0);
  const bsRight = new Mesh(new BoxGeometry(bsThick, bsH, bsD), bsWoodMat);
  bsRight.position.set(bsW / 2 - bsThick / 2, bsH / 2, 0);
  bsGroup.add(bsTop, bsBot, bsLeft, bsRight);

  // Shelves
  const numShelves = 4;
  const bookColors = [
    0x2563eb, 0xd97706, 0x059669, 0xdc2626, 0x7c3aed,
    0x0284c7, 0x4f46e5, 0x16a34a, 0xe11d48, 0x475569
  ];

  for (let s = 1; s <= numShelves; s++) {
    const sY = (s * bsH) / (numShelves + 1);
    const shelf = new Mesh(new BoxGeometry(bsW - bsThick * 2, bsThick, bsD), bsWoodMat);
    shelf.position.y = sY;
    bsGroup.add(shelf);

    // Place realistic CS textbooks on shelf
    const booksInShelf = s === 1 ? 9 : s === 2 ? 8 : 6;
    let bX = -bsW / 2 + 0.12;
    for (let b = 0; b < booksInShelf; b++) {
      const bH = 0.32 + (b % 4) * 0.05;
      const bThick = 0.05 + (b % 3) * 0.02;
      const bColor = bookColors[(s * 3 + b) % bookColors.length];
      const bookMat = new MeshStandardMaterial({ color: bColor, roughness: 0.7 });
      const book = new Mesh(new BoxGeometry(bThick, bH, bsD - 0.12), bookMat);
      book.position.set(bX + bThick / 2, sY + bH / 2 + bsThick / 2, 0);
      // Slight tilt on the last book
      if (b === booksInShelf - 1) {
        book.rotation.z = -0.15;
      }
      bsGroup.add(book);
      bX += bThick + 0.012;
    }
  }

  // Framed BITS Pilani Diploma on 3rd shelf
  const frameMat = new MeshStandardMaterial({ color: 0x92400e, roughness: 0.4, metalness: 0.5 });
  const diplomaFrame = new Mesh(new BoxGeometry(0.38, 0.48, 0.04), frameMat);
  diplomaFrame.position.set(0.32, (3 * bsH) / (numShelves + 1) + 0.28, 0.05);
  diplomaFrame.rotation.y = -0.2;
  const diplomaPaper = new Mesh(
    new PlaneGeometry(0.32, 0.42),
    new MeshBasicMaterial({ color: 0xfefce8 })
  );
  diplomaPaper.position.z = 0.022;
  diplomaFrame.add(diplomaPaper);
  bsGroup.add(diplomaFrame);

  // Potted plant on top of bookshelf
  const pot = new Mesh(
    new CylinderGeometry(0.14, 0.1, 0.2, 16),
    new MeshStandardMaterial({ color: isDark ? 0xd1d5db : 0xf3f4f6, roughness: 0.4 })
  );
  pot.position.set(-0.35, bsH + 0.1, 0);
  bsGroup.add(pot);

  // Monstera plant leaves
  const leafMat = new MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
  for (let l = 0; l < 5; l++) {
    const leaf = new Mesh(new SphereGeometry(0.12, 8, 8), leafMat);
    leaf.scale.set(1.4, 0.1, 0.8);
    const lAngle = (l * Math.PI * 2) / 5;
    leaf.position.set(-0.35 + Math.cos(lAngle) * 0.14, bsH + 0.22 + l * 0.04, Math.sin(lAngle) * 0.14);
    leaf.rotation.set(0.3, lAngle, 0.4);
    bsGroup.add(leaf);
  }

  group.add(bsGroup);

  // -------------------------------------------------------------
  // 7. MILESTONE TROPHY STAND (PEDESTAL WITH 26★, LEETCODE, GIT)
  // -------------------------------------------------------------
  const trophyGroup = new Group();
  trophyGroup.position.set(1.6, 0, 2.4);

  // Architectural Pedestal (Fluted column block)
  const pedestalHeight = 0.88;
  const pedBody = new Mesh(new CylinderGeometry(0.38, 0.44, pedestalHeight, 24), pedestalMat);
  pedBody.position.y = pedestalHeight / 2;
  pedBody.castShadow = true;
  pedBody.receiveShadow = true;
  trophyGroup.add(pedBody);

  const pedTop = new Mesh(new CylinderGeometry(0.42, 0.38, 0.06, 24), pedestalMat);
  pedTop.position.y = pedestalHeight + 0.03;
  trophyGroup.add(pedTop);

  // 1. DPI Engine 26★ Golden Star Trophy
  const starTrophyGroup = new Group();
  starTrophyGroup.position.set(0, pedestalHeight + 0.06, 0);

  const starBase = new Mesh(
    new CylinderGeometry(0.1, 0.12, 0.06, 20),
    new MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 })
  );
  starTrophyGroup.add(starBase);

  // Gold material for the 26 Stars award
  const goldMat = new MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.95
  });

  const starMesh = new Mesh(new BoxGeometry(0.14, 0.14, 0.04), goldMat);
  starMesh.position.y = 0.14;
  starMesh.rotation.z = Math.PI / 4; // Diamond / Star form
  starTrophyGroup.add(starMesh);

  // Plaque inscription
  const starPlaque = new Mesh(
    new BoxGeometry(0.16, 0.04, 0.01),
    new MeshBasicMaterial({ color: 0xffedd5 })
  );
  starPlaque.position.set(0, 0.03, 0.12);
  starTrophyGroup.add(starPlaque);
  trophyGroup.add(starTrophyGroup);

  // 2. LeetCode 157 Solver Badge (Left of star)
  const leetBadgeGroup = new Group();
  leetBadgeGroup.position.set(-0.22, pedestalHeight + 0.06, 0.08);
  leetBadgeGroup.rotation.y = 0.35;

  const leetBase = new Mesh(new CylinderGeometry(0.07, 0.08, 0.04, 16), deskMetalMat);
  const leetHex = new Mesh(
    new CylinderGeometry(0.08, 0.08, 0.03, 6),
    new MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 })
  );
  leetHex.position.y = 0.09;
  leetHex.rotation.x = Math.PI / 2;
  leetBadgeGroup.add(leetBase, leetHex);
  trophyGroup.add(leetBadgeGroup);

  // 3. GitHub 1,000+ Contributions Crystal Award (Right of star)
  const gitAwardGroup = new Group();
  gitAwardGroup.position.set(0.22, pedestalHeight + 0.06, 0.08);
  gitAwardGroup.rotation.y = -0.35;

  const crystalMat = new MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });
  const gitBlock = new Mesh(new BoxGeometry(0.12, 0.22, 0.06), crystalMat);
  gitBlock.position.y = 0.11;
  gitAwardGroup.add(gitBlock);
  trophyGroup.add(gitAwardGroup);

  group.add(trophyGroup);

  // -------------------------------------------------------------
  // 8. LOUNGE NOOK: WOVEN RUG, BEANBAG & FLOOR PLANT
  // -------------------------------------------------------------
  // Circular woven rug in the center
  const rugMesh = new Mesh(new CylinderGeometry(1.65, 1.65, 0.015, 36), rugMat);
  rugMesh.position.set(-0.6, 0.008, 0.4);
  rugMesh.receiveShadow = true;
  group.add(rugMesh);

  // Sculptural contemporary beanbag
  const beanbag = new Mesh(new SphereGeometry(0.68, 24, 20), beanbagMat);
  beanbag.scale.set(1.1, 0.65, 1.0);
  beanbag.position.set(-2.2, 0.35, 1.8);
  beanbag.castShadow = true;
  group.add(beanbag);

  // Large floor plant in modern ceramic planter
  const floorPot = new Mesh(
    new CylinderGeometry(0.25, 0.18, 0.48, 20),
    new MeshStandardMaterial({ color: isDark ? 0x222222 : 0xf1f1ed, roughness: 0.5 })
  );
  floorPot.position.set(-3.2, 0.24, 2.9);
  floorPot.castShadow = true;
  group.add(floorPot);

  // Snake plant vertical architectural leaves
  for (let sp = 0; sp < 7; sp++) {
    const leafHeight = 0.75 + (sp % 3) * 0.2;
    const leaf = new Mesh(
      new BoxGeometry(0.08, leafHeight, 0.02),
      new MeshStandardMaterial({ color: sp % 2 === 0 ? 0x15803d : 0x166534, roughness: 0.4 })
    );
    const angle = (sp * Math.PI * 2) / 7;
    leaf.position.set(-3.2 + Math.cos(angle) * 0.1, 0.48 + leafHeight / 2, 2.9 + Math.sin(angle) * 0.1);
    leaf.rotation.set((sp % 3 - 1) * 0.08, angle, (sp % 2 === 0 ? 1 : -1) * 0.06);
    group.add(leaf);
  }

  // -------------------------------------------------------------
  // 9. AMBIENT LIGHT MOTE PARTICLES
  // -------------------------------------------------------------
  const particleCount = 80;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 6.0;
    particlePositions[i * 3 + 1] = 0.5 + Math.random() * 3.5;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(particlePositions, 3));
  const dustMat = new PointsMaterial({
    size: 0.035,
    color: isDark ? 0xffaa44 : 0xffffff,
    transparent: true,
    opacity: 0.55
  });
  const dustPoints = new Points(dustGeo, dustMat);
  group.add(dustPoints);

  // -------------------------------------------------------------
  // 10. LIGHT SOURCES
  // -------------------------------------------------------------
  // Sunlight coming through the window
  const sunLight = new PointLight(isDark ? 0x64748b : 0xfff1d6, isDark ? 0.9 : 2.4, 16);
  sunLight.position.set(-3.5, 4.5, -5.2);
  sunLight.castShadow = true;
  group.add(sunLight);

  // Group interactive elements for raycasting
  const interactiveMeshes = {
    workstation: [deskTop, uwBezel, uwScreen, vBezel, vScreen, kbBase, chairGroup],
    serverRack: [rackOuter, rackRecess, dpiApplianceBadge],
    whiteboard: [wbFrame, wbSurface],
    bookshelf: [bsTop, bsBot, bsLeft, bsRight, diplomaFrame],
    trophyStand: [pedBody, pedTop, starMesh, leetHex, gitBlock]
  };

  // Theme update function
  const updateTheme = (dark: boolean) => {
    const c = getThemeColors(dark);
    wallMat.color.set(c.wall);
    floorMat.color.set(c.floor);
    baseboardMat.color.set(c.baseboard);
    deskWoodMat.color.set(c.deskWood);
    deskMetalMat.color.set(c.deskMetal);
    serverRackMat.color.set(c.serverRack);
    chairMat.color.set(c.chairFabric);
    rugMat.color.set(c.rug);
    beanbagMat.color.set(c.beanbag);
    pedestalMat.color.set(c.pedestal);

    // Update screen textures
    uwScreenMat.map = createIdeScreenTexture(dark);
    uwScreenMat.needsUpdate = true;
    vScreenMat.map = createTerminalScreenTexture(dark);
    vScreenMat.needsUpdate = true;
    wbSurfaceMat.map = createWhiteboardTexture(dark);
    wbSurfaceMat.needsUpdate = true;
    winBackdropMat.map = createWindowBackdropTexture(dark);
    winBackdropMat.needsUpdate = true;

    // Adjust light colors & intensities
    sunLight.color.set(dark ? 0x64748b : 0xfff1d6);
    sunLight.intensity = dark ? 0.9 : 2.4;
    deskLampLight.intensity = dark ? 3.2 : 1.2;
    serverRackLight.intensity = dark ? 1.6 : 0.8;
    dustMat.color.set(dark ? 0xffaa44 : 0xffffff);
  };

  return {
    group,
    interactiveMeshes,
    blinkingLeds,
    dustPoints,
    lights: {
      deskLampLight,
      serverRackLight,
      sunLight
    },
    updateTheme
  };
}
