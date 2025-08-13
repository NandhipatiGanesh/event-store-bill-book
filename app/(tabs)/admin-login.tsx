import { StyleSheet, View } from 'react-native';
import AdminScreen from '../admin/index';

export default function AdminLoginScreen() {
  return (
    <View style={styles.container}>
      <AdminScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
