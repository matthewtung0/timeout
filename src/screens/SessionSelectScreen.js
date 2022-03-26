import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import CategoryButton from '../components/CategoryButton';
import { Context as CategoryContext } from '../context/CategoryContext';
import { getUnixTime, fromUnixTime } from 'date-fns';
import Modal from 'react-native-modal'
import ToDoSelector from '../components/ToDoSelector';

const SessionSelectScreen = ({ navigation: { navigate } }) => {
    const [time, setTime] = useState(0);
    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });
    //const { state, fetchSelf } = useContext(UserContext)
    const { state: categoryState, setChosen, setActivityName, setStartTime } = useContext(CategoryContext)
    const [customActivity, setCustomActivity] = useState('')
    const [catId, setCatId] = useState(3)
    const [catName, setCatName] = useState('unsorted')

    const [modalVisible, setModalVisible] = useState(false)

    const updateTime = (a) => {
        setTime(a);
    }

    const clearInputs = () => {
        setSelectedButton({ buttonName: 'unsorted', buttonId: 3 })
        setCatId(3)
        setCatName('unsorted')
        setTime(0)
        setCustomActivity('')
    }

    // callback from manually selecting category button
    const updateButton = (button) => {
        setCatId(button.buttonId)
        setCatName(button.buttonName)
        setSelectedButton(button);
        setChosen(button)
    }

    const circularRef = useRef()

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    // callback from modal selection
    const fillInWithItem = (returned_info) => {
        const { item_desc, cat_id, item_id, cat_name } = returned_info
        setCustomActivity(item_desc)
        setCatId(cat_id)
        setCatName(cat_name)

        // for context uses, might delete later
        setActivityName(item_desc)
        setChosen({ buttonName: cat_name, buttonId: cat_id })
    }

    return (
        <View style={styles.viewContainer}>

            <View>
                <Modal isVisible={modalVisible}
                    animationIn='slideInLeft'
                    animationOut='slideOutLeft'>
                    <ToDoSelector
                        toggleFunction={toggleModal}
                        todoItems={categoryState.userTodoItems}
                        callback={fillInWithItem} />
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
                        <View style={{
                            backgroundColor: (catId == item.category_id ? 'red' : 'white'),
                            padding: 5, borderRadius: 10,
                        }}>
                            <CategoryButton
                                id={item.category_id}
                                catName={item.category_name}
                                bgColor="#FDD696"
                                callback={updateButton} />
                        </View>
                    )
                }}

                ListFooterComponent={() =>
                    <Button title="Start"
                        onPress={() => {
                            let now_dt = getUnixTime(new Date())
                            setStartTime(fromUnixTime(now_dt))
                            let cat_Name = catName
                            let cat_Id = catId
                            let timer_Time = time

                            clearInputs()
                            circularRef.current.resetSlider()

                            navigate('SessionOngoing', {
                                numMins: timer_Time,
                                categoryId: cat_Id,
                                categoryName: cat_Name,
                                startTime: now_dt
                            })
                        }
                        }></Button>
                }

            >
            </FlatList>

            <View style={styles.modalContainer}>
                <View style={styles.modalDummy} />

                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={toggleModal}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
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
        margin: 20,
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
    modal: {
        borderRadius: 10,
    },
    modalButton: {
        width: 40,
        height: 40,
        backgroundColor: 'green',
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        height: '100%',
        position: 'absolute',
    },
    modalDummy: {
        flex: 0.35,
    },
})

export default SessionSelectScreen;