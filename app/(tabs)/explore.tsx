import MasonryGallery from '@/components/MasonryGallery';
import { View } from 'react-native';


export default function GalleryScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MasonryGallery
        // apiUrl="https://your.api/photos"  // keep for later
        columns={2}          // try 3 if you like
        gap={8}
        forceSquare={false}  // set true if you want all tiles equal size
        onPressPhoto={(p) => console.log('photo tapped:', p.id)}
      />
    </View>
  );
}
