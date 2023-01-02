import { useContext, useCallback } from 'react'
import { View, StyleSheet, Text, ImageBackground } from 'react-native'
import { Context as AuthContext } from '../context/AuthContext'
import { NavigationEvents } from 'react-navigation'
import { Context as CategoryContext } from '../context/CategoryContext'
import { useFocusEffect } from '@react-navigation/native'

// doubles as the splash screen
const ResolveAuthScreen = ({ navigation }) => {
    const { state, tryLocalSignin } = useContext(AuthContext);
    const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
    const splash_screen_image = require('../../assets/splash_screen.png')
    //const [loginResult, setLoginResult] = useState(0)

    /*useEffect(() => {
        const timer = setTimeout(
            () => {
                tryLocalSignin();
            }, 500);
        return () => clearTimeout(timer);
    }, [])*/

    /*useFocusEffect(
        useCallback(() => {
            fetchSelf();
            //return () => test();
        }, [])

    )*/

    const initiateUserInfo = async () => {
        let res = await tryLocalSignin()
        if (res) {
            await fetchUserCategories();
            await fetchUserTodoItems();
        }
        setTimeout(
            () => {
                if (res) {
                    navigation.navigate('profileFlow')
                } else {
                    navigation.navigate('loginFlow')
                }
            }, 200);
    }


    return (
        <View>
            {/*<NavigationEvents onWillFocus={initiateUserInfo} />*/}
            {/*<Text>{JSON.stringify(state)}</Text>*/}


            <ImageBackground
                source={require('../../assets/animation_00_splash-to-main.gif')}
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