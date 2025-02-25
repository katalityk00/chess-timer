import { IconButton, IconButtonProps } from "react-native-paper";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import { GestureResponderEvent } from "react-native";
import soundFiles from "@/assets/sounds/AudioMap";
import { useAppSelector } from "@/hooks/useStore";

type Props = IconButtonProps & {
	sound?: string
} 
export default function IconWithSound(props: Props) {
	const [sound, setSound] = useState<Audio.Sound | null>();
	const {soundEnabled} = useAppSelector(state => state.preference);
	useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


	const playSound = async () => {
		if(!soundEnabled) return;
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