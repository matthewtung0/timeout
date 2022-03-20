import React, { useCallback, useState, useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import CategoryButton from '../components/CategoryButton';
import { Context as CategoryContext } from '../context/CategoryContext';
import { getUnixTime, fromUnixTime } from 'date-fns';
import Modal from 'react-native-modal'
import ToDoSelector from '../components/ToDoSelector';
import timeoutApi from '../api/timeout';

const SessionSelectScreen = ({ navigation }) => {
    const [time, setTime] = useState(0);
    const [selectedButton, setSelectedButton] = useState({ buttonName: 'asdf', buttonId: -1 });
    //const { state, fetchSelf } = useContext(UserContext)
    const { state: categoryState, fetchUserCategories, setChosen, setActivityName, setStartTime } = useContext(CategoryContext)
    //const [tempCatState, setTempCatState] = useState('')
    const [customActivity, setCustomActivity] = useState('')

    const [modalVisible, setModalVisible] = useState(false)

    const updateTime = (a) => {
        setTime(a);
    }

    const clearInputs = () => {
        setSelectedButton({ buttonName: 'asdf', buttonId: -1 })
        setTime(0)
        setCustomActivity('')
    }

    const updateButton = (button) => {
        setSelectedButton(button);
        setChosen(button)
    }

    // TEMPORARY FETCH FUNCTION IS PUT HERE TO GET USEEFFECT() TO WORK ...
    /*const testFetch = useCallback(async () => {
        const response = await timeoutApi.get('/categories')
        setTempCatState(response.data)
        console.log("Test fetch category called");
    }, [])

    useEffect(() => {
        testFetch()
            .catch(console.error)

    }, [])*/

    const circularRef = useRef()
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    return (
        <View style={styles.viewContainer}>

            <View>
                <Modal isVisible={modalVisible}
                    animationIn='slideInLeft'
                    animationOut='slideOutLeft'>
                    <ToDoSelector
                        toggleFunction={toggleModal} />
                </Modal>
            </View>
            <Text style={styles.title}>Session Select Screen</Text>

            <CircularSelector
                minSet={0}
                updateCallback={updateTime}
                ref={circularRef} />

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
            <Button title="Show modal" onPress={toggleModal} />

            <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between', flex: 1, marginVertical: 5, marginHorizontal: 10 }}
                style
                horizontal={false}
                data={categoryState.userCategories}
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

                            clearInputs()
                            circularRef.current.resetSlider()

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