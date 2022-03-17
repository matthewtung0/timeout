import React, { useCallback, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import CategoryButton from '../components/CategoryButton';
import { Context as CategoryContext } from '../context/CategoryContext';
import { getUnixTime, fromUnixTime } from 'date-fns';


import timeoutApi from '../api/timeout';

const SessionSelectScreen = ({ navigation }) => {
    const [time, setTime] = useState(0);
    const [selectedButton, setSelectedButton] = useState({ buttonName: 'asdf', buttonId: -1 });
    //const { state, fetchSelf } = useContext(UserContext)
    const { state: categoryState, fetchUserCategories, setChosen, setActivityName, setStartTime } = useContext(CategoryContext)
    const [tempCatState, setTempCatState] = useState('')
    const [customActivity, setCustomActivity] = useState('')

    const updateTime = (a) => {
        setTime(a);
    }

    const updateButton = (button) => {
        setSelectedButton(button);
        setChosen(button)
    }

    // TEMPORARY FETCH FUNCTION IS PUT HERE TO GET USEEFFECT() TO WORK ...
    const testFetch = useCallback(async () => {
        const response = await timeoutApi.get('/categories')
        setTempCatState(response.data)
        console.log("Test fetch category called");
    }, [])

    useEffect(() => {
        testFetch()
            .catch(console.error)

    }, [])

    const handleStart = () => {
        console.log("handling chosen..");
        navigation.navigate('SessionOngoing', {
            timerTime: time,
            buttonId: selectedButton.buttonId,
            buttonName: selectedButton.buttonName,
            startTime: getUnixTime(new Date())
        })
    }
    return (
        <View style={styles.viewContainer}>

            {/*<NavigationEvents onWillFocus={fetchUserCategories} />*/}


            <Text style={styles.title}>Session Select Screen</Text>




            <CircularSelector updateCallback={updateTime} />
            <TextInput
                style={styles.input}
                placeholder="Activity"
                autoCorrect={false}
                value={customActivity}
                onChangeText={(text) => {
                    setCustomActivity(text)
                    setActivityName(text)
                }
                }
            />
            <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between', flex: 1, marginVertical: 5, marginHorizontal: 10 }}
                style
                horizontal={false}
                data={tempCatState}
                numColumns='3'
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.category_id}
                renderItem={({ item }) => {
                    return (
                        <CategoryButton
                            id='1'
                            catName={item.category_name}
                            bgColor="#FDD696"
                            callback={updateButton} />
                    )
                }}

                ListFooterComponent={() =>
                    <Button title="Start"
                        onPress={() => {
                            let now_dt = getUnixTime(new Date())
                            setStartTime(fromUnixTime(now_dt))
                            navigation.navigate('SessionOngoing', {
                                timerTime: time,
                                buttonId: selectedButton.buttonId,
                                buttonName: selectedButton.buttonName,
                                startTime: now_dt
                            })
                        }
                        }></Button>
                }

            >
            </FlatList>
            {/*<ScrollView>

                <Input
                    placeholder="Activity"
                    autoCorrect={false}
                    value={customActivity}
                    onChangeText={setCustomActivity}
                />

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
                    <View style={{
                        backgroundColor: (selectedButton.buttonId == '1' ? 'red' : 'white'),
                        padding: 5, borderRadius: 10,
                    }}>
                        <CategoryButton id='1' catName="Work" bgColor="#FDD696" callback={updateButton}></CategoryButton>
                    </View >
                    <View style={{
                        backgroundColor: (selectedButton.buttonId == '2' ? 'red' : 'white'),
                        padding: 5, borderRadius: 10,
                    }}>
                        <CategoryButton id='2' catName="Study" bgColor="#CAE3B7" callback={updateButton}></CategoryButton></View>
                    <View style={{
                        backgroundColor: (selectedButton.buttonId == '3' ? 'red' : 'white'),
                        padding: 5, borderRadius: 10,
                    }}>
                        <CategoryButton id='3' catName="Unsorted" bgColor="#BC9869" callback={updateButton}></CategoryButton></View>


                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 6 }}>
                    <View style={{
                        backgroundColor: (selectedButton.buttonId == '4' ? 'red' : 'white'),
                        padding: 5, borderRadius: 10,
                    }}>
                        <CategoryButton id='4' catName="Work" bgColor="#C4BFDF" callback={updateButton}></CategoryButton></View>
                    <View style={{
                        backgroundColor: (selectedButton.buttonId == '5' ? 'red' : 'white'),
                        padding: 5, borderRadius: 10,
                    }}>
                        <CategoryButton id='5' catName="Study" bgColor="#C3E6E7" callback={updateButton}></CategoryButton></View>
                    <View style={{
                        backgroundColor: (selectedButton.buttonId == '6' ? 'red' : 'white'),
                        padding: 5, borderRadius: 10,
                    }}>
                        <CategoryButton id='6' catName="Exercise" bgColor="#F5BBAE" callback={updateButton}></CategoryButton></View>

                </View>

                <Button title="Start"
                    onPress={() => navigation.navigate('SessionOngoing', {
                        timerTime: time,
                        buttonId: selectedButton.buttonId,
                        buttonName: selectedButton.buttonName,
                    })}></Button>
                </ScrollView>*/}
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
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

})

export default SessionSelectScreen;