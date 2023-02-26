import { Dimensions, Platform, PixelRatio } from 'react-native';


export function normalize(size) {
    const { width, height } = Dimensions.get('window');
    const scale = width / 320;
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}
