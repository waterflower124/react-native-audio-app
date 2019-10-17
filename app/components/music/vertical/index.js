import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconComponent from 'react-native-vector-icons/Entypo'
import ImageBoxView from '../../image/imageBoxView';
import styles from '../styles/style.vertical';

const MusicVerticalComponent = props => (
      <TouchableOpacity activeOpacity={0.8} 
        onPress={() => props.onPress(props.item)} 
        style={[styles.container]}>
        <ImageBoxView
          customStyle={styles.picture}
          isRadius
          icon="music"
          source={props.item.artwork ? { uri: props.item.artwork } : ""}
        />
        <View style={styles.actionTitle}>
          <Text style={styles.title} numberOfLines={1}>{props.item.title}</Text>
          <Text style={styles.name} numberOfLines={1}>{props.item.artist}</Text>
        </View>
        {/* <View style={styles.actionIcon}>
          <TouchableOpacity activeOpacity={0.8}>
            <IconComponent name="dots-three-vertical" size={18} style={styles.actionIcon.iconDotDot} />
          </TouchableOpacity>
        </View> */}
      </TouchableOpacity>
);

export default MusicVerticalComponent;
