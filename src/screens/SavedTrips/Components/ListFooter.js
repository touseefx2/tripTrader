import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles';
import theme from '../../../theme';
import {ActivityIndicator} from 'react-native-paper';

export default function ListFooter({data, d, loadMore, LoadMore, limit}) {
  return (
    <>
      <View style={styles.listFooter}>
        {data.length >= limit && data.length > 0 && data.length < d.length && (
          <View style={styles.listFooter}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadMore}
              onPress={LoadMore}>
              <Text style={styles.listFooterT}>Load More...</Text>
            </TouchableOpacity>
            {loadMore && (
              <ActivityIndicator
                style={{marginLeft: 10}}
                size={16}
                color={theme.color.button1}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
}
