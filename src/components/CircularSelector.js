import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Animated, View, StyleSheet, PanResponder, Dimensions, ImageBackground } from 'react-native';
import Svg, { Circle, Path, Text } from 'react-native-svg';

const img_timer = require('../../assets/clock_middle.png');
//const clock_bottom = require('../../assets/clock_bottom.png');
//const clock_top = require('../../assets/clock_top.png');

const { height, width } = Dimensions.get('window');
const picked_width = height / 3.6

//width / 2 / 0.80


const CircularSelector = forwardRef(({ updateCallback }, ref) => {
    const timer_radius_pct = 0.43//0.45 // fraction of screen that the radius takes
    const radius = (width * timer_radius_pct) * 100 / width // ex. 40 for 0.4 timer_radius_pct
    const [st, setSt] = useState({ cx: width / 2, cy: height / 2 });
    const [theta, setTheta] = useState(0);

    const [time, setTime] = useState(0)
    const [formattedTime, setFormattedTime] = useState('00');
    const [formattedTens, setFormattedTens] = useState('0')
    const [formattedOnes, setFormattedOnes] = useState('0')

    const maxTime = 60;
    const [pathToPtX, setPathToPtX] = useState(50)
    const [pathToPtY, setPathToPtY] = useState(50 - radius)
    const [velX, setVelX] = useState(0)
    const [velY, setVelY] = useState(0)
    const [curQuadrant, setCurQuadrant] = useState('')
    const [rightCheck, setRightCheck] = useState(false)
    const [leftCheck, setLeftCheck] = useState(false)

    useImperativeHandle(ref, () => ({
        resetSlider() {
            setPathToPtX(50)
            setPathToPtY(50 - radius)
            setFormattedTime('00:00')
            setFormattedTens('0')
            setFormattedOnes('0')
            setTheta(0)
        },
    }))

    const polarToTime = (angle) => {
        let mins = Math.round((angle / 360) * maxTime)
        setTime(mins)
        updateCallback(mins)
        let formatted_mins = "00"
        if (mins < 10) {
            formatted_mins = "0" + mins.toString()
        } else {
            formatted_mins = mins.toString();
        }

        /*let formatted_mins = mins.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })*/

        setFormattedTens(formatted_mins.charAt(0))
        setFormattedOnes(formatted_mins.charAt(1))
        return formatted_mins

    }

    const currentQuadrant = (x, y) => {
        let x_mid = picked_width / 2
        let hor_side = x - x_mid
        let ver_side = x_mid - y
        if (hor_side >= 0 && ver_side >= 0) {
            return 1
        } else if (hor_side >= 0 && ver_side < 0) {
            return 2
        } else if (hor_side < 0 && ver_side < 0) {
            return 3
        } else {
            return 4
        }
    }

    const getRadius = (x, y) => {
        let x_mid = picked_width / 2
        let hor_side = x - x_mid
        let ver_side = x_mid - y
        return Math.sqrt(hor_side * hor_side + ver_side * ver_side)
    }

    const cartesianToPolar = (x, y) => {
        let x_mid = picked_width / 2;
        let hor_side = x - x_mid
        let ver_side = x_mid - y
        let theta = 0;
        let cur_Quad = 1
        if (hor_side >= 0 && ver_side >= 0) { // quadrant I
            theta = 90 - Math.atan(ver_side / hor_side) / Math.PI * 180;
            setCurQuadrant('I')
            cur_Quad = 1
        } else if (hor_side >= 0 && ver_side < 0) { // quadrant II
            theta = 90 + Math.atan(-ver_side / hor_side) / Math.PI * 180
            setCurQuadrant('II')
            cur_Quad = 2
        } else if (hor_side < 0 && ver_side < 0) { // quadrant III
            theta = 270 - Math.atan(-ver_side / -hor_side) / Math.PI * 180
            setCurQuadrant('III')
            cur_Quad = 3
        } else { // quadrant IV
            theta = 270 + Math.atan(ver_side / -hor_side) / Math.PI * 180
            setCurQuadrant('IV')
            cur_Quad = 4
        }
        return { theta, cur_Quad }
    }

    const setDial = (theta, cur_Quad) => {
        let deltaX = 0;
        let deltaY = 0;
        setTheta(theta);
        setFormattedTime(polarToTime(theta))
        if (cur_Quad == 1) { // quadrant I
            let theta_rad = theta * Math.PI / 180
            deltaX = Math.sin(theta_rad) * radius + 50
            deltaY = 50 - Math.cos(theta_rad) * radius
        } else if (cur_Quad == 2) { // quadrant II
            let theta_rad = (theta - 90) * Math.PI / 180
            deltaX = Math.cos(theta_rad) * radius + 50
            deltaY = 50 + Math.sin(theta_rad) * radius
        } else if (cur_Quad == 3) { // quadrant III
            let theta_rad = (theta - 180) * Math.PI / 180
            deltaX = 50 - Math.sin(theta_rad) * radius
            deltaY = 50 + Math.cos(theta_rad) * radius
        } else { // quadrant IV
            let theta_rad = (theta - 270) * Math.PI / 180
            deltaX = 50 - Math.cos(theta_rad) * radius
            deltaY = 50 - Math.sin(theta_rad) * radius
        }
        setPathToPtX(deltaX)
        setPathToPtY(deltaY)
    }

    let isCurrentTouched = false;
    let lockAtSixtyMin = false;
    let lockAtZeroMin = false;
    let cur_theta_temp = 0;
    let goRightCheck = false;
    let goLeftCheck = false;
    let prev_theta = -1;

    // SET TOP BOUNDARY HERE
    let topBoundary_ =
        height * 0.25 // view above clock
        + 20 //marginTop above clock
        + (picked_width) * 0.22 //clock top image

    //let topBoundary_ = 55 + (picked_width) * 0.22 + 20

    var disabled = false;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event, gestureState) => {
                //console.log(`grant locationX: ${event.nativeEvent.locationX} and grant locationY: ${event.nativeEvent.locationY}`)
                //this.locationPageOffset = event.nativeEvent.pageX - event.nativeEvent.locationY;
                //console.log(`locaitonPageOffset: ${this.locationPageOffset}`)
                isCurrentTouched = true;
                //disabled = false;
            },
            onPanResponderRelease: (event, gestureState) => {
                isCurrentTouched = false;
                lockAtSixtyMin = false;
                lockAtZeroMin = false;
            },
            onPanResponderMove: (event, gestureState) => {
                //if (disabled) { return; }
                //var rightBoundary = width / 2 + picked_width / 2
                var leftBoundary = width / 2 - picked_width / 2
                var topBoundary = topBoundary_//0
                //var bottomBoundary = topBoundary_ + picked_width;

                //let x_set_old = event.nativeEvent.locationX.toFixed(2)
                //let y_set_old = event.nativeEvent.locationY.toFixed(2)

                let moveX = gestureState.moveX
                let moveY = gestureState.moveY
                //console.log(`old x_set: ${x_set_old}, old y_set: ${y_set_old}`)


                var x_set = moveX - leftBoundary;
                var y_set = moveY - topBoundary;
                //console.log(`x_set: ${x_set}, y_set: ${y_set}`)

                /*leftBoundary: ${leftBoundary}, rightBoundary: ${rightBoundary}
                topBoundary: ${topBoundary}, bottomBoundary: ${bottomBoundary}`)*/
                /*leftBoundary: 0, rightBoundary: 334.2857142857143
                topBoundary: 0, bottomBoundary: 257.1428571428571
                */

                /*if (moveX >= rightBoundary) {
                    x_set = rightBoundary - 1
                } if (moveX <= leftBoundary) {
                    x_set = leftBoundary + 1
                } if (moveY <= topBoundary) {
                    y_set = topBoundary + 1
                } if (moveY >= bottomBoundary) {
                    y_set = bottomBoundary - 1
                }*/

                /*if (moveX >= rightBoundary || moveX <= (leftBoundary)
                    || moveY <= topBoundary || moveY >= (bottomBoundary)) {
                    return;
                }*/

                //let x_vel = gestureState.vx

                let current_Quadrant = currentQuadrant(x_set, y_set)

                let r = getRadius(x_set, y_set)
                if (r >= 0.8 * radius) {
                    // only allow scrolling near edges

                    // detect if we go past 0 deg due to speed this way ----->
                    if (gestureState.vx > 0 && current_Quadrant != 2 && current_Quadrant != 3 && cur_theta_temp != 1) {
                        goRightCheck = true;
                    } else {
                        goRightCheck = false;
                    }
                    setRightCheck(goRightCheck)

                    //detect if we go past 0 deg due to speed this way <-------
                    if (gestureState.vx < 0 && current_Quadrant != 2 && current_Quadrant != 3 && cur_theta_temp != 358) {
                        goLeftCheck = true;
                    } else {
                        goLeftCheck = false;
                    }
                    setLeftCheck(goLeftCheck)

                    // if moving left, dont lock anything as long as we are just backtracking from 60min
                    if (gestureState.vx < 0 && current_Quadrant == 4) {
                        goRightCheck = false;
                        lockAtSixtyMin = false;
                    }
                    setRightCheck(goRightCheck)

                    // if moving right, don't lock anything as long as we are just returning from < 0 min
                    if (gestureState.vx > 0 && current_Quadrant == 1) {
                        goLeftCheck = false;
                        lockAtZeroMin = false;
                    }
                    setLeftCheck(goLeftCheck)

                    // if lock at 60:00
                    if (lockAtSixtyMin) {
                        cur_theta_temp = 358
                        setDial(358, 4)
                        prev_theta = cur_theta_temp

                        // if lock at 0:00
                    } else if (lockAtZeroMin) {
                        cur_theta_temp = 1
                        setDial(1, 1)
                        prev_theta = cur_theta_temp
                    }

                    // else we can move the dial
                    else {

                        setSt({ cx: x_set, cy: y_set })
                        setVelX(gestureState.vx);
                        setVelY(gestureState.vy);

                        let polar_coords = cartesianToPolar(x_set, y_set)

                        // check if we need to set any restrictions

                        // check if we overshot due to speed ---->
                        if (goRightCheck && prev_theta > polar_coords.theta && prev_theta > 180
                            && polar_coords.theta < 180) {
                            // > 180 prevents edge case of finger drifting right in Q1 counterclockwise
                            // < 180 prevents edge case of finger heading right in Q4 but theta decreasing
                            goRightCheck = false;
                            lockAtSixtyMin = true;
                            cur_theta_temp = 358
                            setDial(358, 4)
                            prev_theta = cur_theta_temp

                            // check if we overshot due to speed <-----
                        } else if (goLeftCheck && prev_theta < polar_coords.theta && prev_theta < 180
                            && polar_coords.theta > 180) {
                            goLeftCheck = false;
                            lockAtZeroMin = true;
                            cur_theta_temp = 1
                            setDial(1, 1)
                            prev_theta = cur_theta_temp
                        }
                        else {
                            cur_theta_temp = polar_coords.theta
                            setDial(polar_coords.theta, polar_coords.cur_Quad)
                            prev_theta = cur_theta_temp
                        }
                        setLeftCheck(goLeftCheck)
                        setRightCheck(goRightCheck)

                    }
                }

            },
        })
    ).current;

    return (
        <View
            style={[styles.container, { borderWidth: 0, }]}
        >
            <View>
                <ImageBackground
                    source={img_timer}
                    resizeMode='contain'>

                    <Animated.View
                        style={[styles.wrappedView]}
                        {...panResponder.panHandlers}

                    >
                        <Svg style={styles.svgStyle}
                            height="100%" width="100%" viewBox={`0 0 100 100`}>
                            <Circle cx="50" cy="50" r={radius} stroke="#E8D39E" fill="none"
                                strokeWidth="3"></Circle>
                            <Path stroke="#8CC768" strokeWidth="3" fill="none"
                                // circular path
                                d={`M50 ${50 - radius} A${radius} ${radius} 0 ${theta > 180 ? 1 : 0} 1 ${pathToPtX} ${pathToPtY}`}
                            />
                            {/* circular knob */}
                            <Circle cx={pathToPtX} cy={pathToPtY} r='6' fill='#90AB72'></Circle>

                            <Text x={24} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                            >{formattedTens}</Text>
                            <Text x={40} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                            >{formattedOnes}</Text>
                            <Text x={50} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                            >:</Text>
                            <Text x={68} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                            >00</Text>

                            {/*<Text x={50} y={60} fontSize={5} textAnchor="middle" fill="black">{"phone y is " + height}</Text>
                        <Text x={50} y={65} fontSize={5} textAnchor="middle" fill="black">{"x position is " + st.cx}</Text>
                        <Text x={50} y={70} fontSize={5} textAnchor="middle" fill="black">{"y position is " + st.cy}</Text>
                        <Text x={50} y={75} fontSize={5} textAnchor="middle" fill="black">{"Theta angle is " + theta}</Text>
                        <Text x={50} y={80} fontSize={5} textAnchor="middle" fill="black">{"vel X is " + velX}</Text>
                        <Text x={50} y={85} fontSize={5} textAnchor="middle" fill="black">{"vel Y is " + velY}</Text>
                        <Text x={50} y={90} fontSize={5} textAnchor="middle" fill="black">{"right check is " + rightCheck}</Text>
                        <Text x={50} y={95} fontSize={5} textAnchor="middle" fill="black">{"left check is " + leftCheck}</Text>
    */}
                        </Svg>

                        {/*<View style={{ position: 'absolute', borderWidth: 2, width: '100%', height: '100%', flex: 1, flexDirection: 'row', }}>
                        <View style={{ flex: 1, borderWidth: 1, }}>
                            <Text>{formattedTens}</Text>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, }}>
                            <Text></Text>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, }}>
                            <Text></Text>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, }}>
                            <Text></Text>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, }}>
                            <Text></Text>
                        </View>

</View>*/}
                    </Animated.View>
                </ImageBackground>
            </View>
        </View >
    )
})

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    wrappedView: {
        aspectRatio: 1,
        borderWidth: 0,
        borderColor: 'black',
        //backgroundColor: 'green',
        width: picked_width,
    },
    svgStyle: {
        flex: 1,
    },
    titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "bold"
    },

});

export default CircularSelector;