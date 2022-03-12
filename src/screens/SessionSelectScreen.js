import React, { useRef, useState, Component } from 'react';
import { Animated, View, StyleSheet, Text, PanResponder, Dimensions } from 'react-native';
import Svg, {
    Circle,
    Path,
} from 'react-native-svg';

const SessionSelectScreen = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const radius = 40;
    const [st, setSt] = useState({ cx: width / 2, cy: height / 2 });
    const [theta, setTheta] = useState(0);
    const [pathToPtX, setPathToPtX] = useState(50)
    const [pathToPtY, setPathToPtY] = useState(10)


    const handleMove = ({ nativeEvent: { locationX, locationY } }) => {
        console.log("handling move...");
        console.log("native event is ", nativeEvent);
        setSt({ cx: 0, cy: 0 })
    }

    const cartesianToPolar = (x, y) => {
        let x_mid = width / 2;
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


        } else if (hor_side >= 0 && ver_side < 0) { // quadrant II
            theta = 90 + Math.atan(-ver_side / hor_side) / Math.PI * 180

            let theta_rad = (theta - 90) * Math.PI / 180
            deltaX = Math.cos(theta_rad) * radius + 50
            deltaY = 50 + Math.sin(theta_rad) * radius

        } else if (hor_side < 0 && ver_side < 0) { // quadrant III
            theta = 270 - Math.atan(-ver_side / -hor_side) / Math.PI * 180

            let theta_rad = (theta - 180) * Math.PI / 180
            deltaX = 50 - Math.sin(theta_rad) * radius
            deltaY = 50 + Math.cos(theta_rad) * radius

        } else { // quadrant IV
            theta = 270 + Math.atan(ver_side / -hor_side) / Math.PI * 180

            let theta_rad = (theta - 270) * Math.PI / 180
            deltaX = 50 - Math.cos(theta_rad) * radius
            deltaY = 50 - Math.sin(theta_rad) * radius

        }
        setTheta(theta);
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


    return (
        <View>
            <Text style={styles.title}>Session Select Screen</Text>
            <Text>{"phone x is " + width}</Text>
            <Text>{"phone y is " + height}</Text>
            <Text>{"x position is " + st.cx}</Text>
            <Text>{"y position is " + st.cy}</Text>
            <Text>{"Theta angle is " + theta}</Text>
            <Text>{"path end X is " + pathToPtX}</Text>
            <Text>{"path end Y is " + pathToPtY}</Text>

            <Animated.View style={styles.wrappedView}
                {...panResponder.panHandlers}
            >
                <Svg style={styles.svgStyle}
                    height="100%" width="100%" viewBox={`0 0 100 100`}>
                    <Circle cx="50" cy="50" r={radius} stroke="blue" fill="none" strokeWidth="1"></Circle>
                    <Path stroke="red" strokeWidth="2" fill="none"
                        //d={`M50 10 A${radius} ${radius} 0 0 1 ${pathToPtX} ${pathToPtY}`}
                        d={`M50 10 A${radius} ${radius} 0 ${theta > 180 ? 1 : 0} 1 ${pathToPtX} ${pathToPtY}`}
                    />
                </Svg>
            </Animated.View>

            <Animated.View


                style={{
                    transform: [{ translateX: pan.x }, { translateY: pan.y }]
                }}
                {...panResponder.panHandlers}
            >

            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrappedView: {
        aspectRatio: 1,
        borderWidth: 5,
    },
    title: {
        margin: 30,
        fontSize: 25,
    },

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "bold"
    },
    box: {
        height: 150,
        width: 150,
        backgroundColor: "blue",
        borderRadius: 5
    },
    svgStyle: {
        borderWidth: 2,
    }
})

export default SessionSelectScreen;