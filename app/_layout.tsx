import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from '../store/store';
import { Stack } from 'expo-router';
import { StatusBar, StyleSheet } from "react-native";

export default function Layout() {
  const { colors } = useColorScheme();

  return (
    <Provider store={store}>
        <StatusBar animated={true} backgroundColor={colors.card} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
            // Animation de transition
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Timer',
              headerShown: false, // Cache le header sur la page principale
            }}
          />
          <Stack.Screen
            name="preferences"
            options={{
              title: 'Préférences',
              presentation: 'modal', // Animation modale pour cette page
            }}
          />
          <Stack.Screen
            name="cadances"
            options={{
              title: 'Cadances',
              presentation:'modal' // Animation modale pour cette page
            }}
          />
        </Stack>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});