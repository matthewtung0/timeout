// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');


module.exports = (async () => {
    /*const config = await getDefaultConfig(__dirname);
    const { transformer, resolver } = config;

    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve("react-native-svg-transformer")
    }

    config.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter(ext => ext !== "svg"),
        sourceExts: [...resolver.sourceExts, "svg", "mp4"]
    }

    console.log("ASSET_EXTS: ", config.resolver.assetExts)
    console.log("SOURCE_EXTS: ", config.resolver.sourceExts)

    return config;*/
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