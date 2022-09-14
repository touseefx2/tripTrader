import { PlatformPressable } from '@react-navigation/elements';
import { Link, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../../../../../src/theme';

type Props = {

  user?: string;
  /**
   * The label text of the item.
   */
  label:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?: (props: {
    focused: boolean;
    size: number;
    color: string;
  }) => React.ReactNode;
  /**
   * URL to use for the link to the tab.
   */
  to?: string;
  /**


  * Whether to highlight the drawer item as active.
   */
  focused?: boolean;
  /**
   * Function to execute on press.
   */
  onPress: () => void;
  /**
   * Color for the icon and label when the item is active.
   */
  activeTintColor?: string;
  /**
   * Color for the icon and label when the item is inactive.
   */
  inactiveTintColor?: string;
  /**
   * Background color for item when its active.
   */
  activeBackgroundColor?: string;
  /**
   * Background color for item when its inactive.
   */
  inactiveBackgroundColor?: string;
  /**
   * Color of the touchable effect on press.
   * Only supported on Android.
   *
   * @platform android
   */
  pressColor?: string;
  /**
   * Opacity of the touchable effect on press.
   * Only supported on iOS.
   *
   * @platform ios
   */
  pressOpacity?: number;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
};

const LinkPressable = ({
  children,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  to,
  accessibilityRole,
  ...rest
}: Omit<React.ComponentProps<typeof PlatformPressable>, 'style'> & {
  style: StyleProp<ViewStyle>;
} & {
  to?: string;
  children: React.ReactNode;
  onPress?: () => void;
}) => {
  if (Platform.OS === 'web' && to) {
    // React Native Web doesn't forward `onClick` if we use `TouchableWithoutFeedback`.
    // We need to use `onClick` to be able to prevent default browser handling of links.
    return (
      <Link
        {...rest}
        to={to}
        style={[styles.button, style]}
        onPress={(e: any) => {
          if (
            !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
            (e.button == null || e.button === 0) // ignore everything but left clicks
          ) {
            e.preventDefault();
            onPress?.(e);
          }
        }}
        // types for PressableProps and TextProps are incompatible with each other by `null` so we
        // can't use {...rest} for these 3 props
        onLongPress={onLongPress ?? undefined}
        onPressIn={onPressIn ?? undefined}
        onPressOut={onPressOut ?? undefined}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <PlatformPressable
        {...rest}
        accessibilityRole={accessibilityRole}
        onPress={onPress}
      >
        <View style={style}>{children}</View>
      </PlatformPressable>
    );
  }
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export default function DrawerItem(props: Props) {
  const { colors } = useTheme();

  const {
    icon,
    label,
    labelStyle,
    to,
    focused = false,
    allowFontScaling,
    activeTintColor = colors.primary,
    inactiveTintColor = Color(colors.text).alpha(0.68).rgb().string(),
    activeBackgroundColor = Color(activeTintColor).alpha(0.12).rgb().string(),
    inactiveBackgroundColor = 'transparent',
    style,
    onPress,
    pressColor,
    pressOpacity,
    user,
    ...rest
  } = props;

  const { borderRadius = 8 } = StyleSheet.flatten(style || {});
  const color = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const iconNode = icon ? icon({ size: 24, focused, color }) : null;
 console.log("user : ",user)
 if((user=="guest" && (label=="Trade Offers" || label=="Confirmed Trips" || label=="Saved Trips" )) || (user!=="guest"  && label=="My Profile") || (label=="Notifications") ){
  return (
   null
  );
 }  else  {
  return(
  <View
  collapsable={false}
  {...rest}
  style={[styles.container, { borderRadius, backgroundColor,marginTop:( label=="Create Trip" ||  label=="Latest News")?15:0 }, style]}
>
  <LinkPressable
    onPress={onPress}
    style={[styles.wrapper, { borderRadius }]}
    accessibilityRole="button"
    accessibilityState={{ selected: focused }}
    pressColor={pressColor}
    pressOpacity={pressOpacity}
    to={to}
  >
    <React.Fragment>
      {iconNode}
      <View
        style={[
          styles.label,
          { marginLeft: iconNode ? 20 : 0, marginVertical: 5 },
        ]}
      >
        {typeof label === 'string' ? (
          <Text
            numberOfLines={1}
            allowFontScaling={allowFontScaling}
            style={[
              {
                color,
                 
                fontFamily:theme.fonts.fontNormal
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        ) : (
          label({ color, focused })
        )}
      </View>
    </React.Fragment>
  </LinkPressable>
</View>
  )
 }
  
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 0,
    overflow: 'hidden'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:12,
    paddingVertical:6,
    borderRadius:8,
  },
  label: {
    marginRight: 32,
    flex: 1,
  
  },
  button: {
    display: 'flex',
  },
});
