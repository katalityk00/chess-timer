import { FlatList, StyleSheet } from "react-native";
import { Button, RadioButton, Switch, Text } from 'react-native-paper';
import { View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import React from "react";

type Duration = {
    name: string; time: number;
};

type IncrementMode = 'Fisher' | 'Bronstein' | 'US delay';

type GoToGame = (duration: number) => void;
type GameParams = {timer: string; increment?: {mode: IncrementMode; timer: string;}};
const durations:  Duration[]= [
    // Blitz
    { name: '3 min', time: 3 * 60 * 1000 },
    { name: '5 min', time: 5 * 60 * 1000 },
    
    // Rapide
    { name: '10 min', time: 10 * 60 * 1000 },
    { name: '15 min', time: 15 * 60 * 1000 },
    { name: '20 min', time: 20 * 60 * 1000 },
    { name: '30 min', time: 30 * 60 * 1000 },
    
    // Classique
    { name: '45 min', time: 45 * 60 * 1000 },
    { name: '1h', time: 60 * 60 * 1000 },
    { name: '90 min', time: 90 * 60 * 1000 },
];
const increments: Duration[] = [
    { name: '+1s', time: 1000 },
    { name: '+2s', time: 2000 },
    { name: '+3s', time: 3000 },
    { name: '+5s', time: 5000 },
    { name: '+10s', time: 10000 },
];

const incrementModes:[IncrementMode,IncrementMode,IncrementMode] = ['Fisher', 'Bronstein', 'US delay'];

export default function Cadances() {
    const { colors } = useColorScheme();
    const [hadIncrement, setHadIncrement] = useState<boolean>(false);
    const [incrementIndex, setIncrementIndex] = useState<number | null>(null);
    const [selectedMode, setSelectedMode] = useState<IncrementMode>('Fisher');
    const goToGame: GoToGame = (duration) => {
        const params:GameParams = { timer: new Date(duration).toString() };
        if(incrementIndex !==  null) params.increment= {timer: new Date(increments[incrementIndex].time).toString(), mode: 'Fisher'};
        router.push({ 
            pathname: '/',
            params: {
                timer: params.timer,
                increment: params.increment ? JSON.stringify(params.increment) : undefined
            }
        });
    }

    const handleSwitchIncrement = (v:boolean) => {
        setHadIncrement(v);
    }

    useEffect(() => {
        setIncrementIndex(null);
    }, [hadIncrement]);


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList 
                style={styles.durationList}
                scrollEnabled={false}
                data={durations}
                renderItem={({ item }) => (
                    <Button
                        mode={"contained"}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        onPress={() => {goToGame(item.time)}}
                    >
                        <Text style={{color: colors.text}}>{item.name}</Text>
                    </Button>
                )}
                columnWrapperStyle={styles.row}
                numColumns={2}
                ItemSeparatorComponent={() => <View style={{ margin: 8 }} />}
                />
            <View style={[styles.incrementSection, { backgroundColor: colors.card }]}>
                <View style={styles.incrementHeader}>
                    <Text style={{color: colors.text, fontSize: 18}}>Incrément</Text>
                    <Switch value={hadIncrement} onValueChange={handleSwitchIncrement}/>
                </View>
                
                {hadIncrement && (
                    <>
                        <RadioButton.Group onValueChange={value => setSelectedMode(value as IncrementMode)} value={selectedMode}>
                            <View style={styles.radioGroup}>
                                {incrementModes.map((mode, index, arr) => (
                                   <RadioButton.Item key={mode} labelStyle={{color: mode === arr[index] ? colors.primary : colors.text}} label={mode} value={mode}/>
                                ))}
                            </View>
                        </RadioButton.Group>
                        <FlatList
                            data={increments}
                            renderItem={({ item, index }) => (
                                <Button 
                                    mode={incrementIndex !== index? "contained" : "outlined"}
                                    style={styles.incrementButton}
                                    contentStyle={styles.buttonContent}
                                    onPress={() => setIncrementIndex(index)}
                                >
                                    <Text style={{color: colors.text}}>{item.name}</Text>
                                </Button>
                            )}
                            numColumns={3}
                            columnWrapperStyle={styles.row}
                            ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
                        />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 5,
    },

    durationList: {
        flexGrow: 0, // Empêche la liste de prendre tout l'espace disponible
    },
    row: {
        justifyContent: 'space-around',
    },
    button: {
        flex: 0.48,
        minHeight: 50,
    },
    buttonContent: {
        height: 50,
        justifyContent: 'center',
    },
    incrementSection: {
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 20,
    },
    incrementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    incrementButton: {
        flex: 0.3,
        minHeight: 40,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});