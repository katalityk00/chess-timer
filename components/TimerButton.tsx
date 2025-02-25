import React, { useRef, useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, Animated, Easing, View, useAnimatedValue } from 'react-native';
import moment from 'moment';
import { Theme } from '@react-navigation/native';
import { Audio } from 'expo-av';
import soundFiles from '@/assets/sounds/AudioMap';
import { useAppSelector } from '@/hooks/useStore';

interface TimerButtonProps {
  timeLeft: Date;
  onPress: () => void;
  disabled: boolean;
  colors: Theme["colors"];
  isTop?: boolean;
	sound?: string;
}

const TimerButton: React.FC<TimerButtonProps> = (props) => {
	const { timeLeft, disabled, colors, isTop } = props;
	const [sound, setSound] = useState<Audio.Sound | null>();
	const sizeAnim = useRef(new Animated.Value(disabled ? 0 : 1)).current;
	const colorAnim = useRef(new Animated.Value(disabled ? 1 : 0)).current;
	const { soundEnabled } = useAppSelector(state => state.preference);

	useEffect(() => {
			return sound
				? () => {
						console.log('Unloading Sound');
						sound.unloadAsync();
					}
				: undefined;
		}, [sound]);
	useEffect(() => {
		Animated.sequence([
			Animated.timing(sizeAnim, {
				toValue: disabled ? 0 : 1,
				duration: 400,
				easing: Easing.ease,
				useNativeDriver: false
			}),
			Animated.timing(colorAnim, {
				toValue: disabled ? 0 : 1,
				duration: 10,
				easing: Easing.ease,
				useNativeDriver: false
			}),
		]).start();
	}, [disabled]);

	const colorInterpolated = colorAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['grey', colors.primary]
	});


	const interpolatedSize = sizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 800] 
  });

	const playSound = async () => {
		if (!soundEnabled) return;
		const soundFileName = props.sound || 'simple-click.mp3';
		const soundPath = soundFiles[soundFileName];
		try {
			const { sound } = await Audio.Sound.createAsync(soundPath);
			setSound(sound);
			await sound.playAsync();
		} catch (error) {
			console.error(error);
		}
	}

	const onPress = async() => {
		await playSound();
		props.onPress();
	}


  return (
    <Pressable style={{flex:1}} onPress={onPress} disabled={disabled}>
			<Animated.View style={[styles.btn, { backgroundColor: disabled ? "grey": colors.primary, }]}>
				<View style={[styles.circleContainer]}>
					<Animated.View
						style={[
							styles.circle,
							{
								width: interpolatedSize,
								height: interpolatedSize,
								borderRadius: interpolatedSize.interpolate({
									inputRange: [0, 200],
									outputRange: [0, 100] // Adjust the radius as needed
								}),
								backgroundColor:  colorInterpolated
							}
						]}
					/>
					<Text style={[{ color: colors.text, transform: isTop ? [{ rotate: '180deg' }] : [] }, styles.text]}>
						{moment(timeLeft).format('mm:ss')}
					</Text>
				</View>
			</Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 60,
    fontWeight: 'bold',
  },
	circleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
		overflow: 'hidden',
  },
	circle: {
    position: 'absolute',
    width: 800, // Initial size of the circle (larger than the button)
    height: 800, // Initial size of the circle (larger than the button)
    borderRadius: 200, // Half of the initial size
  },
});

export default TimerButton;