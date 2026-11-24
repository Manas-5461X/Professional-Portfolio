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
  /** Center in 3D world space for the floating badge */
  worldPosition: Vector3Tuple;
  camera: {
    desktop: CameraPreset;
    mobile: CameraPreset;
  };
}

export const ROOM_HOTSPOTS: Record<HotspotId, HotspotMeta> = {
  overview: {
    id: 'overview',
    label: 'Room Overview',
    shortLabel: 'Overview',
    category: '3D Space',
    description: 'Isometric view of Manas Gandhi’s engineering workspace & security lab.',
    badge: 'Overview',
    iconName: 'Cube',
    worldPosition: [0, 1.2, 0],
    camera: {
      desktop: { position: [9.2, 8.2, 9.2], target: [0.2, 1.1, 0.1], fov: 36 },
      mobile: { position: [11.5, 10.5, 11.5], target: [0.2, 1.2, 0.1], fov: 42 }
    }
  },
  workstation: {
    id: 'workstation',
    label: 'Engineer Workstation',
    shortLabel: 'Workstation',
    category: 'Projects',
    description: 'Dual-monitor dev station running CodeForensics AST & DPI Engine capture.',
    badge: 'Flagship Projects',
    iconName: 'Desktop',
    worldPosition: [2.9, 1.8, -2.8],
    camera: {
      desktop: { position: [1.6, 2.6, 1.2], target: [3.1, 1.6, -2.8], fov: 33 },
      mobile: { position: [2.0, 3.2, 2.4], target: [3.1, 1.6, -2.8], fov: 38 }
    }
  },
  serverRack: {
    id: 'serverRack',
    label: 'Systems & Security Rack',
    shortLabel: 'Server Rack',
    category: 'Systems & DPI',
    description: '19” rack with blinking packet inspection switch & DPI Engine v2.0 terminal.',
    badge: '26★ DPI Engine',
    iconName: 'HardDrives',
    worldPosition: [3.8, 2.2, 1.4],
    camera: {
      desktop: { position: [5.8, 2.7, 4.4], target: [3.7, 1.6, 1.4], fov: 32 },
      mobile: { position: [6.4, 3.2, 5.2], target: [3.7, 1.6, 1.4], fov: 37 }
    }
  },
  whiteboard: {
    id: 'whiteboard',
    label: 'Architecture Whiteboard',
    shortLabel: 'Whiteboard',
    category: 'Architecture',
    description: 'System design diagrams for packet inspection pipelines & AST archaeology.',
    badge: 'System Design',
    iconName: 'TreeStructure',
    worldPosition: [-4.0, 2.3, -0.6],
    camera: {
      desktop: { position: [1.8, 2.4, 1.6], target: [-4.0, 2.3, -0.6], fov: 33 },
      mobile: { position: [2.4, 2.8, 2.2], target: [-4.0, 2.3, -0.6], fov: 38 }
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
    worldPosition: [1.3, 2.5, -3.9],
    camera: {
      desktop: { position: [1.3, 2.6, -0.8], target: [1.3, 2.3, -3.9], fov: 32 },
      mobile: { position: [1.3, 3.0, 0.4], target: [1.3, 2.3, -3.9], fov: 37 }
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
      desktop: { position: [3.4, 2.0, 4.6], target: [1.6, 0.9, 2.4], fov: 31 },
      mobile: { position: [4.0, 2.4, 5.4], target: [1.6, 0.9, 2.4], fov: 36 }
    }
  }
};
