import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThunk } from '../store';

interface PreferencesState {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
}

const initialState: PreferencesState = {
    soundEnabled: true,
    vibrationEnabled: true,
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setSoundEnabled: (state: PreferencesState, action: PayloadAction<boolean>) => {
            console.log('setSoundEnabled', action.payload);
            state.soundEnabled = action.payload;
        },
        setVibrationEnabled: (state: PreferencesState, action: PayloadAction<boolean>) => {
            state.vibrationEnabled = action.payload;
        },
        reset(state: PreferencesState) {
            state.soundEnabled = initialState.soundEnabled;
            state.vibrationEnabled = initialState.vibrationEnabled;
        },
    },
});

export const {
    setSoundEnabled,
    setVibrationEnabled,
    reset,
} = preferencesSlice.actions;

// Thunks
export const loadSettings = (): AppThunk => async (dispatch) => {
    console.log('loadSettings ...');
    try {
        const preferences = await AsyncStorage.getItem('chess_clock_preferences');

        if (preferences) {
            const { soundEnabled, vibrationEnabled } = JSON.parse(preferences);
            dispatch(setSoundEnabled(soundEnabled));
            dispatch(setVibrationEnabled(vibrationEnabled));
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
};

export const saveSettings = (
    soundEnabled: boolean,
    vibrationEnabled: boolean,
): AppThunk => async () => {
    console.log('saveSettings ...');
    try {
        await AsyncStorage.setItem(
            'chess_clock_preferences',
            JSON.stringify({ soundEnabled, vibrationEnabled }),
        );
    } catch (error) {
        console.error('Error saving settings:', error);
    }
};

export default preferencesSlice.reducer;