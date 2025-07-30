// components/ToolItem.tsx
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ToolItemProps {
  item: {
    id: string;
    name: string;
    count: number;
    image?: string; // ✅ optional image URL
  };
  onChange: (id: string, delta: number) => void;
}

export default function ToolItem({ item, onChange }: ToolItemProps) {
  return (
    <View style={styles.card}>
      {/* ✅ Image + Name */}
      <View style={styles.info}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        <Text style={[styles.name, { fontFamily: 'DMSans_400Regular' }]}>
          {item.name}
        </Text>
      </View>

      {/* ✅ Counter Buttons */}
      <View style={styles.counter}>
        <TouchableOpacity
          onPress={() => onChange(item.id, -1)}
          style={styles.btn}
        >
          <Text style={[styles.btnText, { fontFamily: 'DMSans_700Bold' }]}>
            −
          </Text>
        </TouchableOpacity>
        <Text style={[styles.count, { fontFamily: 'DMSans_400Regular' }]}>
          {item.count}
        </Text>
        <TouchableOpacity
          onPress={() => onChange(item.id, 1)}
          style={styles.btn}
        >
          <Text style={[styles.btnText, { fontFamily: 'DMSans_700Bold' }]}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#e9e9e9',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 10,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#ffffff',
    borderRadius: 104,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 5,
    elevation: 2,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
  },
  count: {
    fontSize: 18,
    minWidth: 20,
    textAlign: 'center',
  },
});
