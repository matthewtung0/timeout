import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert,
    Keyboard, TouchableWithoutFeedback, ActivityIndicator, Platform, Image,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Text } from 'react-native-elements';
import Modal from 'react-native-modal'
import uuid from 'uuid-random'
import { Context as SessionContext } from '../context/SessionContext';
import { addMinutes, subMinutes, compareAsc, format, endOfMonth, startOfMonth } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import EditSessionTimeModal from '../components/EditSessionTimeModal';
const constants = require('../components/constants.json')
const bg_bottom = require('../../assets/border.png')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SessionBackfillScreen = ({ navigation, route: { params } }) => {
    const { width, height } = Dimensions.get('window');

    const { numMins, categoryId, categoryName, activityName, colorId } = params;
    let bgColorHex = constants.colors[colorId]
    const { saveSession, fetchMultipleMonths } = useContext(SessionContext)
    const [numMins_, setNumMins_] = useState(numMins)
    const [date, setDate] = useState(subMinutes(new Date(), numMins_));
    const [time, setTime] = useState(new Date())
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [sessionObjFinal, setSessionObjFinal] = useState({
        activity_id: uuid(),
        chosenCategory: categoryName,
        cat_id: categoryId,
        activity_name: activityName,
        end_early: false,
        plannedMin: numMins_,
        prod_rating: -1,
        time_start: date,
        time_end: addMinutes(date, numMins_),
        is_private: false,
    })
    //console.log(sessionObjFinal)
    const toggleModal = () => { setModalVisible(!modalVisible); }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        console.log(`changing date: ${currentDate}`)
        setDate(currentDate);

        setSessionObjFinal({
            ...sessionObjFinal,
            time_start: currentDate,
            time_end: addMinutes(currentDate, numMins_),
        })
    };

    const onChangeTime = (event, selectedTime) => {
        // android only
        const currentTime = selectedTime;
        setShow(false);
        console.log(`Setting current time: ${currentTime}`)


        var curHour = format(currentTime, 'HH')
        console.log(`curHour: ${curHour}`)
        var curMin = format(currentTime, 'mm')
        var curYear = format(date, 'yyyy')
        var curMonth = format(date, 'M')
        var curDay = format(date, 'dd')
        var newDate = new Date(parseInt(curYear), parseInt(curMonth) - 1, parseInt(curDay),
            parseInt(curHour), parseInt(curMin))
        console.log(`NEW DATE: ${newDate}`)

        /*var formattedTime = format(currentTime, 'hh:mm:ss XXX')
        var formattedDate = format(date, 'yyyy-MM-dd')
        var concatDtTime = String(formattedDate) + "T" + String(formattedTime);
        console.log(`concatDtTime: ${concatDtTime}`)
        var newDate = new Date(Date.parse(concatDtTime))
        console.log("new date is ", newDate)
        console.log("NOW IS ", new Date(Date.parse(new Date())))*/
        setTime(currentTime);
        setDate(newDate);
        setSessionObjFinal({
            ...sessionObjFinal,
            time_start: newDate,
            time_end: addMinutes(newDate, numMins_),
        })
    };

    const showDatePickerAndroid = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onChangeDate,
            maximumDate: new Date(),
            mode: "date",
            is24Hour: true,
        });
    }

    const showTimePickerAndroid = () => {
        DateTimePickerAndroid.open({
            value: time,
            minuteInterval: 5,
            onChange: onChangeTime,
            maximumDate: new Date(),
            display: 'default',
            mode: 'time',
            is24Hour: true,
        });
    }

    const modalCallback = (new_min, new_hour) => {
        console.log(`new min: ${new_min} and new_hour ${new_hour}`)
        var new_numMin = parseInt(new_min) + parseInt(new_hour) * 60;
        setNumMins_(new_numMin)
        var earliest_possible_start = subMinutes(new Date(), numMins_)
        /*if (compareAsc(date, earliest_possible_start) > 0) {
            setDate(earliest_possible_start)
            setSessionObjFinal({
                ...sessionObjFinal,
                plannedMin: new_numMin,
                time_start: earliest_possible_start,
                time_end: addMinutes(earliest_possible_start, new_numMin),
            })
        } else {
            setSessionObjFinal({
                ...sessionObjFinal,
                plannedMin: new_numMin,
                time_start: date,
                time_end: addMinutes(date, new_numMin),
            })
        }*/

        setSessionObjFinal({
            ...sessionObjFinal,
            plannedMin: new_numMin,
            time_start: date,
            time_end: addMinutes(date, new_numMin),
        })

    }

    const saveSessionErrorCallback = () => {
        setIsLoading(false);
    }
    const saveSession_callback = async () => {
        console.log("sessionStartTime is ", sessionObjFinal.time_start);
        var endTime = endOfMonth(sessionObjFinal.time_start)
        var startTime = startOfMonth(sessionObjFinal.time_start)
        try {
            await fetchMultipleMonths(startTime, endTime)
        } catch (err) {
            console.log("Problem fetching months")
            setIsLoading(false);
            return
        }

        alert("Task successfully saved")
        navigation.navigate('SessionSelect')
    }

    return (
        <View style={{ marginHorizontal: 20, flex: 1, }}>

            <Modal isVisible={modalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{ height: height * 0.4 }}>
                        <EditSessionTimeModal
                            toggleFunction={toggleModal}
                            activityName={activityName}
                            numMins={numMins_}
                            callback={modalCallback}
                        />
                    </View></View>
            </Modal>


            <View style={{
                position: 'absolute', flex: 1, width: '100%', height: '100%',
                justifyContent: 'flex-end',
            }}>
                <Image
                    source={bg_bottom}
                    style={{ width: '100%', height: 50, }}
                    resizeMode="cover"
                />
            </View>


            <View style={{ padding: 20, paddingTop: 40, }}>
                <View style={{
                    height: 70, marginTop: 50, borderRadius: 20,
                    backgroundColor: 'white', shadowOffset: { width: 0.1, height: 0.1, },
                    shadowOpacity: 0.05,
                }}>
                    <View style={styles.activityContainer}>
                        <View style={{ flex: 3, alignContent: 'center', marginHorizontal: 10, }}>
                            <Text style={[styles.textDefaultBold, styles.activityName]}>{activityName}</Text>
                        </View>

                        <View style={[styles.categoryStyle, { backgroundColor: bgColorHex, }]}>
                            <Text style={[styles.textDefaultBold, styles.categoryText,
                            { color: 'white', }]}>{categoryName}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>

                <Text style={[styles.textDefaultSemiBold, {
                    fontSize: 30, marginHorizontal: 5,
                    paddingVertical: 10, color: '#67806D'
                }]}>
                    {Math.floor(numMins_ / 60)} h  </Text>
                <Text style={[styles.textDefaultSemiBold, {
                    fontSize: 30, marginRight: 5,
                    paddingVertical: 10, color: '#67806D'
                }]}>
                    {numMins_ % 60} min  </Text>
                <TouchableOpacity
                    style={{ borderWidth: 0, marginHorizontal: 5, paddingHorizontal: 5, paddingVertical: 10, }}
                    onPress={toggleModal}>
                    <Icon
                        name="pencil-outline"
                        type='ionicon'
                        size={20}
                        color='#67806D' />
                </TouchableOpacity>


            </View>

            {/*<Text>{colorId}</Text>*/}

            <View style={{ marginHorizontal: 10, marginTop: 30, }}>
                <Text style={[styles.textDefaultMed, { color: 'grey', fontSize: 18, }]}>
                    What time did you start?</Text>
                <View style={{ alignItems: 'center', }}>
                    {Platform.OS === 'android' ?
                        <>
                            <View style={{
                                flexDirection: 'row', marginVertical: 10, borderWidth: 0,
                                justifyContent: 'center', alignItems: 'center',
                            }}>
                                <View style={{ flex: 2, }}>
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1, justifyContent: 'center', alignItems: 'center',
                                            borderRadius: 5, borderColor: '#CAE3B7', backgroundColor: '#CAE3B7'
                                        }}
                                        onPress={showDatePickerAndroid}>
                                        <Text style={[styles.textDefault, { paddingVertical: 5, color: 'grey' }]}>Enter Date</Text>

                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1 }} />
                                <View style={{ flex: 3, }}>
                                    <Text style={[styles.textDefaultSemiBold, {
                                        fontSize: 20, marginRight: 5,
                                        paddingVertical: 10, color: '#67806D'
                                    }]}>{format(date, 'ccc MMM/d/yyyy')}</Text>
                                </View>

                            </View>
                            <View style={{
                                flexDirection: 'row', borderWidth: 0,
                                justifyContent: 'center', alignItems: 'center',
                            }}>
                                <View style={{ flex: 2, }}>
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1, justifyContent: 'center', alignItems: 'center',
                                            borderRadius: 5, borderColor: '#CAE3B7', backgroundColor: '#CAE3B7'
                                        }}
                                        onPress={showTimePickerAndroid}>
                                        <Text style={[styles.textDefault, { paddingVertical: 5, color: 'grey' }]}>Enter Time</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 1, }}>

                                </View>
                                <View style={{ flex: 3, }}>
                                    <Text style={[styles.textDefaultSemiBold, {
                                        fontSize: 20, marginRight: 5,
                                        paddingVertical: 10, color: '#67806D'
                                    }]}>{format(date, 'h:mm aaa')}</Text>
                                </View>

                            </View>
                        </>


                        :
                        <>
                            <DateTimePicker
                                //maximumDate={subMinutes(new Date(), numMins_)}
                                maximumDate={new Date()}
                                display="spinner"
                                testID="dateTimePicker"
                                minuteInterval={5}
                                value={date}
                                mode='datetime'
                                is24Hour={true}
                                onChange={onChangeDate}
                                themeVariant="light"
                            />
                        </>
                    }
                </View>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#90AB72' }]}
                onPress={() => {

                    if (!isLoading) {
                        setIsLoading(true)
                        saveSession(sessionObjFinal, saveSession_callback, saveSessionErrorCallback, false)
                    }
                }}>
                <Text style={[styles.textDefaultBold, styles.buttonText, { fontSize: 18, }]}>Submit Task</Text>
            </TouchableOpacity>

            {/*<Text>{date.toLocaleDateString()}</Text>*/}


            <TouchableOpacity
                style={[styles.backButton, { marginTop: Platform.OS === 'ios' ? 40 : 30 }]}
                onPress={() => { navigation.navigate('mainFlow') }}>
                <Icon
                    name='arrow-back-outline'
                    type='ionicon'
                    size={35}
                    color={'#67806D'} />
            </TouchableOpacity>
        </View>


    )
}

SessionBackfillScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    backButton: {
        position: 'absolute',
        width: 50, height: 50,
        marginLeft: 5,
    },
    activityName: {
        color: '#67806D',
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 5,
    },
    title: {
        margin: 20,
        fontSize: 25,
    }, container: {
        flex: 1,
        margin: 10,
        borderWidth: 0,
        borderColor: 'green'
    },
    viewContainer: {
        //marginTop: 55,
        flex: 1
    },
    activityContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'center',
    },
    input: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 17,
        paddingVertical: 10,
        //shadowOffset: { width: 0.05, height: 0.05, },
        //shadowOpacity: 0.05,
        color: 'gray',
        fontSize: 17,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    categoryStyle: {
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 12,
        alignSelf: 'center',
        alignItems: 'center',
    },
    modal: {
        borderRadius: 10,
    },
    modalButton: {
        width: 40,
        height: 40,
        backgroundColor: '#ABC57E',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButtonText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        height: '100%',
        position: 'absolute',
    },

    // decides how high up the modal tab is
    modalDummy: {
        flex: 0.2,
    },
    clockBackground: {
    },
    start: {
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
        shadowOffset: {
            width: 0.2,
            height: 0.2,
        },
        shadowOpacity: 0.1,

    },
    startText: {
        color: 'white',
        fontFamily: 'Inter-Regular',
        fontSize: 25,
        fontWeight: 'bold'
    },
    button: {
        padding: 10,
        margin: 25,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0.1,
            height: 0.1,
        },
        shadowOpacity: 0.1,
    }, buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
    },
})

export default SessionBackfillScreen;