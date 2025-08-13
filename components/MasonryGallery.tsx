// components/MasonryGallery.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

type Photo = {
  id: string | number;
  url: string;
  width?: number;   // original width  (optional but helps)
  height?: number;  // original height (optional but helps)
};

type Props = {
  // keep for future — the component already prefers fallback first
  apiUrl?: string;
  fallback?: Photo[];
  columns?: number;      // default 2
  gap?: number;          // default 8
  pagePadding?: number;  // default 12
  radius?: number;       // default 12
  forceSquare?: boolean; // default false — set true for Instagram-like squares
  onPressPhoto?: (p: Photo) => void;
};

// --- your fallback images (works now even if API isn't used) ---
const DEFAULT_FALLBACK: Photo[] = [
  { id: '1', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-yu-xin-2154361082-33272754-scaled.jpg', width: 2000, height: 3000 },
  { id: '2', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-ahmetyuksek-32292293-scaled.jpg',                     width: 3000, height: 2000 },
  { id: '3', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-iulian-sandu-294198313-30082932-scaled.jpg',        width: 2400, height: 3200 },
  { id: '4', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-miguel-rivera-2150485053-33305403-scaled.jpg',      width: 3000, height: 2000 },
  { id: '5', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-eyup-sayar-290427017-18373303-scaled.jpg',          width: 2000, height: 3000 },
  { id: '6', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-roger-castillo-2154580376-33351437-scaled.jpg',     width: 2400, height: 1600 },
  { id: '7', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-liisbet-luup-121486327-33118519-scaled.jpg', width: 2400, height: 1600},
  { id: '8', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-lucasarleta-33288872-scaled.jpg', width: 2400, height: 1600},
  { id: '9', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-lorenzo-castellino-61076802-33229956-scaled.jpg', width: 2400, height: 1600},
  { id: '10', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-handi-berty-3128950-12040604-scaled.jpg', width: 2400, height: 1600},
  { id: '11', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-iulian-sandu-294198313-32050008-scaled.jpg',          width: 2000, height: 3000 },
  { id: '12', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-daniel-adesina-279287-27113617-scaled.jpg',     width: 2400, height: 1600 },
  { id: '13', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-aleksandra-s-282932122-30387220-scaled.jpg', width: 2400, height: 1600},
  { id: '14', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-evans-joel-930567223-32406278-scaled.jpg', width: 2400, height: 1600},
  { id: '15', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-omotayo-samuel-329103165-30492651-scaled.jpg', width: 2400, height: 1600},
  { id: '16', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-mikegles-32802110-scaled.jpg', width: 2400, height: 1600},
  { id: '17', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-yu-xin-2154361082-33272754-scaled.jpg', width: 2000, height: 3000 },
  { id: '18', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-ahmetyuksek-32292293-scaled.jpg',                     width: 3000, height: 2000 },
  { id: '19', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-iulian-sandu-294198313-30082932-scaled.jpg',        width: 2400, height: 3200 },
  { id: '20', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-miguel-rivera-2150485053-33305403-scaled.jpg',      width: 3000, height: 2000 },
  { id: '21', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-eyup-sayar-290427017-18373303-scaled.jpg',          width: 2000, height: 3000 },
  { id: '22', url: 'https://snippets.webcomponents.blog/wp-content/uploads/2025/08/pexels-roger-castillo-2154580376-33351437-scaled.jpg',     width: 2400, height: 1600 },
];

// screen width once
const screenW = Dimensions.get('window').width;

// safely add query params to a URL (handles ? or &)
function withParams(url: string, params: Record<string, string | number>) {
  try {
    const u = new URL(url);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
    return u.toString();
  } catch {
    // if URL() fails (e.g., relative url), just return original
    return url;
  }
}

// probe missing dimensions so layout can compute heights
async function ensureDimensions(items: Photo[]): Promise<Photo[]> {
  const probes = items.map(
    (p) =>
      new Promise<Photo>((resolve) => {
        if (p.width && p.height) return resolve(p);
        Image.getSize(
          p.url,
          (w, h) => resolve({ ...p, width: w, height: h }),
          // fallback guess if probe fails (web CORS can fail sometimes)
          () => resolve({ ...p, width: 1000, height: 1500 })
        );
      })
  );
  return Promise.all(probes);
}

export default function MasonryGallery({
  apiUrl,
  fallback = DEFAULT_FALLBACK,
  columns = 2,
  gap = 8,
  pagePadding = 12,
  radius = 12,
  forceSquare = false,
  onPressPhoto,
}: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load: prefer fallback now; keep API for later use
  const load = useCallback(async () => {
    setLoading(true);
    try {
      // For now, we explicitly start with fallback (as you asked)
      let items: Photo[] = [...fallback];

      // If you want to flip priority later, move this block above:
      if (apiUrl) {
        try {
          const res = await fetch(apiUrl);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              items = data as Photo[];
            }
          }
        } catch {
          // ignore API errors and keep fallback
        }
      }

      const ensured = await ensureDimensions(items);
      setPhotos(ensured);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fallback]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const { columnWidth, columnsData } = useMemo(() => {
    const totalGaps = gap * (columns - 1);
    const cw = (screenW - pagePadding * 2 - totalGaps) / columns;

    if (forceSquare) {
      // simple equal distribution if forcing squares
      const cols: Photo[][] = new Array(columns).fill(0).map(() => []);
      photos.forEach((p, idx) => cols[idx % columns].push(p));
      return { columnWidth: cw, columnsData: cols };
    }

    // masonry: greedy assign by current column height
    const heights = new Array(columns).fill(0) as number[];
    const cols: Photo[][] = new Array(columns).fill(0).map(() => []);
    photos.forEach((p) => {
      const ratio = (p.height || 1) / (p.width || 1);
      const h = cw * ratio;
      const colIndex = heights.indexOf(Math.min(...heights));
      cols[colIndex].push(p);
      heights[colIndex] += h + gap;
    });

    return { columnWidth: cw, columnsData: cols };
  }, [photos, columns, gap, pagePadding, forceSquare]);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: 40 }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: pagePadding }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={[styles.row, { gap }]}>
        {columnsData.map((col, i) => (
          <View key={i} style={{ width: columnWidth, gap }}>
            {col.map((p) => {
              const ratio = (p.height || 1) / (p.width || 1);
              const targetHeight = forceSquare ? columnWidth : columnWidth * ratio;

              // If you want width hints for remote CDNs, use params; else just p.url
              const uri = withParams(p.url, {
                // w: Math.round(columnWidth * 2), // uncomment if your host supports it
              });

              return (
                <Pressable key={String(p.id)} onPress={() => onPressPhoto?.(p)}>
                  <Image
                    source={{ uri }}
                    style={{
                      width: columnWidth,
                      height: targetHeight,
                      borderRadius: radius,
                      backgroundColor: '#eee', // light placeholder
                    }}
                    resizeMode="cover"
                  />
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  center: { justifyContent: 'center', alignItems: 'center' },
});
