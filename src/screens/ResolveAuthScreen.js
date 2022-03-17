import { useContext, useEffect } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';

// doubles as the splash screen
const ResolveAuthScreen = () => {
    const { tryLocalSignin } = useContext(AuthContext);

    useEffect(() => {
        const timer = setTimeout(
            () => {
                tryLocalSignin();
            }, 500);
        return () => clearTimeout(timer);
    }, [])

    return (
        <View>
            <ImageBackground
                source={require('../../assets/splash_screen.png')}
                style={styles.image}>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    }
})

export default ResolveAuthScreen;