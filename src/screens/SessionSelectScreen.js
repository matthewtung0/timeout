import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import CategoryButton from '../components/CategoryButton';

const SessionSelectScreen = ({ navigation }) => {
    const [time, setTime] = useState(0);

    const updateTime = (a) => {
        setTime(a);
    }

    const [customActivity, setCustomActivity] = useState('')

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.title}>Session Select Screen</Text>
            <CircularSelector updateCallback={updateTime} />
            <ScrollView>

                <Input
                    placeholder="Activity"
                    autoCorrect={false}
                    value={customActivity}
                    onChangeText={setCustomActivity}
                />

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
                    <CategoryButton catName="Work" bgColor="blue"></CategoryButton>
                    <CategoryButton catName="Play" bgColor="pink"></CategoryButton>
                    <CategoryButton catName="Health" bgColor="green"></CategoryButton>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
                    <CategoryButton catName="Work" bgColor="blue"></CategoryButton>
                    <CategoryButton catName="Play" bgColor="pink"></CategoryButton>
                    <CategoryButton catName="Health" bgColor="green"></CategoryButton>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
                    <CategoryButton catName="Work" bgColor="blue"></CategoryButton>
                    <CategoryButton catName="Play" bgColor="pink"></CategoryButton>
                    <CategoryButton catName="Health" bgColor="green"></CategoryButton>
                </View>

                <Button title="Start"
                    onPress={() => navigation.navigate('SessionOngoing', { time: time })}></Button>
            </ScrollView>
        </View>
    )
}

SessionSelectScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}
const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 25,
    }, container: {
        flex: 1,
        margin: 10,
        borderWidth: 1,
        borderColor: 'green'
    },
    viewContainer: {
        flexDirection: 'column',
        flex: 1
    }
})

export default SessionSelectScreen;