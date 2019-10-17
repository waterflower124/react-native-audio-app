import React from 'react';
import { View, Text, TouchableOpacity,Platform } from 'react-native';
import { BlurView } from "@react-native-community/blur";
import ImageBoxView from '../../image/imageBoxView';
import styles from './style';
import IconComponent from 'react-native-vector-icons/FontAwesome5'

const MinPlayerComponent = props => (
    { ...Platform.OS === 'android' ? 
        <View style={styles.container}>  
        <View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(props.item)}> 
        {
            props.track_artwork == "" &&
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                source={require('../../../images/logo.png')}
            />
        }
        {
            props.track_artwork != "" &&
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                source={{ uri: props.track_artwork }}
            />
        }   
        </TouchableOpacity>
        </View>
            <View style={styles.actions}>
            <View>
                <Text style={styles.title} numberOfLines={1}>{props.track_title == "" ? "No Music" : props.track_title}</Text>
                <Text style={styles.name} numberOfLines={1}>{props.track_artist == "" ? "No Artist" : props.track_artist}</Text>
            </View>
            <View style={styles.actionsRight}>
                <TouchableOpacity onPress = {props.music_play_button_func}>
                    <IconComponent name={props.music_playing ? "pause" : "play"} size={25} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress = {props.music_next_button_func}>
                    <IconComponent name="forward" size={25} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
        </View>  : <BlurView style={styles.container}>
        <View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(props.item)}> 
        {
            props.track_artwork == "" &&
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                source={require('../../../images/logo.png')}
            />
        }
        {
            props.track_artwork != "" &&
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                source={{ uri: props.track_artwork }}
            />
        } 
        </TouchableOpacity>
            </View>
            <View style={styles.actions}>
            <View>
                <Text style={styles.title} numberOfLines={1}>{props.track_title == "" ? "No Music" : props.track_title}</Text>
                <Text style={styles.name} numberOfLines={1}>{props.track_artist == "" ? "No Artist" : props.track_artist}</Text>
             </View>
            <View style={styles.actionsRight}>
                <TouchableOpacity onPress = {props.music_play_button_func}>
                    <IconComponent name= {props.music_playing ? "pause" : "play"} size={25} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress = {props.music_next_button_func}>
                    <IconComponent name="forward" size={25} style={styles.icon} />
                </TouchableOpacity>
            </View>
            </View>
        </BlurView>
    }
);

export default MinPlayerComponent;
