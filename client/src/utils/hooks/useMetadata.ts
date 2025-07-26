import { useMemo } from 'react';

interface MetadataOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export default function useMetadata({ title = '', description = '', imageUrl = '', url = '' }: MetadataOptions) {
  return useMemo(() => {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [{ url: imageUrl, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  }, [title, description, imageUrl, url]);
}
