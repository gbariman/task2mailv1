import * as ImageManipulator from 'expo-image-manipulator';


export async function compressImage(uri: string) {
  // longest side 1600px, quality ~0.85
  const r = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1600 } }], { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG });
  return r.uri;
}

