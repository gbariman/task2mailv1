import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Pressable, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../lib/image';
import { useOutbox } from '../state/useOutbox';
import { useNavigation } from '@react-navigation/native';
import { getSettings } from '../lib/outboxStore';


export default function CaptureScreen() {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { createAndSend } = useOutbox();
  // @ts-ignore
  const nav = useNavigation();


  useEffect(() => {
    (async () => {
      const s = await getSettings();
      if (!s.destEmail) {
        Alert.alert('Set your email', 'Add your destination email in Settings to start.', [
          { text: 'Open Settings', onPress: () => nav.navigate('Settings') }
        ]);
      }
    })();
  }, []);


  async function pickImage() {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = await compressImage(res.assets[0].uri);
      setImageUri(uri);
    }
  }


  async function onSend() {
    try {
      await createAndSend(text, imageUri);
      setText('');
      setImageUri(null);
      Alert.alert('Sent');
    } catch (e: any) {
      Alert.alert('Error', String(e.message || e));
    }
  }


  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <TextInput
        autoFocus
        placeholder="Type a quick idea or task…"
        value={text}
        onChangeText={setText}
        multiline
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, minHeight: 120 }}
      />


      {imageUri && (
        <Pressable onLongPress={() => setImageUri(null)}>
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, borderRadius: 12 }} />
          <Text style={{ color: '#6b7280', marginTop: 4 }}>Long-press to remove photo</Text>
        </Pressable>
      )}


      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="Camera" onPress={pickImage} />
        <Button title="Outbox" onPress={() => nav.navigate('Outbox')} />
        <Button title="Settings" onPress={() => nav.navigate('Settings')} />
      </View>


      <View style={{ marginTop: 'auto' }}>
        <Button title="Send" onPress={onSend} />
      </View>
    </View>
  );
}

