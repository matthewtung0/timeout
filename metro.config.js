// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');


module.exports = (async () => {
    const config_ = await getDefaultConfig(__dirname)
    const { transformer,
        resolver,
        //resolver: { sourceExts, assetExts }
    } = config_
    const { sourceExts, assetExts } = resolver;
    return {
        ...config_,
        transformer: {
            ...transformer,
            babelTransformerPath: require.resolve("react-native-svg-transformer")
        },
        resolver: {
            ...resolver,
            assetExts: assetExts.filter(ext => ext !== "svg"),
            sourceExts: [...sourceExts, "svg", "mp4"]
        }
    };
})();