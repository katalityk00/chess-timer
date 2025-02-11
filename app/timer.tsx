import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { Button, Dialog, Text } from "react-native-paper";
import moment from "moment";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Timer () {
	const {colors} = useColorScheme();
	const {timer} = useLocalSearchParams();

	const [whiteTimeLeft, setWhiteTime] = useState(new Date(parseInt(timer as string)));
	const [blackTimeLeft, setBlackTime] = useState(new Date(parseInt(timer as string)));
	const [playerTurn, setPlayerTurn] = useState<'white'| 'black' | null>(null);
	const [quitting, setQuitting] = useState(false);
	const intervalWhiteRef = useRef<NodeJS.Timeout | null>(null);
	const intervalBlackRef = useRef<NodeJS.Timeout | null>(null);




	const Tap = () => {
		if(playerTurn === 'white' && !intervalWhiteRef.current) {
			return startWhiteTimer();
		}
		setPlayerTurn((prevPlayerTurn) => (prevPlayerTurn === 'white' ? 'black' : 'white'));
	}

	const startWhiteTimer = () => {
		stopBlackTimer();
		intervalWhiteRef.current = setInterval(() => {
			setWhiteTime((prevTime) => {
				const newTime = moment(prevTime).subtract(1, 'second').toDate(); 
				if(moment(newTime).isSameOrBefore(moment(0))) {
					stopWhiteTimer();
				}
				return newTime;
			});

		}, 1000);
	}
	const startBlackTimer = () => {
		stopWhiteTimer();
		intervalBlackRef.current = setInterval(() => {
			setBlackTime((prevTime) => {
				const newTime = moment(prevTime).subtract(1, 'second').toDate(); 
				if(moment(newTime).isSameOrBefore(moment(0))) {
					stopBlackTimer();
				}
				return newTime;
			});
		}, 1000);
	}

	const stopWhiteTimer = () => {
		if(intervalWhiteRef.current) {
			clearInterval(intervalWhiteRef.current);
		}
	}
	const stopBlackTimer = () => {
		if(intervalBlackRef.current) {
			clearInterval(intervalBlackRef.current);
		}
	}

	const stopAllTimers = () => {
		stopBlackTimer();
		stopWhiteTimer();
	}

	useEffect(() => {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
		return () => {
			ScreenOrientation.unlockAsync();
		}
	},[]);

	useEffect(() => {
		console.log('player turn is', playerTurn);
		if(playerTurn === 'white' ) {
			startWhiteTimer();
		} else if(playerTurn === 'black') {
			startBlackTimer();
		}
		return () => {
			stopAllTimers();
		}
	}, 
	[playerTurn]);


	return (
		<View style={styles.container}>
			<Button mode="elevated" onPress={() => setQuitting(true)}>Back</Button>
			<View style={{flex: 1,flexDirection: 'row'}}>
			{/** black area */}
			<TouchableOpacity 
				disabled={playerTurn !=='black'} 
				style={[styles.btn, {backgroundColor: colors.background}]} 
				onPress={Tap}>
				<Text style={{fontSize: 48, color: colors.text, transform: [{rotate: '90deg'}]}}>{moment(blackTimeLeft).format('mm:ss')}</Text>
			</TouchableOpacity>
			{/** white area */}
			<TouchableHighlight disabled={playerTurn === 'black'} style={[styles.btn, {backgroundColor: colors.primary}]} onPress={Tap}>
				<Text style={{fontSize: 48, color: colors.background, transform: [{rotate: '270deg'}]}}>{moment(whiteTimeLeft).format('mm:ss')}</Text>
			</TouchableHighlight>
			<Dialog visible={moment(whiteTimeLeft).isSameOrBefore(moment(0)) || moment(blackTimeLeft).isSameOrBefore(moment(0))}>
				<Dialog.Icon icon="alert" />
				<Dialog.Title>Game Over</Dialog.Title>
				<Dialog.Content>
					<Text>{playerTurn} has run out of time</Text>
				</Dialog.Content>
				<Dialog.Actions>
          <Button onPress={() => router.canGoBack() && router.back()}>Ok</Button>
        </Dialog.Actions>
			</Dialog>
			<Dialog visible={quitting}>
				<Dialog.Title>Quit Game</Dialog.Title>
				<Dialog.Content>
					<Text>Are you sure you want to quit?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => router.canGoBack() && router.back()}>Yes</Button>
					<Button onPress={() => setQuitting(false)}>No</Button>
				</Dialog.Actions>
			</Dialog>
		</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-evenly',
	},
	btn: {
		flex: 1,  justifyContent: 'center', alignItems: 'center'
	}
});