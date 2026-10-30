import { router } from 'expo-router';
/**
 * IMPORTS
 */
import { Text, TouchableOpacity, View } from 'react-native';

const App = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={() => router.push('/singin')}>
        <Text className="text-lg text-primary">App</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * EXPORTS
 */
export default App;
