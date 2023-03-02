import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { Context as CounterContext } from '../context/CounterContext';
import { Context as SessionContext } from '../context/SessionContext'
const constants = require('../components/constants.json')
import Modal from 'react-native-modal'
import CounterAddCustomModal from './CounterAddCustomModal';

const CounterComponent = ({ item, addTallyCallback, colorArr,
    setSelectedCounterId, setSelectedColorId,
    setSelectedName, setSelectedCurrentCount, toggleEditCounterModal
}) => {
    const { height, width } = Dimensions.get('window');
    const { setCounterTablesLocked, addTally } = useContext(CounterContext)
    const { setHardReset, } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSubtract, setIsLoadingSubtract] = useState(false);
    const [isLoadingCustom, setIsLoadingCustom] = useState(false);
    const [customNumberModalVisible, setCustomNumberModalVisible] = useState(false);

    const [tempNumber, setTempNumber] = useState(item.point_count)
    const [lifeTimeNumber, setLifeTimeNumber] = useState(item.cur_count);

    const addTallyValidation = async (counter_id, add_by, tempNumber, lifeTimeNumber) => {

        console.log(`Counter id ${counter_id} and cur_tally ${tempNumber} and add_by ${add_by}`)
        if (isLoading || isLoadingSubtract) return;
        if ((parseInt(tempNumber) + parseInt(add_by)) < 0) {
            alert("Can't decrease any more!")
        } else {
            if (add_by > 0) {
                setIsLoading(true)
            } else {
                setIsLoadingSubtract(true)
            }
            // preemptively set the cur_count for smoother UI

            /*setCounterInfo(counterInfo.map(item => {

                if (item.counter_id == counter_id) {
                    return {
                        ...item, cur_count: parseInt(item.cur_count) + parseInt(add_by),
                        point_count: parseInt(item.point_count) + parseInt(add_by),
                    }
                }
                return item;
            }))*/
            setTempNumber(parseInt(tempNumber) + parseInt(add_by))
            setLifeTimeNumber(parseInt(lifeTimeNumber) + parseInt(add_by))

            await setHardReset(true)
            await setCounterTablesLocked(true).then(
                await addTally(counter_id, add_by, addTallyCallback, addTallyRollback)
            )

            setIsLoading(false)
            setIsLoadingSubtract(false)
        }
    }

    const addTallyRollback = () => {
        setTempNumber(item.point_count);
    }

    //console.log(`Rendering counter item ${item.activity_name} with color id ${item.color_id}`)

    const addCustomCallback = async (counter_id, add_by,) => {

        if (isLoading || isLoadingSubtract) return;

        if (add_by > 0) {
            setIsLoading(true)
        } else {
            setIsLoadingSubtract(true)
        }
        setTempNumber(parseInt(tempNumber) + parseInt(add_by))
        setLifeTimeNumber(parseInt(lifeTimeNumber) + parseInt(add_by))

        await setHardReset(true)
        await setCounterTablesLocked(true).then(
            await addTally(counter_id, add_by, addTallyCallback, addTallyRollback)
        )
        setIsLoading(false)
        setIsLoadingSubtract(false)
    }

    const toggleAddCustomModal = () => {
        setCustomNumberModalVisible(!customNumberModalVisible)
    }

    return (
        <View
            style={[{ marginBottom: 20, }]}>

            <Modal isVisible={customNumberModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{ height: height * 0.4 }}>
                        <CounterAddCustomModal
                            toggleFunction={toggleAddCustomModal}
                            colorArr={colorArr}
                            selectedColorId={item.color_id}
                            selectedCounterName={item.activity_name}
                            selectedCounterId={item.counter_id}
                            selectedCurrentCount={item.point_count}
                            customIncrementCallback={addCustomCallback}
                        />
                    </View></View>
            </Modal>


            <View style={{ flexDirection: 'row', flex: 1, }}>

                <View style={{
                    flex: 4, borderWidth: 0, borderRadius: 5, marginStart: 5,
                    borderColor: constants.colors[item['color_id']]
                }}>

                    <View style={{
                    }}>

                        <Text style={[styles.categoryText, styles.textDefault, {
                            color: 'black',//constants.colors[item['color_id']],
                            fontSize: 15,
                        }]}>
                            {item['activity_name']}</Text>
                        <Text>
                            <Text style={[styles.categoryText, styles.textDefaultBold,
                            {
                                color: 'black',//constants.colors[item['color_id']],
                                fontSize: 18,
                            }]}>
                                {/*item['point_count']*/}
                                {tempNumber}

                            </Text><Text> today </Text>
                            <Text style={[styles.categoryText, styles.textDefault,
                            {
                                color: 'gray',
                                fontSize: 12,
                            }]}>
                                {/*({item['cur_count']} lifetime)*/}
                                ({lifeTimeNumber} lifetime)
                            </Text>
                        </Text>


                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', }}>
                    {
                        //isLoadingSubtract && selectedCounterId == item.counter_id ?
                        isLoadingSubtract ?
                            <ActivityIndicator
                                style={{ justifyContent: 'center', }}
                                size="large" /> :
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1, alignItems: 'center', borderRadius: 10,
                                    paddingVertical: 5,
                                    backgroundColor: constants.colors[item['color_id']],
                                    height: '100%', borderColor: '#A7BEAD'
                                }}
                                onPress={() => {
                                    setSelectedCounterId(item.counter_id)
                                    //addTallyValidation(item.counter_id, -1, item['point_count'])
                                    addTallyValidation(item.counter_id, -1, tempNumber, lifeTimeNumber)
                                }}>
                                <View style={{ height: '100%', justifyContent: 'center', }}>
                                    <Text style={[styles.textDefaultBold,
                                    { color: '#67806D', fontSize: 16, }]}>-1</Text>
                                </View>

                            </TouchableOpacity>
                    }
                </View>




                <View style={{ flex: 2, justifyContent: 'center', }}>
                    {isLoadingCustom ?//&& selectedCounterId == item.counter_id ?
                        <ActivityIndicator
                            style={{ justifyContent: 'center', }}
                            size="large" /> :
                        <TouchableOpacity
                            style={{
                                borderWidth: 1, alignItems: 'center', borderRadius: 10, marginHorizontal: 5,
                                backgroundColor: constants.colors[item['color_id']], height: '100%',
                                borderColor: '#A7BEAD'

                            }}
                            onPress={() => {
                                //setSelectedCounterId(item['counter_id'])
                                //setSelectedColorId(item['color_id'])
                                //setSelectedName(item['activity_name'])
                                //setSelectedCurrentCount(item['point_count'])


                                //toggleCustomNumberModal()

                                toggleAddCustomModal();
                            }}>
                            <View style={{
                                flexDirection: 'row', flex: 1, alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={[styles.textDefault, { color: '#67806D', fontSize: 13, }]}>custom</Text>
                                </View>
                            </View>


                        </TouchableOpacity>
                    }
                </View>
                <View style={{ flex: 1, justifyContent: 'center', }}>
                    {isLoading ?// && selectedCounterId == item.counter_id ?
                        <ActivityIndicator
                            style={{ justifyContent: 'center', }}
                            size="large" /> :
                        <TouchableOpacity
                            style={{
                                borderWidth: 1, alignItems: 'center', borderRadius: 10,
                                backgroundColor: constants.colors[item['color_id']], height: '100%',
                                paddingVertical: 5,
                                borderColor: '#A7BEAD'
                            }}
                            onPress={() => {
                                setSelectedCounterId(item.counter_id)
                                //addTallyValidation(item.counter_id, 1, item['point_count'])
                                addTallyValidation(item.counter_id, 1, tempNumber, lifeTimeNumber)
                            }}>
                            <View style={{ height: '100%', justifyContent: 'center' }}>
                                <Text style={[styles.textDefaultBold,
                                { color: '#67806D', fontSize: 16, }]}>+1</Text>
                            </View>

                        </TouchableOpacity>
                    }
                </View>

                <View style={{ flex: 1, justifyContent: 'center', }}>
                    <TouchableOpacity
                        style={{ height: '100%', justifyContent: 'center', }}
                        onPress={() => {
                            setSelectedCounterId(item.counter_id)
                            setSelectedColorId(item.color_id)
                            setSelectedName(item.activity_name)
                            toggleEditCounterModal()
                        }

                        }>
                        <Icon name='ellipsis-horizontal' type='ionicon' size={20} color='#A7BEAD' />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{
                height: 2, borderWidth: 1, marginTop: 10,
                //borderColor: constants.colors[item['color_id']]
                borderColor: '#DCDBDB',
            }}>

            </View>
        </View >

    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    title: {
        fontSize: 20,
        marginTop: 70,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 27,
        paddingHorizontal: 17,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    rightIconInput: {
        backgroundColor: 'brown',
    },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginVertical: 20,
    },
    categoryText: {
        marginBottom: 1,
    },
    addCounterButton: {
        margin: 10,
        height: 40,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    addCounterText: {
        fontWeight: '600',
        color: 'white',
        fontSize: 18,
    },
    sortText: {
        textAlign: 'center', fontSize: 12, justifyContent: 'center', color: 'white',
    },
    sortContainer: {
        borderWidth: 1, flex: 1,
        paddingVertical: 7, borderColor: 'white',
    },
    sortContainerSelected: {
        backgroundColor: '#8DC867',
    },

})
//export default ToDoComponent;
/*const equal = (prevItem, nextItem) => {
    return false;
    if (prevItem.item['point_count'] != nextItem.item['point_count'] ||
        prevItem.item['color_id'] != nextItem.item['color_id']
    ) {
        console.log("IS FALSE")
        return false
    }
    console.log("IS TRUE")
    return true;
}*/

export default CounterComponent
//export default React.memo(CounterComponent, equal)