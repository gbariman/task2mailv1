import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useOutbox } from '../state/useOutbox';
import ImageThumb from '../components/ImageThumb';
import StatusBadge from '../components/StatusBadge';


export default function OutboxScreen() {
  const { items, sendItem } = useOutbox();


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />}
        renderItem={({ item }) => (
          <Pressable style={{ padding: 12, gap: 8 }} onLongPress={() => sendItem(item.id)}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <ImageThumb uri={item.imageUri} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontWeight: '600' }}>{item.subject}</Text>
                <Text style={{ color: '#6b7280' }}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            {item.status === 'failed' && !!item.error && (
              <Text style={{ color: '#b91c1c' }}>Error: {item.error}</Text>
            )}
            <Text numberOfLines={2} style={{ color: '#374151' }}>{item.body}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

