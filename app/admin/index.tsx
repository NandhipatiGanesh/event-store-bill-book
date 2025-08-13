import { useClerk, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Picked = { uri: string; fileName?: string; type?: string };

// ----- Config -----
const ADMIN_EMAILS = (process.env.EXPO_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your.api/products';

// Append a file to FormData (RN + Web friendly)
async function appendFile(
  form: FormData,
  field: string,
  p: Picked
): Promise<void> {
  if (Platform.OS === 'web') {
    const blob = await fetch(p.uri).then((r) => r.blob());
    form.append(field, blob, p.fileName ?? 'file.jpg'); // web: use Blob overload
  } else {
    const file = {
      uri: p.uri,
      name: p.fileName ?? 'file.jpg',
      type: p.type ?? 'application/octet-stream',
    } as any; // RN accepts { uri, name, type }
    (form as any).append(field, file);
  }
}

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isAdmin = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
    return !!email && ADMIN_EMAILS.includes(email);
  }, [user]);

  // Form state
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [mainImage, setMainImage] = useState<Picked | null>(null);
  const [gallery, setGallery] = useState<Picked[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ---- Guard ----
  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Admin Only</Text>
        <Text style={styles.subtitle}>
          Sign in with an admin email to access this page.
        </Text>
        <Pressable
          onPress={() => router.replace('/')}
          style={[styles.btn, styles.secondary, { marginTop: 16 }]}
        >
          <Text style={styles.btnText}>Go Home</Text>
        </Pressable>
        <Pressable onPress={() => signOut()} style={[styles.btn, { marginTop: 8 }]}>
          <Text style={styles.btnText}>Sign Out</Text>
        </Pressable>
      </View>
    );
  }

  // ---- Pickers ----
  const pickOne = useCallback(async (): Promise<Picked | null> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to pick images.');
      return null;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsMultipleSelection: false,
    });
    if (res.canceled) return null;
    const a = res.assets[0];
    return {
      uri: a.uri,
      fileName: a.fileName ?? a.uri.split('/').pop() ?? 'image.jpg',
      type: a.mimeType ?? 'image/jpeg',
    };
  }, []);

  const pickMultiple = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to pick images.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsMultipleSelection: true, // iOS/web multi; Android may still return one
      selectionLimit: 0,
    });
    if (res.canceled) return;
    const picks: Picked[] = res.assets.map((a) => ({
      uri: a.uri,
      fileName: a.fileName ?? a.uri.split('/').pop() ?? 'image.jpg',
      type: a.mimeType ?? 'image/jpeg',
    }));
    setGallery((g) => [...g, ...picks]);
  }, []);

  const removeFromGallery = useCallback((index: number) => {
    setGallery((g) => g.filter((_, i) => i !== index));
  }, []);

  // ---- Submit ----
  const submit = useCallback(async () => {
    if (!name.trim()) return Alert.alert('Missing name', 'Please enter a product name.');
    if (!mainImage) return Alert.alert('Missing image', 'Please choose a main image.');

    try {
      setSubmitting(true);

      const form = new FormData();
      form.append('name', name.trim());
      form.append('details', details.trim());

      // main image
      await appendFile(form, 'mainImage', mainImage);

      // gallery[]
      for (const g of gallery) {
        await appendFile(form, 'gallery', g);
      }

      const resp = await fetch(API_URL, {
        method: 'POST',
        // don't set Content-Type; RN sets proper multipart boundary
        body: form,
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error(`Upload failed: ${resp.status} ${txt}`);
      }

      Alert.alert('Success', 'Product created.');
      setName('');
      setDetails('');
      setMainImage(null);
      setGallery([]);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to upload.');
    } finally {
      setSubmitting(false);
    }
  }, [name, details, mainImage, gallery]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create Product</Text>

        <Text style={styles.label}>Product name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Summer T-Shirt"
          placeholderTextColor="rgba(255,255,255,0.75)"
          style={styles.input}
        />

        <Text style={styles.label}>Details</Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Describe the product..."
          placeholderTextColor="rgba(255,255,255,0.75)"
          style={[styles.input, styles.textarea]}
          multiline
        />

        <Text style={styles.label}>Main image</Text>
        {mainImage ? (
          <View style={styles.imageRow}>
            <Image source={{ uri: mainImage.uri }} style={styles.mainImage} />
            <Pressable onPress={() => setMainImage(null)} style={[styles.btn, styles.danger]}>
              <Text style={styles.btnText}>Remove</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={async () => setMainImage(await pickOne())} style={styles.btn}>
            <Text style={styles.btnText}>Choose main image</Text>
          </Pressable>
        )}

        <Text style={styles.label}>Gallery</Text>
        {gallery.length > 0 && (
          <FlatList
            data={gallery}
            keyExtractor={(_, i) => String(i)}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item, index }) => (
              <View>
                <Image source={{ uri: item.uri }} style={styles.galleryImage} />
                <Pressable onPress={() => removeFromGallery(index)} style={[styles.smallBtn, styles.danger]}>
                  <Text style={styles.smallBtnText}>Remove</Text>
                </Pressable>
              </View>
            )}
          />
        )}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable onPress={pickMultiple} style={[styles.btn, styles.secondary, { flex: 1 }]}>
            <Text style={styles.btnText}>Add gallery images</Text>
          </Pressable>
          {gallery.length > 0 && (
            <Pressable onPress={() => setGallery([])} style={[styles.btn, styles.danger]}>
              <Text style={styles.btnText}>Clear</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={submit}
          disabled={submitting}
          style={[styles.btn, submitting && styles.disabled, { marginTop: 16 }]}
        >
          <Text style={styles.btnText}>{submitting ? 'Uploading…' : 'Create product'}</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0b0b', padding: 24 },
  header: { color: '#fff', fontSize: 26, marginBottom: 12, fontFamily: 'DMSans_700Bold' },
  title: { color: '#fff', fontSize: 22, fontFamily: 'DMSans_700Bold' },
  subtitle: { color: '#aaa', fontSize: 14, marginTop: 6, textAlign: 'center', fontFamily: 'DMSans_400Regular' },
  label: { color: '#ddd', marginTop: 12, marginBottom: 6, fontFamily: 'DMSans_500Medium' },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    color: '#fff',
    fontFamily: 'DMSans_400Regular',
  },
  textarea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: { backgroundColor: '#333' },
  danger: { backgroundColor: '#7A2D2D' },
  disabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontFamily: 'DMSans_700Bold' },
  smallBtn: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  smallBtnText: { color: '#fff', fontSize: 12, fontFamily: 'DMSans_700Bold' },
  imageRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mainImage: { width: 120, height: 120, borderRadius: 12, backgroundColor: '#222' },
  galleryImage: { width: 110, height: 110, borderRadius: 10, backgroundColor: '#222' },
});
