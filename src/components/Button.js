import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';

const Button = ({ onPressFunction, buttonText }) => {
    return (
        <TouchableOpacity onPress={onPressFunction}
            style={styles.boxStyle}
        >
            <Text style={styles.textStyle}>{buttonText}</Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    boxStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    textStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'

    },

})

export default Button;
