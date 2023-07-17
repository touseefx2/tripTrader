'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
const tslib_1 = require('tslib');
const React = tslib_1.__importStar(require('react'));
const react_native_1 = require('react-native');
const react_native_fast_image_1 = tslib_1.__importDefault(
  require('react-native-fast-image'),
);
const AnimatedFastImage = react_native_1.Animated.createAnimatedComponent(
  react_native_fast_image_1.default,
);
/**
 * ? Local Imports
 */
const ProgressiveFastImage_style_1 = tslib_1.__importDefault(
  require('./ProgressiveFastImage.style'),
);
class ProgressiveImage extends React.Component {
  constructor(props) {
    super(props);
    this.animatedImage = new react_native_1.Animated.Value(0);
    this.animatedThumbnailImage = new react_native_1.Animated.Value(0);
    this.animatedLoadingImage = new react_native_1.Animated.Value(1);
    this.onThumbnailLoad = () => {
      react_native_1.Animated.timing(this.animatedLoadingImage, {
        toValue: 0,
        useNativeDriver: this.props.useNativeDriver || true,
      }).start(() => {
        react_native_1.Animated.timing(this.animatedThumbnailImage, {
          toValue: 1,
          duration: this.props.thumbnailAnimationDuration,
          useNativeDriver: this.props.useNativeDriver || true,
        }).start();
      });
    };
    this.onImageLoad = () => {
      this.setState({imageLoaded: false});
      react_native_1.Animated.timing(this.animatedImage, {
        toValue: 1,
        duration: this.props.imageAnimationDuration,
        useNativeDriver: this.props.useNativeDriver || true,
      }).start();
    };
    this.onLoadEnd = () => {
      this.setState({showDefault: false});
    };
    this.onError = () => {
      this.setState({error: true});
    };
    // ? bugfix: FastImage library's `source` null
    this.normalisedSource = () => {
      const {source} = this.props;
      const normalisedSource =
        source && typeof source.uri === 'string' && !source.uri.split('http')[1]
          ? null
          : source;
      return this.props.source && this.props.source.uri
        ? normalisedSource
        : source;
    };
    this.statedSource = () => {
      const {error} = this.state;
      const {loadingSource, errorSource} = this.props;
      if (!loadingSource) {
        return error ? errorSource : this.normalisedSource();
      }
      if (!errorSource) return this.normalisedSource();
      return error
        ? errorSource // ? Error Image
        : this.normalisedSource();
    };
    this.state = {
      error: false,
      showDefault: true,
      imageLoaded: false,
    };
  }
  render() {
    const {
      style,
      source,
      loadingSource,
      thumbnailSource,
      loadingImageComponent,
      blurRadius = 15,
      loadingImageStyle,
      ...props
    } = this.props;
    return (
      <react_native_1.View
        style={ProgressiveFastImage_style_1.default.container}>
        {loadingImageComponent ||
          (loadingSource && !this.state.imageLoaded && (
            <react_native_1.View
              style={[
                ProgressiveFastImage_style_1.default.loadingImageStyle,
                style,
              ]}>
              <AnimatedFastImage
                resizeMode="cover"
                style={[
                  {opacity: this.animatedLoadingImage},
                  loadingImageStyle,
                ]}
                source={this.props.loadingSource}
              />
            </react_native_1.View>
          ))}
        <react_native_1.Animated.Image
          blurRadius={blurRadius}
          source={thumbnailSource}
          onLoad={this.onThumbnailLoad}
          style={[{opacity: this.animatedThumbnailImage}, style]}
        />
        <AnimatedFastImage
          {...props}
          onError={this.onError}
          onLoad={this.onImageLoad}
          onLoadEnd={this.onLoadEnd}
          style={[
            ProgressiveFastImage_style_1.default.imageStyle,
            {opacity: this.animatedImage},
            style,
          ]}
          source={this.statedSource()}
        />
      </react_native_1.View>
    );
  }
}
exports.default = ProgressiveImage;
//# sourceMappingURL=ProgressiveFastImage.js.map
