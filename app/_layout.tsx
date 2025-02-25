import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from '../store/store';
import { Slot } from 'expo-router';
import { StatusBar, View, StyleSheet } from "react-native";

export default function Layout() {
  const { colors } = useColorScheme();

  return (
    <Provider store={store}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <StatusBar animated={true} backgroundColor={colors.card} />
        <Slot />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});