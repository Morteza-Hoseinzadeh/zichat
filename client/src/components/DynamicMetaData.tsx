import useMetadata from '@/utils/hooks/useMetadata';
import React from 'react';

const DynamicMetadata: React.FC<any> = ({ title, description, imageUrl, url, keywords }) => {
  const metadata = useMetadata({ title, description, imageUrl, url });

  return (
    <head>
      <title>{metadata.title || 'زیچت | چت سریع و بدون دردسر '}</title>
      <link rel="icon" href="/assets/logo/zichat-logo.png" type="image/x-icon" />
      <link rel="icon" href="/assets/logo/zichat-logo.png" sizes="32x32" />
    </head>
  );
};

export default DynamicMetadata;
