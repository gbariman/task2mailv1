import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Button, Alert } from 'react-native';
import { getSettings, setSettings, initDB } from '../lib/outboxStore';


export default function SettingsScreen() {
  const [destEmail, setDestEmail] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);


  useEffect(() => {
    initDB();
    (async () => {
      const s = await getSettings();
      setDestEmail(s.destEmail ?? '');
      setIncludeMetadata(s.includeMetadata);
    })();
  }, []);


  async function save() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(destEmail)) {
      Alert.alert('Invalid email');
      return;
    }
    await setSettings({ destEmail, includeMetadata });
    Alert.alert('Saved');
  }


  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontWeight: '600' }}>Send to</Text>
      <TextInput
        placeholder="your@email.com"
        value={destEmail}
        onChangeText={setDestEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
      />


      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Include timestamp & device info</Text>
        <Switch value={includeMetadata} onValueChange={setIncludeMetadata} />
      </View>


      <View style={{ marginTop: 'auto' }}>
        <Button title="Save" onPress={save} />
      </View>
    </View>
  );
}

