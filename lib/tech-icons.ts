import * as simpleIcons from 'simple-icons';

type TechStackItem = {
  id: string;
  name: string;
  customLogoUrl: string | null;
};

export type TechLogoType = 
  | { type: 'custom'; url: string; name: string }
  | { type: 'cdn'; url: string; name: string }
  | { type: 'initial'; initial: string; name: string };

/**
 * Normalizes a tech stack name to match simple-icons slugs.
 * E.g. "Next.js" -> "nextjs", "React Native" -> "react" or "reactos", etc.
 */
function normalizeForSlug(name: string): string {
  // Simple-icons generally removes spaces, dots, and lowercases everything
  // e.g. "Node.js" -> "nodedotjs" is their convention for dots sometimes,
  // but let's try basic stripping first. Their get function expects a slug.
  let slug = name.toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]/g, "");
  
  // Hardcode some common aliases if they don't map perfectly
  if (slug === 'reactnative') return 'react';
  if (slug === 'nodejs') return 'nodedotjs';
  
  return slug;
}

export function getTechLogoDetails(techName: string, customTechLogos: TechStackItem[]): TechLogoType {
  // 1. Check custom logos
  const custom = customTechLogos.find(
    (c) => c.name.toLowerCase() === techName.toLowerCase()
  );
  
  if (custom && custom.customLogoUrl) {
    return { type: 'custom', url: custom.customLogoUrl, name: techName };
  }

  // 2. Try to find in simple-icons
  const slug = normalizeForSlug(techName);
  const strictIconName = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icon = (simpleIcons as any)[strictIconName];
  
  if (icon) {
    return { 
      type: 'cdn', 
      url: `https://cdn.simpleicons.org/${icon.slug}`, 
      name: techName 
    };
  }

  // Fallback if not found: use initials but maybe with simple-icons hex if possible? 
  // No, we'll just use the first letter.
  return { 
    type: 'initial', 
    initial: techName.charAt(0).toUpperCase(), 
    name: techName 
  };
}
