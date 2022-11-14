/*import { NavigationActions } from 'react-navigation';*/
import { CommonActions } from '@react-navigation/native'
let navigator;

export const setNavigator = (nav) => {
    navigator = nav;
};

export const navigate = (routeName, params) => {
    console.log("Navigating to " + routeName);
    navigator.dispatch(
        CommonActions.navigate({
            name,
            params
        })
    )
}