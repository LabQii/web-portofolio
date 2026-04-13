import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Iqbal Portfolio',
    short_name: 'Iqbal',
    description: 'Personal portfolio, projects, and experiences of Iqbal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a', 
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
