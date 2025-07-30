import * as MediaLibrary from 'expo-media-library';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import ToolItem from '../../components/ToolItem';



const initialItems = [
  // ... your existing items 1-22 above ...
   {
    id: '1',
    name: 'Clothes',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  },
  {
    id: '2',
    name: 'Shirts & Pants ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  },
  {
    id: '3',
    name: 'Kurta ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3106/3106773.png',
  },
  {
    id: '4',
    name: 'Basket',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/1042/1042330.png',
  },
  {
    id: '5',
    name: 'Washing Vessel ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2815/2815477.png',
  },
  {
    id: '6',
    name: 'Strainer ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/1516/1516735.png',
  },
  {
    id: '7',
    name: 'Double Basin ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3665/3665923.png',
  },
  {
    id: '8',
    name: 'Single Basin ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png',
  },
  {
    id: '9',
    name: 'Chair ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/9120/9120082.png',
  },
  {
    id: '10',
    name: 'Round Table',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/1935/1935354.png',
  },
  {
    id: '11',
    name: 'Maharaja Chair ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/4087/4087626.png',
  },
  {
    id: '12',
    name: 'Sofa ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3106/3106773.png',
  },
  {
    id: '13',
    name: 'Stool ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2674/2674557.png',
  },
  {
    id: '14',
    name: 'Plastic Stool',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/6277/6277325.png',
  },
  {
    id: '15',
    name: 'Iron Stool ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3602/3602512.png',
  },
  {
    id: '16',
    name: 'Steel Stool ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3602/3602512.png',
  },
  {
    id: '17',
    name: 'Drum (Blue) ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3082/3082031.png',
  },
  {
    id: '18',
    name: 'Plastic Drum ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/4474/4474836.png',
  },
  {
    id: '19',
    name: 'Tea Drum ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3082/3082031.png',
  },
  {
    id: '20',
    name: 'India Pot ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/3814/3814273.png',
  },
  {
    id: '21',
    name: 'Frame 15x20 / 15x20',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2783/2783209.png',
  },
  {
    id: '22',
    name: 'Waterproof Jumbo ',
    count: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2694/2694696.png',
  },
  {
    id: '23',
    name: 'Bomber ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '24',
    name: 'Jumbo Bomber ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '25',
    name: 'Pants with Combo (60) ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '26',
    name: 'Pants Size 55 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '27',
    name: 'Pants Size 50',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '28',
    name: 'Pants Size 45 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '29',
    name: 'Pants Size 40 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '30',
    name: 'Pants Size 35 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '31',
    name: 'Pants Size 30 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '32',
    name: 'Pants Size 25 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '33',
    name: 'Pants Size 20 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '34',
    name: 'Pants Size 15 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '35',
    name: 'Pants Size 10 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '36',
    name: 'Fashion Drum ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '37',
    name: 'T-Shirts ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '38',
    name: 'Innerwear',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '39',
    name: 'Towels ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '40',
    name: 'Coolers ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '41',
    name: 'A.P. Chair ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '42',
    name: 'Fancy Chairs',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '43',
    name: 'Bottle Stools ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '44',
    name: 'Frame 9x18 / 9x18',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '45',
    name: 'Frame 12x24 / 12x24',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '46',
    name: 'Frame 15x30 / 15x30',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '47',
    name: 'Frame 18x36 / 18x36',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '48',
    name: 'Jumbo ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '49',
    name: 'Prime Ceiling 20x20 ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '50',
    name: 'Frame 15x15 / 15x15',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '51',
    name: 'Frame 12x15 / 12x15',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '52',
    name: 'Frame 10x15 / 10x15',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: '53',
    name: 'Adavi Badugu ',
    count: 0,
    image: 'https://via.placeholder.com/40',
  },
];




export default function ToolsListScreen() {
  const cartRef = useRef<View>(null);
  const exportRef = useRef(null);
  const [items, setItems] = useState(initialItems);
  const [modalVisible, setModalVisible] = useState(false);

  const updateCount = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, count: Math.max(0, item.count + delta) } : item
      )
    );
  };

  const selectedItems = items.filter(item => item.count > 0);
  const totalCount = selectedItems.reduce((sum, item) => sum + item.count, 0);
  const handleDownload = async () => {
  try {
    const uri = await captureRef(exportRef, {
      format: 'png',
      quality: 1,
    });

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.granted) {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('EventStore', asset, false);
      alert('📸 Cart saved to your gallery!');
    } else {
      alert('Permission denied to save image.');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to save image.');
  }
};



  return (

    <View style={styles.container}>
      <View ref={exportRef} collapsable={false} style={{ position: 'absolute', top: 10000 }}>
        <Text style={styles.modalTitle}>🛒 Cart Summary</Text>
          {selectedItems.map(item => (
           <View key={item.id} style={styles.itemRow}>
      <View style={styles.iconCircle}><Text>🧺</Text></View>
      <View style={styles.itemText}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCount}>Qty: {item.count}</Text>
      </View>
           </View>
           ))}
         <Text style={styles.totalText}>Total Items: {totalCount}</Text>
     </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ToolItem item={item} onChange={updateCount} />
        )}
      />

      {/* Cart Modal */}
    
       <Modal visible={modalVisible} animationType="slide" transparent>
       <View style={styles.modalOverlay}>
    <View ref={cartRef} collapsable={false} style={styles.modalCard}>
      <Text style={styles.modalTitle}>🛒 Cart Summary</Text>

      {selectedItems.length === 0 ? (
        <Text style={styles.emptyText}>No items selected.</Text>
      ) : (
        <ScrollView style={styles.scrollArea}>
          {selectedItems.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>🧺</Text>
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCount}>Qty: {item.count}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Text style={styles.totalText}>Total Items: {totalCount}</Text>

      <Pressable style={styles.downloadBtn} onPress={handleDownload}>
        <Text className="pt-4 pb-4" style={styles.downloadText}>
          Order Now
        </Text>
      </Pressable>

      <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </View>
       </View>
      </Modal>


      {/* Floating Button */}
    
     <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
     <Text style={styles.fabText}>Items: {totalCount}</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#000',
    borderRadius: 1040,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: "10px"
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    paddingLeft: 6,
    fontFamily: 'DMSans_400Regular',
  },

  
  
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  padding: 20,
},
modalCard: {
  backgroundColor: '#fff',
  borderRadius: 36,
  padding: 20,
  width: '100%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  maxHeight: '100%', // ✅ Important
},
scrollArea: {
  maxHeight: 250, // ✅ Adjust height for scrollable list
  marginVertical: 10,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 16,
  fontFamily: 'DMSans_700Bold',
},
emptyText: {
  textAlign: 'center',
  color: '#888',
  marginBottom: 10,
  fontFamily: 'DMSans_400Regular',
},
itemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  borderBottomColor: '#eee',
  borderBottomWidth: 1,
},
iconCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
itemText: {
  flex: 1,
},
itemName: {
  fontSize: 16,
  fontFamily: 'DMSans_700Bold',
},
itemCount: {
  color: '#666',
  fontSize: 14,
  fontFamily: 'DMSans_400Regular',
},
totalText: {
  marginTop: 16,
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'right',
  fontFamily: 'DMSans_700Bold',
},
downloadBtn: {
  marginTop: 20,
  backgroundColor: '#111',
  borderRadius: 30,
  padding: 14,
  alignItems: 'center',
},
downloadText: {
  color: '#fff',
  fontSize: 16,
  fontFamily: 'DMSans_700Bold',
},
closeBtn: {
  marginTop: 10,
  backgroundColor: '#ddd',
  padding: 14,
  borderRadius: 58,
  alignItems: 'center',
},
closeText: {
  fontSize: 15,
  fontFamily: 'DMSans_400Regular',
},

});
