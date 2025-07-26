import useMetadata from '@/utils/hooks/useMetadata';
import React from 'react';

const DynamicMetadata: React.FC<any> = ({ title, description, imageUrl, url, keywords }) => {
  const metadata = useMetadata({ title, description, imageUrl, url });

  return (
    <head>
      <title>{metadata.title}</title>
    </head>
  );
};

export default DynamicMetadata;
