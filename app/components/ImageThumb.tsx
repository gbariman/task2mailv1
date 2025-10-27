import React from 'react';
import { Image } from 'react-native';


export default function ImageThumb({ uri, size = 48 }: { uri?: string | null; size?: number }) {
  if (!uri) return null;
  return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: 6 }} />;
}

