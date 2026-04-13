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

function normalizeForSlug(name: string): string {

  let slug = name.toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]/g, "");

  if (slug === 'reactnative') return 'react';
  if (slug === 'nodejs') return 'nodedotjs';
  
  return slug;
}

export function getTechLogoDetails(techName: string, customTechLogos: TechStackItem[]): TechLogoType {

  const custom = customTechLogos.find(
    (c) => c.name.toLowerCase() === techName.toLowerCase()
  );
  
  if (custom && custom.customLogoUrl) {
    return { type: 'custom', url: custom.customLogoUrl, name: techName };
  }

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

  return { 
    type: 'initial', 
    initial: techName.charAt(0).toUpperCase(), 
    name: techName 
  };
}
