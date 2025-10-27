import React from 'react';
import { Text, View } from 'react-native';


export default function StatusBadge({ status }: { status: 'queued' | 'sending' | 'sent' | 'failed' }) {
  const bg = {
    queued: '#e5e7eb',
    sending: '#dbeafe',
    sent: '#dcfce7',
    failed: '#fee2e2'
  }[status];
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
      <Text>{label}</Text>
    </View>
  );
}

