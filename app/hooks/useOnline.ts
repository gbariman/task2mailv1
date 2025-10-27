import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';


export default function useOnline() {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    const sub = NetInfo.addEventListener(state => setOnline(!!state.isConnected));
    return () => sub();
  }, []);
  return online;
}

