import { useColorScheme } from "@/hooks/useColorScheme";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Switch } from "react-native-paper";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useEffect, useState } from "react";
import { loadSettings, saveSettings, setSoundEnabled, setVibrationEnabled } from "@/store/slices/preferencesSlice";

const durations: {name: string; time:number;}[] = [
    { name: '1 min', time: 60_000 },
    { name: '3 min', time: 180_000 },
    { name: '5 min', time: 300_000 },
    { name: '10 min', time: 600_000 },
    { name: '15 min', time: 900_000 },
    { name: '30 min', time: 1_800_000 },
	{name: '1 hrs', time: 3_600_000}
];

const increments: {name: string; time:number;}[] = [
	{name :'2 sec', time: 2_000},
	{name: '5 sec', time: 5_000}
];

export default function Selector() {

	const [increment, setIncrement] = useState<boolean>(false);
	const [incrementIndex, setIncrementIndex] = useState<number>(0);

    const { colors } = useColorScheme();
    const dispatch = useAppDispatch();

    const { soundEnabled, vibrationEnabled } = useAppSelector(
        (state) => state.preference,
    );

    const goToGame = (d: Date) => {
		const params: { timer: string; increment?: string } = { timer: d.getTime().toString() };
		if(increment){
			params.increment = new Date(increments[incrementIndex].time).toString();
		}
        router.push({ pathname: '/', params });
    };

    const updatePreference = async (key: 'soundEnabled' | 'vibrationEnabled', value: boolean) => {
        if (key === 'soundEnabled') {
            dispatch(setSoundEnabled(value));
        } else {
            dispatch(setVibrationEnabled(value));
        }
        dispatch(saveSettings(
            key === 'soundEnabled' ? value : soundEnabled,
            key === 'vibrationEnabled' ? value : vibrationEnabled,
        ));
    };

    useEffect(() => {
        dispatch(loadSettings());
    }, [dispatch]);

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Cadances
          </Text>
          <View style={styles.timeControlsGrid}>
            {durations.map((control) => (
              <Button
                mode="contained"
                style={styles.timeControlButton}
                onPress={() => goToGame(new Date(control.time))}
                key={control.time.toString()}
              >
                <Text style={{ color: colors.text }}>{control.name}</Text>
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Incréments
          </Text>
          <View style={styles.preference}>
            <Text style={[styles.preferenceText, { color: colors.text }]}>
              Incrément
            </Text>
            <Switch
              value={increment}
              color={colors.notification}
              onValueChange={(value) => setIncrement(value)}
            />
          </View>
          {increment && (<View style={styles.timeControlsGrid}>
            {increments.map((control, index) => (
              <Button
                mode={incrementIndex === index ? "contained": "outlined"} 
                style={styles.timeControlButton}
                onPress={()=>setIncrementIndex(index)}
                key={control.time.toString()}
              >
                <Text style={{ color: colors.text }}>{control.name}</Text>
              </Button>
            ))}
          </View>)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>
          <View style={styles.preference}>
            <Text style={[styles.preferenceText, { color: colors.text }]}>
              Sound Effects
            </Text>
            <Switch
              value={soundEnabled}
              color={colors.notification}
              onValueChange={(value) => updatePreference("soundEnabled", value)}
            />
          </View>
          <View style={styles.preference}>
            <Text style={[styles.preferenceText, { color: colors.text }]}>
              Vibration
            </Text>
            <Switch
              value={vibrationEnabled}
              color={colors.notification}
              onValueChange={(value) =>
                updatePreference("vibrationEnabled", value)
              }
            />
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    timeControlsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    timeControlButton: {
        borderRadius: 8,
        alignItems: 'center',
    },
    timeControlText: {
        fontSize: 16,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    preferenceText: {
        fontSize: 16,
    },
});