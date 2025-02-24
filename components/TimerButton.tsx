import React, { useRef, useEffect } from 'react';
import { Pressable, Text, StyleSheet, Animated, Easing, View, useAnimatedValue } from 'react-native';
import moment from 'moment';
import { Theme } from '@react-navigation/native';

interface TimerButtonProps {
  timeLeft: Date;
  onPress: () => void;
  disabled: boolean;
  colors: Theme["colors"];
  isTop?: boolean;
}

const TimerButton: React.FC<TimerButtonProps> = ({ timeLeft, onPress, disabled, colors, isTop }) => {
	const colorAnim = useRef(new Animated.Value(disabled ? 0 : 1)).current;
	const sizeAnim = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.timing(colorAnim, {
      toValue: disabled ? 0 : 1,
      duration: 10,
      easing: Easing.circle,
      useNativeDriver: true
    }).start();
		Animated.timing(sizeAnim, {
      toValue: disabled ? 0 : 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
	}, [disabled]);

	const interpolatedSize = sizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 800] 
  });

	const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['grey', colors.primary]
  });

  return (
    <Pressable style={{flex:1}} onPress={onPress} disabled={disabled}>
			<Animated.View style={[styles.btn, { backgroundColor: interpolatedColor }]}>
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
								backgroundColor: colors.primary
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