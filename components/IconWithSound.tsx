import { IconButton, IconButtonProps } from "react-native-paper";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import { GestureResponderEvent } from "react-native";

type Props = IconButtonProps & {
	sound?: string
} 

// Créer un objet de mapping pour les fichiers audio
const soundFiles: { [key: string]: any } = {
	'db-click.wav': require('../assets/sounds/db-click.wav'),
	// Ajoutez d'autres fichiers audio ici
};

export default function IconWithSound(props: Props) {
	const [sound, setSound] = useState<Audio.Sound | null>();
	useEffect(() => {
		const loadSound = async () => {
			const soundFileName = props.sound || 'db-click.wav';
			const soundPath = soundFiles[soundFileName];
			const { sound } = await Audio.Sound.createAsync(soundPath);
			setSound(sound);
		};
		loadSound();
		return () => {
			sound && sound.unloadAsync();
		}
	}, []);


	const playSound = async () => {
		try {
			if(!sound) {
				return;
			}
			console.log('playing sound ...');
			sound.replayAsync();
		} catch (error) {
			console.error(error);
		}
	}
	const onPress = (event: GestureResponderEvent) => {
		playSound();
		props.onPress && props.onPress(event);
	}
	return (
			<IconButton {...props} onPress={onPress}/>
	);
}