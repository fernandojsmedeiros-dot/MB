import type { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    id: 'materials',
    label: 'Materials',
    icon: 'Atom',
    description: 'Steels, Aluminum, Engineering Polymers',
  },
  {
    id: 'mechanical-standards',
    label: 'Mechanical',
    icon: 'Cog',
    description: 'Tubes, Structural Profiles, Industrial Piping, Sheet Metal',
  },
  {
    id: 'standardized',
    label: 'Construction',
    icon: 'Package',
    description: 'Beams & Channels, Wide Flange & H-Columns, Rebars',
  },
  {
    id: 'fasteners',
    label: 'Fasteners',
    icon: 'Wrench',
    description: 'Screws, Tensile & Shear Data, Tightening Tools',
  },
  {
    id: 'surface-treatment',
    label: 'Surface Treatment',
    icon: 'SprayCan',
    description: 'Coatings, plating, and salt spray resistance specs',
  },
  {
    id: 'gdt-guide',
    label: 'GD&T Guide',
    icon: 'Crosshair',
    description: 'ASME Y14.5 geometric dimensioning and tolerancing reference',
  },
];
