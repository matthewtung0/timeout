import React, { useRef, useState } from 'react';
import {
    View, StyleSheet, Text, Button, FlatList, Dimensions,
    TouchableOpacity
} from 'react-native';

const ColorSelectModal = ({ toggleFunction, colorArr, categoryArr, callback }) => {
    const { height, width } = Dimensions.get('window');
    const [editItem, setEditItem] = useState(null)

    return (
        <View style={styles.container}>
            < FlatList
                data={colorArr}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => {
                    return (
                        < >
                            <TouchableOpacity
                                style={[styles.colorSquare, { backgroundColor: item[1] }]}
                                onPress={() => {
                                    var chosenColorId = item[0]
                                    callback(chosenColorId)
                                    toggleFunction();

                                }}
                            />
                        </>
                    )
                }}
            >
            </FlatList>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignContent: 'center'
    }, colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginVertical: 20,
    },
})

export default ColorSelectModal;