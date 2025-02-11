import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, TouchableHighlight, TouchableOpacity, StatusBar } from "react-native";
import { Button, Dialog, Icon, IconButton, Text } from "react-native-paper";
import moment from "moment";
import * as ScreenOrientation from 'expo-screen-orientation';
import { parse } from "@babel/core";
import IconWithSound from "@/components/IconWithSound";

export default function Timer () {
	const {colors} = useColorScheme();
	const {timer} = useLocalSearchParams<{timer?: string}>();
	const orignalTimer = new Date(timer ? parseInt(timer) : 10*60*1000);
	const [topTimeLeft, setTopTime] = useState(orignalTimer);
	const [botTimeLeft, setBottime] = useState(orignalTimer);
	const [playerTurn, setPlayerTurn] = useState<'Top'| 'Bot' | null>(null);
	const intervalTopRef = useRef<NodeJS.Timeout | null>(null);
	const intervalBotRef = useRef<NodeJS.Timeout | null>(null);
	const [paused, setPaused] = useState(false);
	const [pausedPlayer, setPausedPlayer] = useState<'Top' | 'Bot' | null>(null);
	const [topDisabled, setTopDisabled] = useState(true);
	const [botDisabled, setBotDisabled] = useState(true);

	const stopTopTimer = () => {
		if(intervalTopRef.current) {
			clearInterval(intervalTopRef.current);
		}
	}
	const stopBotTimer = () => {
		if(intervalBotRef.current) {
			clearInterval(intervalBotRef.current);
		}
	}

	const tap = (player: 'Top' |'Bot') => {
		console.log('tapped', player);
		setPaused(false);
		if(player === 'Top') {
			setPlayerTurn('Bot');	
			setPausedPlayer('Bot');
			return;
		}
		setPlayerTurn('Top');
		setPausedPlayer('Top');
	}

	const startTopTimer = () => {
		console.log('starting top timer');
		intervalTopRef.current = setInterval(() => {
			setTopTime((prev) => {
				const now = moment(prev).subtract(100, 'milliseconds');
				if(now.isBefore(moment(0))) {
					stopTopTimer();
				}
				return now.toDate();
			});
		}, 100);

	}
	const startBotTimer = () => {
		intervalBotRef.current = setInterval(() => {
			setBottime((prev) => {
				const now = moment(prev).subtract(100, 'milliseconds');
				if(now.isBefore(moment(0))) {
					stopBotTimer();
				}
				return now.toDate();
			});
		}, 100);
	}


	const stopAllTimers = () => {
		stopTopTimer();
		stopBotTimer();
	}

	const reset = () => {
		stopAllTimers();
		setTopTime(orignalTimer);
		setBottime(orignalTimer);
		setBotDisabled(true);
		setTopDisabled(true);
		setPlayerTurn(null);
		setPaused(false);
	}

	const togglePause = () => {
		if(!paused){
			setPlayerTurn(null);
			setBotDisabled(true);
			setTopDisabled(true);
		}else {
			setPlayerTurn(pausedPlayer);
		}
		setPaused(prev => !prev);
		return;
	}

	useEffect(() => {
		console.log('player turn is', playerTurn);
		console.log('theme is', colors);
		stopAllTimers();
		if(playerTurn === 'Top') {
			startTopTimer();
			setBotDisabled(true);
			setTopDisabled(false);
		}else if(playerTurn === 'Bot') {
			startBotTimer();
			setTopDisabled(true);
			setBotDisabled(false);
		}
		return () => {
			stopAllTimers();
		}
	}, 
	[playerTurn]);


	return (
		<View style={styles.container}>
			<StatusBar
          animated={true}
          backgroundColor={colors.card}
        />
			{/**Top button */}
			<TouchableOpacity onPress={() => tap('Top')}
			disabled={botDisabled && topDisabled ? false : topDisabled}
			style={[styles.btn, topDisabled ? styles.disabledBtn: {backgroundColor: colors.primary}]}>
				<Text style={[
					{color: colors.text, transform: [{rotate: '180deg'}]},
					styles.text
					]}>
					{moment(topTimeLeft).format('mm:ss')}
				</Text>
			</TouchableOpacity>
			{/**central bar */}
			<View style={[styles.centralBar, {backgroundColor: colors.card}]}>
				<IconWithSound icon="restart" onPress={reset}/>
				<IconWithSound icon={paused ? 'play' : 'pause'} onPress={() => togglePause()}/>
				<IconWithSound style={{position: 'absolute',right: 10}} icon="timer" onPress={() => router.push('/selector')}/>
			</View>
			{/**Bot button */}
			<TouchableOpacity onPress={() => tap('Bot')}
			disabled={botDisabled && topDisabled? false : botDisabled}
			style={[styles.btn, botDisabled ? styles.disabledBtn: {backgroundColor: colors.primary}]}>
				<Text style={[
					{color: colors.text},
					styles.text
					]}>
						{moment(botTimeLeft).format('mm:ss')}
					</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-evenly',
	},
	centralBar: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10
	},
	text: {
		fontSize: 60,
		fontWeight: 'bold'
	},
	btn: {
		flex: 1,  justifyContent: 'center', alignItems: 'center',
	},
	disabledBtn: {
		backgroundColor: 'grey'
	}
})