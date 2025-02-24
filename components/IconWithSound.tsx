import { IconButton, IconButtonProps } from "react-native-paper";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import { GestureResponderEvent } from "react-native";
import soundFiles from "@/assets/sounds/AudioMap";

type Props = IconButtonProps & {
	sound?: string
} 
export default function IconWithSound(props: Props) {
	const [sound, setSound] = useState<Audio.Sound | null>();
	useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


	const playSound = async () => {
		const soundFileName = props.sound || 'db-click.wav';
		const soundPath = soundFiles[soundFileName];
		try {
			const { sound } = await Audio.Sound.createAsync(soundPath);
			setSound(sound);
			await sound.playAsync();
		} catch (error) {
			console.error(error);
		}
	}
	const onPress = async(event: GestureResponderEvent) => {
		await playSound();
		props.onPress && props.onPress(event);
	}
	return (
			<IconButton {...props} onPress={onPress}/>
	);
}