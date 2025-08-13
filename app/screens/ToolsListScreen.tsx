//File : /app/screens/ToolsListScreen.tsx
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import ToolItem from '../../components/ToolItem';

// ✅ Types
type SizeItem = { label: string; count: number };
type Tool = {
  id: string;
  name: string;
  count: number;
  image?: string;
  sizes?: SizeItem[];
};
type SelectedItem = Tool & { sizeLabel?: string };
export default function ToolsListScreen() {
  const cartRef = useRef<View>(null);
  const exportRef = useRef(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [items, setItems] = useState<Tool[]>([
     {
    id: '1',
    name: 'బకెట్లు + గెరిట్లు',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  },
  {
    id: '2',
    name: 'భేష్ణులు + హస్తాలు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  },
  {
    id: '3',
    name: 'కాడగిన్నెలు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3106/3106773.png',
  },
  {
    id: '4',
    name: 'జగ్గులు',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/1042/1042330.png',
  },
  {
    id: '5',
    name: 'బిర్యానీ గెరిటా ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2815/2815477.png',
  },
  {
    id: '6',
    name: 'కురిపి ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/1516/1516735.png',
  },
  {
    id: '7',
    name: 'డబుల్ స్టవ్లు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3665/3665923.png',
  },
  {
    id: '8',
    name: 'సింగిల్ స్టవ్లు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png',
  },
  {
    id: '9',
    name: 'కట్టేలా పోయి ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/9120/9120082.png',
  },
  {
    id: '10',
    name: 'బాండాలి',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/1935/1935354.png',
  },
  {
    id: '11',
    name: 'జాంగ్రీ బాందాలి ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/4087/4087626.png',
  },
    {
      id: '12',
      name: 'పాత్రలు ముత్తాలు',
      count: 0,
      image: 'https://cdn-icons-png.flaticon.com/512/3106/3106773.png',
      sizes: [
        { label: '55', count: 0 },
        { label: '50', count: 0 },
        { label: '45', count: 0 },
        { label: '40', count: 0 },
        { label: '35', count: 0 },
        { label: '30', count: 0 },
        { label: '25', count: 0 },
        { label: '20', count: 0 },
        { label: '15', count: 0 },
        { label: '10', count: 0 }
      ]
    },
      {
    id: '13',
    name: 'స్టీల్ డ్రమ్ములు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2674/2674557.png',
  },
  {
    id: '14',
    name: 'ప్లాస్టిక్ డ్రమ్ములు',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/6277/6277325.png',
  },
  {
    id: '15',
    name: 'టీ డ్రమ్ములు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3602/3602512.png',
  },
  {
    id: '16',
    name: 'ఇడ్లీ పాత్రలు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3602/3602512.png',
  },
  {
    id: '17',
    name: 'టెబుల్స్ ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3082/3082031.png',
  },
  {
    id: '18',
    name: 'కర్చీలు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/4474/4474836.png',
  },
  {
    id: '19',
    name: 'రౌండ్ టేబుల్ ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3082/3082031.png',
  },
  {
    id: '20',
    name: 'వి.ఐ.పి కుర్చీలు ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3814/3814273.png',
  },
  {
    id: '21',
    name: 'మహారాజా కుర్చీలు',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2783/2783209.png',
  },
  {
    id: '22',
    name: 'సోఫా ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2694/2694696.png',
  },
  {
    id: '23',
    name: 'ఫ్యాన్s ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '24',
    name: 'ఇడ్లీ పాత్రలు ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '25',
    name: 'పాదాల తివాచీలు ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '26',
    name: 'సైడ్ కర్టెన్లు ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '27',
    name: 'బ్యాక్ స్క్రీన్లు',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '28',
    name: 'సైడ్ స్క్రీన్లు ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '29',
    name: 'బఫే స్టాల్ ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '30',
    name: 'బఫే ప్లేట్లు ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
    {
      id: '31',
      name: 'షామియానాలు',
      count: 0,
      image: 'https://via.placeholder.com/40',
      sizes: [
        { label: '9X18', count: 0 },
        { label: '12X24', count: 0 },
        { label: '15X30', count: 0 },
        { label: '18X36', count: 0 }
      ]
    },
    {
    id: '31',
    name: 'షామియానాలు ',
    count: 0,
    image: 'https://via.placeholder.com/40',
    sizes : [ 
      { label : "9X18", count : 0},
      {label : "12X24", count : 0},
      {label : "15X30", count : 0},
      {label : "18X36", count : 0}
    ]
  },
  {
    id: '32',
    name: 'జంబో ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '33',
    name: 'వాటర్ ప్రూఫ్ జంబో ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
    {
      id: '34',
      name: 'పైప్ సెట్టింగ్ 20*',
      count: 0,
      image: 'https://via.placeholder.com/40',
      sizes: [
        { label: '15X20', count: 0 },
        { label: '15X15', count: 0 },
        { label: '12X15', count: 0 },
        { label: '10X15', count: 0 }
      ]
    },
    {
      id: '35',
      name: 'ఆటో బాడుగ',
      count: 0,
      image: 'https://via.placeholder.com/40'
    }
  ]);

  const updateCount = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, count: Math.max(0, item.count + delta) } : item
      )
    );
  };

  const onSizeChange = (id: string, sizeIndex: number, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id || !item.sizes) return item;
        const updatedSizes = [...item.sizes];
        updatedSizes[sizeIndex].count = Math.max(0, updatedSizes[sizeIndex].count + delta);
        return { ...item, sizes: updatedSizes };
      })
    );
  };

  const selectedItems: SelectedItem[] = items.flatMap(item => {
  if (item.sizes) {
    return item.sizes
      .filter(size => size.count > 0)
      .map(size => ({ ...item, sizeLabel: size.label, count: size.count }));
  }
  return item.count > 0 ? [item] : [];
});

  const totalCount = selectedItems.reduce((sum, item) => sum + item.count, 0);

  const handleSnapshot = async () => {
    try {
      const uri = await captureRef(exportRef, {
        format: 'png',
        quality: 1
      });

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('EventStore', asset, false);
        Alert.alert('✅ Order Saved', '📸 Saved to your gallery!');
      } else {
        Alert.alert('Permission Denied', 'Cannot save snapshot.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const handleOrder = () => {
    if (!name || !phone) {
      Alert.alert('Missing Info', 'Please enter your name and number.');
      return;
    }
    setShowForm(false);
    setTimeout(handleSnapshot, 300);
  };

  return (
    <View style={styles.container}>
      {/* Hidden View for snapshot */}
      <View ref={exportRef} collapsable={false} style={{ position: 'absolute', top: 10000 }}>
        <Text style={styles.modalTitle}>🛒 Cart Summary</Text>
        {selectedItems.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.iconCircle}><Text>🧺</Text></View>
            <View style={styles.itemText}>
              <Text style={styles.itemName}>
                {item.name} {item.sizeLabel ? `(${item.sizeLabel})` : ''}
              </Text>
              <Text style={styles.itemCount}>Qty: {item.count}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.totalText}>Total Items: {totalCount}</Text>
        <Text style={styles.totalText}>Name: {name}</Text>
        <Text style={styles.totalText}>Phone: {phone}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ToolItem item={item} onChange={updateCount} onSizeChange={onSizeChange} />
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View ref={cartRef} collapsable={false} style={styles.modalCard}>
            <Text style={styles.modalTitle}>🛒 Cart Summary</Text>

            {selectedItems.length === 0 ? (
              <Text style={styles.emptyText}>No items selected.</Text>
            ) : (
              <ScrollView style={styles.scrollArea}>
                {selectedItems.map((item, i) => (
                  <View key={i} style={styles.itemRow}>
                    <View style={styles.iconCircle}><Text style={{ fontSize: 16 }}>🧺</Text></View>
                    <View style={styles.itemText}>
                      <Text style={styles.itemName}>
                        {item.name} {item.sizeLabel ? `(${item.sizeLabel})` : ''}
                      </Text>
                      <Text style={styles.itemCount}>Qty: {item.count}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <Text style={styles.totalText}>Total Items: {totalCount}</Text>

            {showForm ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <Pressable style={styles.downloadBtn} onPress={handleOrder}>
                  <Text style={styles.downloadText}>Submit & Save</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.downloadBtn} onPress={() => setShowForm(true)}>
                <Text style={styles.downloadText}>Order Now</Text>
              </Pressable>
            )}

            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>Items: {totalCount}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Styling
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 0, paddingBottom: 0 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    backgroundColor: '#000',
    borderRadius: 1040,
    paddingHorizontal: 32,
    paddingVertical: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DMSans_400Regular'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 36,
    padding: 20,
    width: '100%',
    maxHeight: '100%',
    elevation: 4
  },
  scrollArea: {
    maxHeight: 250,
    marginVertical: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'DMSans_700Bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontFamily: 'DMSans_400Regular'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f6f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  itemText: { flex: 1 },
  itemName: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold'
  },
  itemCount: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'DMSans_400Regular'
  },
  totalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    fontFamily: 'DMSans_700Bold'
  },
  downloadBtn: {
    marginTop: 20,
    backgroundColor: '#111',
    borderRadius: 30,
    padding: 14,
    alignItems: 'center'
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DMSans_700Bold'
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: '#ddd',
    padding: 14,
    borderRadius: 58,
    alignItems: 'center'
  },
  closeText: {
    fontSize: 15,
    fontFamily: 'DMSans_400Regular'
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    fontFamily: 'DMSans_400Regular'
  }
});
