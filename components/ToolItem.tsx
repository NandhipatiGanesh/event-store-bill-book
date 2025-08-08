import React, { useState } from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

// Enable layout animation for Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface ToolItemProps {
  item: {
    id: string;
    name: string;
    count: number;
    image?: string;
    sizes?: { label: string; count: number }[];
  };
  onChange: (id: string, delta: number) => void;
  onSizeChange?: (id: string, sizeIndex: number, delta: number) => void;
}

export default function ToolItem({ item, onChange, onSizeChange }: ToolItemProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleDrawer = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  const renderSizes = () => {
    // Only render sizes if item has sizes and expanded is true
    if (!item.sizes || !expanded) return null;

    return (
      <View style={styles.sizesContainer}>
        {item.sizes.map((size, index) => (
          <View key={index} style={styles.sizeRow}>
            {/* Size label (like 9X18) */}
            <Text style={styles.sizeLabel}>{size.label}</Text>

            {/* Counter for this size */}
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => onSizeChange?.(item.id, index, -1)} style={styles.btn}>
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.count}>{size.count}</Text>
              <TouchableOpacity onPress={() => onSizeChange?.(item.id, index, 1)} style={styles.btn}>
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Main item row (image, name, counter or arrow) */}
      <View style={styles.row}>
        {/* Left side: Image + Name */}
        <View style={styles.left}>
          {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          <Text style={styles.name}>{item.name}</Text>
        </View>

        {/* Right side: if sizes exist, show arrow; else show counter */}
        {item.sizes ? (
          <TouchableOpacity onPress={toggleDrawer}>
            <Text style={styles.arrow}>{expanded ? '▴' : '▾'}</Text>
          </TouchableOpacity>
        ) : (
          // If no sizes, show counter directly
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => onChange(item.id, -1)} style={styles.btn}>
              <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.count}>{item.count}</Text>
            <TouchableOpacity onPress={() => onChange(item.id, 1)} style={styles.btn}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Sizes dropdown section (only shown when expanded) */}
      {renderSizes()}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e9e9e9',
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 34,
    height: 34,
    borderRadius: 6,
    resizeMode: 'contain',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 10,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    elevation: 2,
  },
  btnText: {
    fontSize: 18,
    color: '#000',
  },
  count: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  sizesContainer: {
    marginTop: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sizeLabel: {
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
    width: 70,
    color: '#333',
  },
});
