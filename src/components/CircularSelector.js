import React, { useRef, useState, Component } from 'react';
import { Animated, View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, {
    Circle,
    Path,
} from 'react-native-svg';
import { Text } from 'react-native-svg';

const CircularSelector = ({ updateCallback }) => {
    const { height, width } = Dimensions.get('window');
    const timer_radius_pct = 0.4 // fraction of screen that the radius takes
    const picked_width = 230
    const radius = (width * timer_radius_pct) * 100 / width // ex. 40 for 0.4 timer_radius_pct
    const [st, setSt] = useState({ cx: width / 2, cy: height / 2 });
    const [theta, setTheta] = useState(0);

    const [time, setTime] = useState(0)
    const [formattedTime, setFormattedTime] = useState('00:00');

    const maxTime = 60;
    const [pathToPtX, setPathToPtX] = useState(50)
    const [pathToPtY, setPathToPtY] = useState(10)
    const [curQuadrant, setCurQuadrant] = useState('')

    const polarToTime = (angle) => {
        let mins = Math.round((angle / 360) * maxTime)
        setTime(mins)
        updateCallback(mins)

        let formatted_mins = mins.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        return formatted_mins + ":00"

    }

    const cartesianToPolar = (x, y) => {
        let x_mid = picked_width / 2;
        let hor_side = x - x_mid
        let ver_side = x_mid - y
        let theta = 0;
        let deltaX = 0;
        let deltaY = 0;
        if (hor_side >= 0 && ver_side >= 0) { // quadrant I
            theta = 90 - Math.atan(ver_side / hor_side) / Math.PI * 180;


            let theta_rad = theta * Math.PI / 180
            deltaX = Math.sin(theta_rad) * radius + 50
            deltaY = 50 - Math.cos(theta_rad) * radius
            setCurQuadrant('I')

        } else if (hor_side >= 0 && ver_side < 0) { // quadrant II
            theta = 90 + Math.atan(-ver_side / hor_side) / Math.PI * 180

            let theta_rad = (theta - 90) * Math.PI / 180
            deltaX = Math.cos(theta_rad) * radius + 50
            deltaY = 50 + Math.sin(theta_rad) * radius
            setCurQuadrant('II')
        } else if (hor_side < 0 && ver_side < 0) { // quadrant III
            theta = 270 - Math.atan(-ver_side / -hor_side) / Math.PI * 180

            let theta_rad = (theta - 180) * Math.PI / 180
            deltaX = 50 - Math.sin(theta_rad) * radius
            deltaY = 50 + Math.cos(theta_rad) * radius
            setCurQuadrant('III')
        } else { // quadrant IV
            theta = 270 + Math.atan(ver_side / -hor_side) / Math.PI * 180

            let theta_rad = (theta - 270) * Math.PI / 180
            deltaX = 50 - Math.cos(theta_rad) * radius
            deltaY = 50 - Math.sin(theta_rad) * radius
            setCurQuadrant('IV')
        }
        setTheta(theta);
        setFormattedTime(polarToTime(theta))
        setPathToPtX(deltaX)
        setPathToPtY(deltaY)
        //return theta
    }

    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            /*onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value
                });
            },*/
            onPanResponderMove: (event, gestureState) => {
                let x_set = event.nativeEvent.locationX.toFixed(2)
                let y_set = event.nativeEvent.locationY.toFixed(2)
                setSt({ cx: x_set, cy: y_set })
                cartesianToPolar(x_set, y_set)
            },
            /*onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false }
            ),*/
            onPanResponderRelease: (event, gestureState) => {
                //console.log("x set is ", x_set);
                //pan.flattenOffset();
            }
        })
    ).current;

    //cut views

    /*<Text>{"phone x is " + width}</Text>
            <Text>{"phone y is " + height}</Text>
            <Text>{"x position is " + st.cx}</Text>
            <Text>{"y position is " + st.cy}</Text>
            <Text>{"Theta angle is " + theta}</Text>
            <Text>{"path end X is " + pathToPtX}</Text>
            <Text>{"path end Y is " + pathToPtY}</Text>*/

    return (
        <View style={styles.container}>
            <Animated.View style={styles.wrappedView}
                {...panResponder.panHandlers}
            >
                <Svg style={styles.svgStyle}
                    height="100%" width="100%" viewBox={`0 0 100 100`}>
                    <Circle cx="50" cy="50" r={radius} stroke="blue" fill="none" strokeWidth="1"></Circle>
                    <Path stroke="red" strokeWidth="2" fill="none"
                        //d={`M50 10 A${radius} ${radius} 0 0 1 ${pathToPtX} ${pathToPtY}`}
                        d={`M50 ${50 - radius} A${radius} ${radius} 0 ${theta > 180 ? 1 : 0} 1 ${pathToPtX} ${pathToPtY}`}
                    />

                    <Text x={50} y={55} fontSize={20} textAnchor="middle" fill="black">{formattedTime}</Text>
                </Svg>

            </Animated.View>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: 5,
    },
    wrappedView: {
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'green',
        width: 230,
    },
    svgStyle: {
        borderWidth: 1,
        borderColor: 'red',
        flex: 1,
    },
    titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "bold"
    },

});

export default CircularSelector;