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
    ambientLight: PointLight;
    overheadLight: PointLight;
    deskLampLight: PointLight;
    serverRackLight: PointLight;
    neonSignLight: PointLight;
    moonLight: PointLight;
  };
  updateTheme: (isDark: boolean) => void;
}

export function buildRoom(isDark: boolean): RoomBuildResult {
  const group = new Group();
  const blinkingLeds: Mesh[] = [];

  // Theme palettes: Dark mode is a luminous, high-tech cyber penthouse, NOT pitch black!
  const getThemeColors = (dark: boolean) => ({
    wall: dark ? '#26262D' : '#E8E3D7',
    floor: dark ? '#1E1E24' : '#DFD9CC',
    baseboard: dark ? '#34343D' : '#C7C0B0',
    platformRim: dark ? '#FF5A28' : '#FF4D1C',
    deskWood: dark ? '#2D2D35' : '#C8B8A2',
    deskMetal: dark ? '#18181C' : '#2A2926',
    serverRack: dark ? '#18181E' : '#1A1A1E',
    chairFabric: dark ? '#363640' : '#4A463F',
    rug: dark ? '#282830' : '#D2CBBF',
    beanbag: dark ? '#32323C' : '#B8B0A2',
    whiteboardFrame: dark ? '#4A4A58' : '#C0BBB0',
    pedestal: dark ? '#2B2B33' : '#DCD6C8'
  });

  const colors = getThemeColors(isDark);

  // Material registry
  const wallMat = new MeshStandardMaterial({ color: new Color(colors.wall), roughness: 0.85, metalness: 0.05 });
  const floorMat = new MeshStandardMaterial({ color: new Color(colors.floor), roughness: 0.65, metalness: 0.1 });
  const baseboardMat = new MeshStandardMaterial({ color: new Color(colors.baseboard), roughness: 0.7 });
  const platformRimMat = new MeshBasicMaterial({ color: new Color(colors.platformRim) });
  const deskWoodMat = new MeshStandardMaterial({ color: new Color(colors.deskWood), roughness: 0.5, metalness: 0.1 });
  const deskMetalMat = new MeshStandardMaterial({ color: new Color(colors.deskMetal), roughness: 0.35, metalness: 0.8 });
  const serverRackMat = new MeshStandardMaterial({ color: new Color(colors.serverRack), roughness: 0.3, metalness: 0.7 });
  const chairMat = new MeshStandardMaterial({ color: new Color(colors.chairFabric), roughness: 0.75 });
  const rugMat = new MeshStandardMaterial({ color: new Color(colors.rug), roughness: 0.95 });
  const beanbagMat = new MeshStandardMaterial({ color: new Color(colors.beanbag), roughness: 0.9 });
  const pedestalMat = new MeshStandardMaterial({ color: new Color(colors.pedestal), roughness: 0.45 });

  // -------------------------------------------------------------
  // 1. UNIQUE ARCHITECTURAL STEPPED PLATFORM & WALLS
  // -------------------------------------------------------------
  const ROOM_SIZE = 8.6;
  const WALL_HEIGHT = 4.8;
  const WALL_THICK = 0.28;

  // Stepped lower platform (Beveled plinth)
  const lowerPlinth = new Mesh(
    new BoxGeometry(ROOM_SIZE + 0.6, 0.25, ROOM_SIZE + 0.6),
    new MeshStandardMaterial({ color: isDark ? 0x141418 : 0xd5cfc2, roughness: 0.8 })
  );
  lowerPlinth.position.set(0, -0.325, 0);
  lowerPlinth.receiveShadow = true;
  group.add(lowerPlinth);

  // Recessed glowing neon rim around base
  const neonRim = new Mesh(
    new BoxGeometry(ROOM_SIZE + 0.64, 0.04, ROOM_SIZE + 0.64),
    platformRimMat
  );
  neonRim.position.set(0, -0.2, 0);
  group.add(neonRim);

  // Main Room Floor
  const floorGeo = new BoxGeometry(ROOM_SIZE, 0.2, ROOM_SIZE);
  const floorMesh = new Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Floor geometric grid inlay lines
  const gridInlayMat = new MeshBasicMaterial({
    color: isDark ? 0x2e2e38 : 0xcec8ba,
    transparent: true,
    opacity: 0.6
  });
  for (let gx = -3; gx <= 3; gx += 2) {
    const gridLineX = new Mesh(new BoxGeometry(0.02, 0.005, ROOM_SIZE - 0.2), gridInlayMat);
    gridLineX.position.set(gx, 0.003, 0);
    group.add(gridLineX);
  }
  for (let gz = -3; gz <= 3; gz += 2) {
    const gridLineZ = new Mesh(new BoxGeometry(ROOM_SIZE - 0.2, 0.005, 0.02), gridInlayMat);
    gridLineZ.position.set(0, 0.003, gz);
    group.add(gridLineZ);
  }

  // Back Wall
  const backWallGeo = new BoxGeometry(ROOM_SIZE + WALL_THICK, WALL_HEIGHT, WALL_THICK);
  const backWallMesh = new Mesh(backWallGeo, wallMat);
  backWallMesh.position.set(0, WALL_HEIGHT / 2, -ROOM_SIZE / 2 - WALL_THICK / 2);
  backWallMesh.receiveShadow = true;
  group.add(backWallMesh);

  // Left Wall
  const leftWallGeo = new BoxGeometry(WALL_THICK, WALL_HEIGHT, ROOM_SIZE);
  const leftWallMesh = new Mesh(leftWallGeo, wallMat);
  leftWallMesh.position.set(-ROOM_SIZE / 2 - WALL_THICK / 2, WALL_HEIGHT / 2, 0);
  leftWallMesh.receiveShadow = true;
  group.add(leftWallMesh);

  // Architectural Baseboards
  const bbBack = new Mesh(new BoxGeometry(ROOM_SIZE, 0.18, 0.06), baseboardMat);
  bbBack.position.set(0, 0.09, -ROOM_SIZE / 2 + 0.03);
  group.add(bbBack);

  const bbLeft = new Mesh(new BoxGeometry(0.06, 0.18, ROOM_SIZE), baseboardMat);
  bbLeft.position.set(-ROOM_SIZE / 2 + 0.03, 0.09, 0);
  group.add(bbLeft);

  // -------------------------------------------------------------
  // 2. NEON WALL ART ON BACK WALL (MANAS // DEV LAB)
  // -------------------------------------------------------------
  const neonSignGroup = new Group();
  neonSignGroup.position.set(2.4, 4.0, -ROOM_SIZE / 2 + 0.03);

  const neonBacking = new Mesh(
    new BoxGeometry(2.4, 0.44, 0.03),
    new MeshStandardMaterial({ color: isDark ? 0x141418 : 0x333333, roughness: 0.5, metalness: 0.8 })
  );
  neonSignGroup.add(neonBacking);

  // Neon text bars
  const neonBar1 = new Mesh(new BoxGeometry(1.0, 0.08, 0.04), new MeshBasicMaterial({ color: 0xff5a28 }));
  neonBar1.position.set(-0.55, 0.06, 0.03);
  const neonBar2 = new Mesh(new BoxGeometry(0.9, 0.08, 0.04), new MeshBasicMaterial({ color: 0x38bdf8 }));
  neonBar2.position.set(0.55, 0.06, 0.03);
  const neonSub = new Mesh(new BoxGeometry(1.8, 0.03, 0.04), new MeshBasicMaterial({ color: 0xffedd5 }));
  neonSub.position.set(0, -0.09, 0.03);
  neonSignGroup.add(neonBar1, neonBar2, neonSub);

  // Neon Point Light for radiant wall glow
  const neonSignLight = new PointLight(0xff5a28, isDark ? 2.5 : 1.2, 5.0);
  neonSignLight.position.set(2.4, 4.0, -ROOM_SIZE / 2 + 0.4);
  group.add(neonSignGroup);
  group.add(neonSignLight);

  // -------------------------------------------------------------
  // 3. LOFT WINDOW WITH DAY/NIGHT SKY BACKDROP
  // -------------------------------------------------------------
  const winGroup = new Group();
  winGroup.position.set(-1.8, 2.7, -ROOM_SIZE / 2 + 0.02);

  const winFrameMat = new MeshStandardMaterial({ color: isDark ? 0x2e2e38 : 0x4a4740, roughness: 0.4, metalness: 0.7 });
  const winWidth = 2.4;
  const winHeight = 2.0;
  const frameThickness = 0.08;

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

  // Window glass / backdrop
  const winBackdropMat = new MeshBasicMaterial({
    map: createWindowBackdropTexture(isDark),
    side: DoubleSide
  });
  const winBackdrop = new Mesh(new PlaneGeometry(winWidth - 0.08, winHeight - 0.08), winBackdropMat);
  winBackdrop.position.set(0, 0, -0.01);
  winGroup.add(winBackdrop);
  group.add(winGroup);

  // -------------------------------------------------------------
  // 4. SUSPENDED OVERHEAD LIGHT BAR (Provides beautiful lighting!)
  // -------------------------------------------------------------
  const overheadGroup = new Group();
  overheadGroup.position.set(1.5, 4.3, -1.0);

  const pendantBar = new Mesh(
    new BoxGeometry(2.6, 0.06, 0.08),
    new MeshStandardMaterial({ color: isDark ? 0x111111 : 0x222222, roughness: 0.3, metalness: 0.8 })
  );
  // Emissive diffuser strip on underside of bar
  const diffuser = new Mesh(
    new BoxGeometry(2.5, 0.01, 0.06),
    new MeshBasicMaterial({ color: 0xfff0db })
  );
  diffuser.position.y = -0.035;
  overheadGroup.add(pendantBar, diffuser);

  // Thin suspension wires
  const wireMat = new MeshBasicMaterial({ color: 0x888888 });
  const wire1 = new Mesh(new CylinderGeometry(0.004, 0.004, 0.7, 8), wireMat);
  wire1.position.set(-1.0, 0.35, 0);
  const wire2 = new Mesh(new CylinderGeometry(0.004, 0.004, 0.7, 8), wireMat);
  wire2.position.set(1.0, 0.35, 0);
  overheadGroup.add(wire1, wire2);
  group.add(overheadGroup);

  // Overhead Studio Light (fills the room with warm glow, zero heavy shadow cubemap passes)
  const overheadLight = new PointLight(0xffe8cf, isDark ? 3.5 : 2.2, 10.0);
  overheadLight.position.set(1.5, 4.1, -1.0);
  group.add(overheadLight);

  // -------------------------------------------------------------
  // 5. DEVELOPER WORKSTATION (DUAL MONITORS, CODEFORENSICS & DPI)
  // -------------------------------------------------------------
  const workstationGroup = new Group();
  workstationGroup.position.set(2.5, 0, -2.5);

  const deskWidth = 2.4;
  const deskDepth = 1.1;
  const deskThick = 0.07;
  const deskHeight = 1.18;

  // Desk Top
  const deskTop = new Mesh(new BoxGeometry(deskWidth, deskThick, deskDepth), deskWoodMat);
  deskTop.position.set(0, deskHeight, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  workstationGroup.add(deskTop);

  // Desk Legs
  const legGeo = new BoxGeometry(0.06, deskHeight, deskDepth - 0.15);
  const leftLeg = new Mesh(legGeo, deskMetalMat);
  leftLeg.position.set(-deskWidth / 2 + 0.12, deskHeight / 2, 0);
  leftLeg.castShadow = true;
  const rightLeg = new Mesh(legGeo, deskMetalMat);
  rightLeg.position.set(deskWidth / 2 - 0.12, deskHeight / 2, 0);
  rightLeg.castShadow = true;
  workstationGroup.add(leftLeg, rightLeg);

  // Desk Mat
  const matMat = new MeshStandardMaterial({ color: isDark ? 0x181820 : 0x333333, roughness: 0.85 });
  const deskMat = new Mesh(new BoxGeometry(1.4, 0.01, 0.65), matMat);
  deskMat.position.set(-0.1, deskHeight + deskThick / 2 + 0.006, 0.05);
  deskMat.receiveShadow = true;
  workstationGroup.add(deskMat);

  // Ultrawide Curved Main Monitor
  const ultrawideGroup = new Group();
  ultrawideGroup.position.set(-0.15, deskHeight + deskThick / 2, -0.22);

  const standBase = new Mesh(new CylinderGeometry(0.14, 0.16, 0.02, 24), deskMetalMat);
  const standArm = new Mesh(new CylinderGeometry(0.025, 0.025, 0.38, 16), deskMetalMat);
  standArm.position.set(0, 0.19, -0.06);
  standArm.rotation.x = 0.15;
  ultrawideGroup.add(standBase, standArm);

  const uwWidth = 1.18;
  const uwHeight = 0.62;
  const uwBezel = new Mesh(
    new BoxGeometry(uwWidth, uwHeight, 0.04),
    new MeshStandardMaterial({ color: 0x111114, roughness: 0.3, metalness: 0.8 })
  );
  uwBezel.position.set(0, 0.44, 0);
  uwBezel.castShadow = true;
  ultrawideGroup.add(uwBezel);

  // Screen
  const uwScreenMat = new MeshBasicMaterial({
    map: createIdeScreenTexture(isDark)
  });
  const uwScreen = new Mesh(new PlaneGeometry(uwWidth - 0.04, uwHeight - 0.04), uwScreenMat);
  uwScreen.position.set(0, 0.44, 0.022);
  ultrawideGroup.add(uwScreen);
  workstationGroup.add(ultrawideGroup);

  // Vertical Secondary Monitor
  const vertMonitorGroup = new Group();
  vertMonitorGroup.position.set(0.72, deskHeight + deskThick / 2, -0.16);
  vertMonitorGroup.rotation.y = -0.32;

  const vStand = new Mesh(new CylinderGeometry(0.11, 0.12, 0.02, 20), deskMetalMat);
  const vArm = new Mesh(new CylinderGeometry(0.022, 0.022, 0.45, 16), deskMetalMat);
  vArm.position.set(0, 0.22, -0.05);
  vertMonitorGroup.add(vStand, vArm);

  const vWidth = 0.42;
  const vHeight = 0.72;
  const vBezel = new Mesh(new BoxGeometry(vWidth, vHeight, 0.035), deskMetalMat);
  vBezel.position.set(0, 0.44, 0);
  vertMonitorGroup.add(vBezel);

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
    new MeshStandardMaterial({ color: 0x181820, roughness: 0.4, metalness: 0.6 })
  );
  kbGroup.add(kbBase);
  const keyMat = new MeshStandardMaterial({ color: isDark ? 0x272732 : 0x3f3f46, roughness: 0.5 });
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
    new MeshStandardMaterial({ color: 0x1f1f26, roughness: 0.4 })
  );
  mouse.position.set(0.3, deskHeight + deskThick / 2 + 0.015, 0.12);
  workstationGroup.add(mouse);

  // BITS Coffee Mug
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

  // Architectural Desk Lamp with WIDE, WARM ILLUMINATION
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

  // Radiant Desk Lamp Point Light (creates that cozy warm golden glow!)
  const deskLampLight = new PointLight(0xffa233, isDark ? 4.2 : 2.0, 5.5);
  deskLampLight.position.set(0.24, 0.46, 0.08);
  lampGroup.add(deskLampLight);
  workstationGroup.add(lampGroup);

  // Modern Ergonomic Swivel Chair
  const chairGroup = new Group();
  chairGroup.position.set(0, 0, 0.7);

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
  const stem = new Mesh(new CylinderGeometry(0.035, 0.035, 0.38, 16), deskMetalMat);
  stem.position.y = 0.32;
  chairGroup.add(stem);

  const seat = new Mesh(new BoxGeometry(0.56, 0.09, 0.52), chairMat);
  seat.position.y = 0.54;
  chairGroup.add(seat);

  const backrest = new Mesh(new BoxGeometry(0.52, 0.68, 0.06), chairMat);
  backrest.position.set(0, 0.94, 0.25);
  backrest.rotation.x = -0.08;
  chairGroup.add(backrest);

  const armL = new Mesh(new BoxGeometry(0.06, 0.22, 0.3), deskMetalMat);
  armL.position.set(-0.31, 0.72, 0.05);
  const armR = new Mesh(new BoxGeometry(0.06, 0.22, 0.3), deskMetalMat);
  armR.position.set(0.31, 0.72, 0.05);
  chairGroup.add(armL, armR);

  workstationGroup.add(chairGroup);
  group.add(workstationGroup);

  // -------------------------------------------------------------
  // 6. SYSTEMS & SECURITY SERVER RACK (19" CABINET)
  // -------------------------------------------------------------
  const serverRackGroup = new Group();
  serverRackGroup.position.set(3.4, 0, 1.2);
  serverRackGroup.rotation.y = -Math.PI / 2;

  const rackW = 1.0;
  const rackH = 2.4;
  const rackD = 0.85;

  const rackOuter = new Mesh(new BoxGeometry(rackW, rackH, rackD), serverRackMat);
  rackOuter.position.y = rackH / 2;
  rackOuter.castShadow = true;
  serverRackGroup.add(rackOuter);

  const rackRecess = new Mesh(
    new BoxGeometry(rackW - 0.14, rackH - 0.2, 0.1),
    new MeshStandardMaterial({ color: 0x08080c, roughness: 0.9 })
  );
  rackRecess.position.set(0, rackH / 2, rackD / 2 - 0.04);
  serverRackGroup.add(rackRecess);

  const chassisMat = new MeshStandardMaterial({ color: 0x22232a, roughness: 0.4, metalness: 0.6 });
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

    const slot = new Mesh(new BoxGeometry(0.35, 0.04, 0.02), new MeshBasicMaterial({ color: 0x09090b }));
    slot.position.set(-0.16, unitY, rackD / 2 + 0.052);
    serverRackGroup.add(slot);

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

  // Internal glowing cathode cyan light
  const serverRackLight = new PointLight(0x06b6d4, isDark ? 2.8 : 1.2, 3.2);
  serverRackLight.position.set(0, 1.4, rackD / 2 + 0.2);
  serverRackGroup.add(serverRackLight);
  group.add(serverRackGroup);

  // -------------------------------------------------------------
  // 7. WHITEBOARD (DSA, NETWORK PROTOCOLS & SECURITY)
  // -------------------------------------------------------------
  const wbGroup = new Group();
  wbGroup.position.set(-ROOM_SIZE / 2 + 0.04, 2.4, -0.6);
  wbGroup.rotation.y = Math.PI / 2;

  const wbW = 2.8;
  const wbH = 1.7;

  const wbFrame = new Mesh(
    new BoxGeometry(wbW + 0.08, wbH + 0.08, 0.04),
    new MeshStandardMaterial({ color: colors.whiteboardFrame, roughness: 0.3, metalness: 0.8 })
  );
  wbGroup.add(wbFrame);

  const wbSurfaceMat = new MeshBasicMaterial({
    map: createWhiteboardTexture(isDark)
  });
  const wbSurface = new Mesh(new PlaneGeometry(wbW, wbH), wbSurfaceMat);
  wbSurface.position.z = 0.022;
  wbGroup.add(wbSurface);

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
  // 8. BOOKSHELF & CS LIBRARY
  // -------------------------------------------------------------
  const bsGroup = new Group();
  bsGroup.position.set(0.65, 0, -ROOM_SIZE / 2 + 0.32);

  const bsW = 1.4;
  const bsH = 2.9;
  const bsD = 0.42;
  const bsThick = 0.04;

  const bsTop = new Mesh(new BoxGeometry(bsW, bsThick, bsD), deskWoodMat);
  bsTop.position.y = bsH;
  const bsBot = new Mesh(new BoxGeometry(bsW, bsThick, bsD), deskWoodMat);
  bsBot.position.y = 0.04;
  const bsLeft = new Mesh(new BoxGeometry(bsThick, bsH, bsD), deskWoodMat);
  bsLeft.position.set(-bsW / 2 + bsThick / 2, bsH / 2, 0);
  const bsRight = new Mesh(new BoxGeometry(bsThick, bsH, bsD), deskWoodMat);
  bsRight.position.set(bsW / 2 - bsThick / 2, bsH / 2, 0);
  bsGroup.add(bsTop, bsBot, bsLeft, bsRight);

  const numShelves = 4;
  const bookColors = [
    0x2563eb, 0xd97706, 0x059669, 0xdc2626, 0x7c3aed,
    0x0284c7, 0x4f46e5, 0x16a34a, 0xe11d48, 0x475569
  ];

  for (let s = 1; s <= numShelves; s++) {
    const sY = (s * bsH) / (numShelves + 1);
    const shelf = new Mesh(new BoxGeometry(bsW - bsThick * 2, bsThick, bsD), deskWoodMat);
    shelf.position.y = sY;
    bsGroup.add(shelf);

    const booksInShelf = s === 1 ? 9 : s === 2 ? 8 : 6;
    let bX = -bsW / 2 + 0.12;
    for (let b = 0; b < booksInShelf; b++) {
      const bH = 0.32 + (b % 4) * 0.05;
      const bThick = 0.05 + (b % 3) * 0.02;
      const bColor = bookColors[(s * 3 + b) % bookColors.length];
      const bookMat = new MeshStandardMaterial({ color: bColor, roughness: 0.7 });
      const book = new Mesh(new BoxGeometry(bThick, bH, bsD - 0.12), bookMat);
      book.position.set(bX + bThick / 2, sY + bH / 2 + bsThick / 2, 0);
      if (b === booksInShelf - 1) {
        book.rotation.z = -0.15;
      }
      bsGroup.add(book);
      bX += bThick + 0.012;
    }
  }

  // Framed BITS Diploma
  const diplomaFrame = new Mesh(
    new BoxGeometry(0.38, 0.48, 0.04),
    new MeshStandardMaterial({ color: 0x92400e, roughness: 0.4, metalness: 0.5 })
  );
  diplomaFrame.position.set(0.32, (3 * bsH) / (numShelves + 1) + 0.28, 0.05);
  diplomaFrame.rotation.y = -0.2;
  const diplomaPaper = new Mesh(new PlaneGeometry(0.32, 0.42), new MeshBasicMaterial({ color: 0xfefce8 }));
  diplomaPaper.position.z = 0.022;
  diplomaFrame.add(diplomaPaper);
  bsGroup.add(diplomaFrame);

  // Plant on bookshelf
  const pot = new Mesh(
    new CylinderGeometry(0.14, 0.1, 0.2, 16),
    new MeshStandardMaterial({ color: isDark ? 0xdddddd : 0xf3f4f6, roughness: 0.4 })
  );
  pot.position.set(-0.35, bsH + 0.1, 0);
  bsGroup.add(pot);

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
  // 9. MILESTONE TROPHY STAND (PEDESTAL WITH 26★, LEETCODE, GIT)
  // -------------------------------------------------------------
  const trophyGroup = new Group();
  trophyGroup.position.set(1.6, 0, 2.4);

  const pedestalHeight = 0.88;
  const pedBody = new Mesh(new CylinderGeometry(0.38, 0.44, pedestalHeight, 24), pedestalMat);
  pedBody.position.y = pedestalHeight / 2;
  pedBody.castShadow = true;
  pedBody.receiveShadow = true;
  trophyGroup.add(pedBody);

  // Luminous ring at pedestal top
  const pedRing = new Mesh(
    new CylinderGeometry(0.42, 0.42, 0.02, 24),
    new MeshBasicMaterial({ color: 0xf59e0b })
  );
  pedRing.position.y = pedestalHeight + 0.01;
  trophyGroup.add(pedRing);

  // 26★ DPI Engine Gold Star Trophy
  const starTrophyGroup = new Group();
  starTrophyGroup.position.set(0, pedestalHeight + 0.06, 0);

  const starBase = new Mesh(
    new CylinderGeometry(0.1, 0.12, 0.06, 20),
    new MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 })
  );
  starTrophyGroup.add(starBase);

  const goldMat = new MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.95
  });
  const starMesh = new Mesh(new BoxGeometry(0.15, 0.15, 0.04), goldMat);
  starMesh.position.y = 0.14;
  starMesh.rotation.z = Math.PI / 4;
  starTrophyGroup.add(starMesh);

  const starPlaque = new Mesh(new BoxGeometry(0.16, 0.04, 0.01), new MeshBasicMaterial({ color: 0xffedd5 }));
  starPlaque.position.set(0, 0.03, 0.12);
  starTrophyGroup.add(starPlaque);
  trophyGroup.add(starTrophyGroup);

  // LeetCode 157 Solver Badge
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

  // GitHub 1,000+ Contributions Crystal
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
  // 10. CORNER LOUNGE NOOK: RUG, BEANBAG & MODERN FLOOR ARC LAMP
  // -------------------------------------------------------------
  const rugMesh = new Mesh(new CylinderGeometry(1.65, 1.65, 0.015, 36), rugMat);
  rugMesh.position.set(-0.6, 0.008, 0.4);
  rugMesh.receiveShadow = true;
  group.add(rugMesh);

  const beanbag = new Mesh(new SphereGeometry(0.68, 24, 20), beanbagMat);
  beanbag.scale.set(1.1, 0.65, 1.0);
  beanbag.position.set(-2.2, 0.35, 1.8);
  beanbag.castShadow = true;
  group.add(beanbag);

  // Modern Floor Arc Lamp in the lounge corner
  const floorLampGroup = new Group();
  floorLampGroup.position.set(-3.2, 0, 0.8);

  const flBase = new Mesh(new CylinderGeometry(0.22, 0.24, 0.03, 20), deskMetalMat);
  flBase.position.y = 0.015;
  const flPole = new Mesh(new CylinderGeometry(0.015, 0.015, 2.6, 12), deskMetalMat);
  flPole.position.set(0, 1.3, 0);
  const flShade = new Mesh(
    new CylinderGeometry(0.16, 0.24, 0.26, 20),
    new MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 })
  );
  flShade.position.set(0.3, 2.5, 0.2);
  floorLampGroup.add(flBase, flPole, flShade);

  // Floor lamp warm reading light
  const floorLampLight = new PointLight(0xffb870, isDark ? 2.4 : 1.2, 4.2);
  floorLampLight.position.set(0.3, 2.4, 0.2);
  floorLampGroup.add(floorLampLight);
  group.add(floorLampGroup);

  // Floor Plant
  const floorPot = new Mesh(
    new CylinderGeometry(0.25, 0.18, 0.48, 20),
    new MeshStandardMaterial({ color: isDark ? 0x2e2e38 : 0xf1f1ed, roughness: 0.5 })
  );
  floorPot.position.set(-3.2, 0.24, 2.9);
  floorPot.castShadow = true;
  group.add(floorPot);

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
  // 11. AMBIENT DUST MOTE PARTICLES
  // -------------------------------------------------------------
  const particleCount = 50;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 6.0;
    particlePositions[i * 3 + 1] = 0.5 + Math.random() * 3.5;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(particlePositions, 3));
  const dustMat = new PointsMaterial({
    size: 0.04,
    color: isDark ? 0xffbb66 : 0xffffff,
    transparent: true,
    opacity: 0.6
  });
  const dustPoints = new Points(dustGeo, dustMat);
  group.add(dustPoints);

  // -------------------------------------------------------------
  // 12. LUMINOUS LIGHTING FOR NIGHT & DAY
  // -------------------------------------------------------------
  // Ambient fill light (Boosted in dark mode so the room is never pitch black!)
  const ambientLight = new PointLight(isDark ? 0x4a4458 : 0xfff6ea, isDark ? 2.2 : 1.8, 18);
  ambientLight.position.set(0, 3.5, 0);
  group.add(ambientLight);

  // Window Moonlight / Sun light
  const moonLight = new PointLight(isDark ? 0x60a5fa : 0xfff1d6, isDark ? 1.6 : 2.5, 12);
  moonLight.position.set(-3.5, 4.2, -4.8);
  group.add(moonLight);

  // Interactive meshes for click/hover
  const interactiveMeshes = {
    workstation: [deskTop, uwBezel, uwScreen, vBezel, vScreen, kbBase, chairGroup],
    serverRack: [rackOuter, rackRecess, dpiApplianceBadge],
    whiteboard: [wbFrame, wbSurface],
    bookshelf: [bsTop, bsBot, bsLeft, bsRight, diplomaFrame],
    trophyStand: [pedBody, pedRing, starMesh, leetHex, gitBlock]
  };

  const updateTheme = (dark: boolean) => {
    const c = getThemeColors(dark);
    wallMat.color.set(c.wall);
    floorMat.color.set(c.floor);
    baseboardMat.color.set(c.baseboard);
    platformRimMat.color.set(c.platformRim);
    deskWoodMat.color.set(c.deskWood);
    deskMetalMat.color.set(c.deskMetal);
    serverRackMat.color.set(c.serverRack);
    chairMat.color.set(c.chairFabric);
    rugMat.color.set(c.rug);
    beanbagMat.color.set(c.beanbag);
    pedestalMat.color.set(c.pedestal);

    uwScreenMat.map = createIdeScreenTexture(dark);
    uwScreenMat.needsUpdate = true;
    vScreenMat.map = createTerminalScreenTexture(dark);
    vScreenMat.needsUpdate = true;
    wbSurfaceMat.map = createWhiteboardTexture(dark);
    wbSurfaceMat.needsUpdate = true;
    winBackdropMat.map = createWindowBackdropTexture(dark);
    winBackdropMat.needsUpdate = true;

    // Rich luminous lighting updates
    ambientLight.color.set(dark ? 0x4a4458 : 0xfff6ea);
    ambientLight.intensity = dark ? 2.2 : 1.8;
    overheadLight.intensity = dark ? 3.5 : 2.2;
    deskLampLight.intensity = dark ? 4.2 : 2.0;
    serverRackLight.intensity = dark ? 2.8 : 1.2;
    neonSignLight.intensity = dark ? 2.5 : 1.2;
    moonLight.color.set(dark ? 0x60a5fa : 0xfff1d6);
    moonLight.intensity = dark ? 1.6 : 2.5;
    dustMat.color.set(dark ? 0xffbb66 : 0xffffff);
  };

  return {
    group,
    interactiveMeshes,
    blinkingLeds,
    dustPoints,
    lights: {
      ambientLight,
      overheadLight,
      deskLampLight,
      serverRackLight,
      neonSignLight,
      moonLight
    },
    updateTheme
  };
}
