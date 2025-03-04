import { useColorScheme } from "@/hooks/useColorScheme";
import { View, StyleSheet } from "react-native";
import { Text, Switch } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useEffect } from "react";
import { loadSettings, saveSettings, setSoundEnabled, setVibrationEnabled } from "@/store/slices/preferencesSlice";

export default function Preferences() {

    const { colors } = useColorScheme();
    const dispatch = useAppDispatch();

    const { soundEnabled, vibrationEnabled } = useAppSelector(
        (state) => state.preference,
    );
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
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
          <View style={styles.preference}>
            <Text style={[styles.preferenceText, { color: colors.text }]}>
              Effets sonores
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
    row: {
      flex: 1,
      justifyContent: 'space-evenly',
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