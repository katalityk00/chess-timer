import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { adaptNavigationTheme } from "react-native-paper";
import { useColorScheme as colorScheme } from "react-native";
 import Colors from "@/constants/Colors";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: {...NavigationDefaultTheme, colors: Colors.colorsLight},
  reactNavigationDark: {...NavigationDarkTheme, colors: Colors.colorsDark},
});

export const useColorScheme = () => {
	const name = colorScheme();
	if(name === 'dark') {
		return DarkTheme;
	}
	return LightTheme;
}
