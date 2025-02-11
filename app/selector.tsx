import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Selector() {
	const {colors} = useColorScheme();
	return (
		<View style={{flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'space-evenly'}}>
			<Text>Selector</Text>
		</View>
	)
}