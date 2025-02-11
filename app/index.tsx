import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Menu () {
	const {colors} = useColorScheme();

	const goToTimer = (timer: number) => {
		if(!timer) {
			throw new Error('Timer is not defined');
		}
		router.push({pathname: '/timer', params: {timer}});	
	}

	return (
		<View style={styles.container}>
			<Text style={[styles.title,{color:	colors.text}]}>Durée de la partie :</Text>
			<Button mode="contained" onPress={() => goToTimer(3*60*1000)}>
				<Text style={[styles.btnText,{color:colors.primary}]}>3 min</Text>
			</Button>
			<Button mode="contained" onPress={() => goToTimer(5*60*1000)}>
				<Text style={[styles.btnText,{color:colors.primary}]}>5 min</Text>
			</Button>
			<Button mode="contained" onPress={() => goToTimer(10*60*1000)}>
				<Text style={[styles.btnText,{color:colors.primary}]}>10 min</Text>
			</Button>
			<Button mode="contained" onPress={() => goToTimer(15*60*1000)}>
				<Text style={[styles.btnText,{color:colors.primary}]}>30 min</Text>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		padding: 24,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	btnText: {
		fontSize: 16,
		fontWeight: 'bold',
	}
});