export type AreaId = 'computer-vision' | 'security' | 'swe-ai';

export interface Area {
  id: AreaId;
  number: string;
  name: string;
  /** Shown on cards and filter chips next to the icon. */
  label: string;
  intro: string;
  doorText: string;
}

export const areas: Area[] = [
  {
    id: 'computer-vision',
    number: '01',
    name: 'Computer Vision',
    label: 'Computer Vision',
    intro:
      'I like problems where the answer is in the pixels. My work here is about getting reliable results when labeled data is scarce.',
    doorText:
      'Wafer-defect classification with Vision Transformers, trained on only 631 labeled images.',
  },
  {
    id: 'security',
    number: '02',
    name: 'Security',
    label: 'Security',
    intro:
      'I start from the person who could misuse a system and work back to what it would take to stop them. I’ve practiced that by building encryption into a safety app for abuse survivors, and by implementing ciphers and attacks myself in coursework.',
    doorText:
      'Calculator0, a disguised financial-safety app, plus ciphers, hashes and server attacks built from scratch in coursework.',
  },
  {
    id: 'swe-ai',
    number: '03',
    name: 'Software Engineering & AI',
    label: 'SWE & AI',
    intro:
      'I take systems from prototype to production: data pipelines, cloud backends, tests and deploys, built for the people who will actually use them.',
    doorText:
      'Stride’s serverless navigation backend, and BoilerFace, a registry that vets open-source ML models.',
  },
];

export const areaById = Object.fromEntries(areas.map((a) => [a.id, a])) as Record<AreaId, Area>;
