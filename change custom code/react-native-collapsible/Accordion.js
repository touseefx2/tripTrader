import React, {Component} from 'react';
import {View, TouchableHighlight, FlatList} from 'react-native';
import Collapsible from './Collapsible';

const COLLAPSIBLE_PROPS = [
  'align',
  'collapsed',
  'collapsedHeight',
  'renderChildrenCollapsed',
  'enablePointerEvents',
  'duration',
  'easing',
  'style',
  'onAnimationEnd',
];

export default class Accordion extends Component {
  static defaultProps = {
    underlayColor: 'black',
    disabled: false,
    expandFromBottom: false,
    expandMultiple: false,
    touchableComponent: TouchableHighlight,
    keyExtractor: (item, index) => index,
    renderSectionTitle: () => null,
    onAnimationEnd: () => null,
    sectionContainerStyle: {},
    renderAsFlatList: false,
  };

  _toggleSection(section) {
    if (!this.props.disabled) {
      const {activeSections, expandMultiple, onChange} = this.props;

      let updatedSections = [];

      if (activeSections.includes(section)) {
        updatedSections = activeSections.filter(a => a !== section);
      } else if (expandMultiple) {
        updatedSections = [...activeSections, section];
      } else {
        updatedSections = [section];
      }

      if (onChange) {
        onChange(updatedSections);
      }
    }
  }

  _renderContainer = (section, key, renderCollapsible, index) => {
    const {
      activeSections,
      sectionContainerStyle,
      expandFromBottom,
      sections,
      underlayColor,
      touchableProps,
      touchableComponent: Touchable,
      renderHeader,
      renderFooter,
      renderSectionTitle,
      boxContainer,
    } = this.props;
    return (
      <View key={key} style={[boxContainer, {marginTop: index == 0 ? 7 : 0}]}>
        {renderSectionTitle(section, key, activeSections.includes(key))}

        {expandFromBottom && renderCollapsible(section, key)}

        <Touchable
          onPress={() => this._toggleSection(key)}
          underlayColor={underlayColor}
          {...touchableProps}
          accessibilityState={{
            expanded: activeSections.includes(key),
          }}>
          {renderHeader(section, key, activeSections.includes(key), sections)}
        </Touchable>

        {!expandFromBottom && renderCollapsible(section, key)}

        {renderFooter &&
          renderFooter(section, key, activeSections.includes(key), sections)}
      </View>
    );
  };

  render() {
    const {
      activeSections,
      expandMultiple,
      onChange,
      containerStyle,
      sectionContainerStyle,
      expandFromBottom,
      sections,
      underlayColor,
      touchableProps,
      touchableComponent: Touchable,
      onAnimationEnd,
      renderContent,
      renderHeader,
      renderFooter,
      renderSectionTitle,
      disabled,
      renderAsFlatList,
      keyExtractor,
      listHeader,
      emptyMessage,
      boxContainer,
      ItemSeparatorView,

      screen,
      ...restProps
    } = this.props;

    const viewProps = {};
    const collapsibleProps = {};

    Object.keys(restProps).forEach(key => {
      if (COLLAPSIBLE_PROPS.includes(key)) {
        collapsibleProps[key] = restProps[key];
      } else {
        viewProps[key] = restProps[key];
      }
    });

    const renderCollapsible = (section, key) => (
      <Collapsible
        collapsed={!activeSections.includes(key)}
        {...collapsibleProps}
        onAnimationEnd={() => onAnimationEnd(section, key)}>
        {renderContent(section, key, activeSections.includes(key), sections)}
      </Collapsible>
    );

    if (renderAsFlatList) {
      return (
        <FlatList
          // estimatedItemSize={180}
          contentContainerStyle={{
            paddingVertical: 12,
            paddingHorizontal: screen == 'UserProfile' ? 0 : 15,
          }}
          style={containerStyle}
          data={sections}
          extraData={activeSections}
          nestedScrollEnabled={true}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyMessage}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={({item, index}) => {
            const section = item;
            const key = keyExtractor(item, index);
            return this._renderContainer(
              section,
              key,
              renderCollapsible,
              index,
            );
          }}
          {...viewProps}
        />
      );
    }

    return (
      <View style={containerStyle} {...viewProps}>
        {sections.map((section, index) => {
          const key = keyExtractor(section, index);
          return this._renderContainer(section, key, renderCollapsible, index);
        })}
      </View>
    );
  }
}
