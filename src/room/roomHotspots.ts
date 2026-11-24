import type { Vector3Tuple } from 'three';

export type HotspotId =
  | 'overview'
  | 'workstation'
  | 'serverRack'
  | 'whiteboard'
  | 'bookshelf'
  | 'trophyStand';

export interface CameraPreset {
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
}

export interface HotspotMeta {
  id: HotspotId;
  label: string;
  shortLabel: string;
  category: string;
  description: string;
  badge: string;
  iconName: string;
  worldPosition: Vector3Tuple;
  camera: {
    desktop: CameraPreset;
    mobile: CameraPreset;
  };
}

export const ROOM_HOTSPOTS: Record<HotspotId, HotspotMeta> = {
  overview: {
    id: 'overview',
    label: 'Cyber Lab Overview',
    shortLabel: 'Overview',
    category: '3D Space',
    description: 'Isometric view of Manas Gandhi’s engineering workspace & security lab.',
    badge: 'Overview',
    iconName: 'Cube',
    worldPosition: [0, 1.4, 0],
    camera: {
      desktop: { position: [9.0, 7.8, 9.0], target: [0.2, 1.2, 0.1], fov: 36 },
      mobile: { position: [11.0, 10.0, 11.0], target: [0.2, 1.2, 0.1], fov: 42 }
    }
  },
  workstation: {
    id: 'workstation',
    label: 'Engineer Workstation',
    shortLabel: 'Workstation',
    category: 'Projects',
    description: 'Dual-monitor setup running CodeForensics AST & DPI Engine packet streams.',
    badge: 'Flagship Projects',
    iconName: 'Desktop',
    worldPosition: [2.8, 1.8, -2.5],
    camera: {
      desktop: { position: [1.6, 2.5, 1.1], target: [2.9, 1.6, -2.5], fov: 33 },
      mobile: { position: [2.0, 3.2, 2.2], target: [2.9, 1.6, -2.5], fov: 38 }
    }
  },
  serverRack: {
    id: 'serverRack',
    label: 'Systems & Security Rack',
    shortLabel: 'Server Rack',
    category: 'Systems & DPI',
    description: '19” rack with blinking packet inspection switch & DPI Engine terminal.',
    badge: '26★ DPI Engine',
    iconName: 'HardDrives',
    worldPosition: [3.8, 2.2, 1.3],
    camera: {
      desktop: { position: [5.6, 2.6, 4.2], target: [3.6, 1.6, 1.3], fov: 32 },
      mobile: { position: [6.2, 3.2, 5.0], target: [3.6, 1.6, 1.3], fov: 37 }
    }
  },
  whiteboard: {
    id: 'whiteboard',
    label: 'DSA & Packet Analysis',
    shortLabel: 'DSA & Analysis',
    category: 'Algorithms & Security',
    description: 'Packet filtering pipelines, LeetCode patterns, and security inspection notes.',
    badge: 'DSA & Security',
    iconName: 'TreeStructure',
    worldPosition: [-3.8, 2.3, -0.6],
    camera: {
      desktop: { position: [1.6, 2.4, 1.4], target: [-3.8, 2.3, -0.6], fov: 33 },
      mobile: { position: [2.2, 2.8, 2.0], target: [-3.8, 2.3, -0.6], fov: 38 }
    }
  },
  bookshelf: {
    id: 'bookshelf',
    label: 'CS Library & Skills Nook',
    shortLabel: 'CS Library',
    category: 'Education & Stack',
    description: 'Classical CS texts (Networks, OS, CLRS), BITS Pilani diploma & skills index.',
    badge: 'BITS Pilani CS',
    iconName: 'BookOpen',
    worldPosition: [1.2, 2.5, -3.8],
    camera: {
      desktop: { position: [1.2, 2.6, -0.7], target: [1.2, 2.3, -3.8], fov: 32 },
      mobile: { position: [1.2, 3.0, 0.4], target: [1.2, 2.3, -3.8], fov: 37 }
    }
  },
  trophyStand: {
    id: 'trophyStand',
    label: 'Milestone Pedestal',
    shortLabel: 'Milestones',
    category: 'Milestones',
    description: '157 LeetCode problems solved, 1,000+ GitHub contributions & 26 DPI Stars.',
    badge: '157 LeetCode & 1k+ Git',
    iconName: 'Trophy',
    worldPosition: [1.6, 1.3, 2.4],
    camera: {
      desktop: { position: [3.3, 2.0, 4.4], target: [1.6, 0.9, 2.4], fov: 31 },
      mobile: { position: [3.8, 2.4, 5.2], target: [1.6, 0.9, 2.4], fov: 36 }
    }
  }
};
