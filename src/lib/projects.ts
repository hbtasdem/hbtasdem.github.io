import { getCollection, type CollectionEntry } from 'astro:content';
import type { AreaId } from '../data/areas';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function inArea(p: Project, area: AreaId): boolean {
  return p.data.area === area || p.data.tags.includes(area);
}

export const projectUrl = (p: Project) => `/projects/${p.id}/`;
