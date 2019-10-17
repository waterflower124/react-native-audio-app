import React, { Component } from 'react';
import { Animated, Dimensions, View, Text, SafeAreaView, TouchableOpacity, Image, FlatList, findNodeHandle } from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather'
import { BlurView } from "@react-native-community/blur";
import Slider from "react-native-slider";
import { PimaryButtonIcon } from '../../components/form';

import IconComponent from 'react-native-vector-icons/AntDesign'
import PlayerComponent from './Player'

import ImageBoxView from '../../components/image/imageBoxView';
import { STYLES, COLORS, FONTS } from '../../themes'
import styles from './style'
import strings from '../../localization/strings';
import { ScrollView } from 'react-native-gesture-handler';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

import TrackPlayer, {useTrackPlayerProgress, STATE_PLAYING} from 'react-native-track-player';

class ProgressBar extends TrackPlayer.ProgressComponent {

    constructor(props) {
        super(props);
        this.state = {
            current_position_time: '00:00'
        }
    }

    get_current_play_time(current_play_time) {
        // var current_play_time = this.state.position;

        var time_string = '';
        if(Math.floor(current_play_time / 60) < 10) {
            time_string = "0" + Math.floor(current_play_time / 60) + ":";
        } else {
            time_string = Math.floor(current_play_time / 60) + ":";
        }
        
        if(current_play_time % 60 < 10) {
            time_string += "0" + current_play_time % 60;
        } else {
            time_string += current_play_time % 60;
        }

        return time_string
    }

    render() {
        return (
            <View style={styles.sliderContainer}>
                <Text style={styles.current_duration}>{this.get_current_play_time(Math.floor(this.state.position))}</Text>
                <Slider
                    value={this.state.position}
                    minimumTrackTintColor={COLORS.text.pink}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumValue = {0}
                    maximumValue = {isNaN(Math.floor(this.state.bufferedPosition)) ? 10 : Math.floor(this.state.bufferedPosition)}
                />
                <Text style={styles.total_duration}>{this.get_current_play_time(Math.floor(this.state.bufferedPosition))}</Text>
            </View>
        );
    }
}

class PlayerContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            headerLeft: (
                <View style={STYLES.headerContainer}>
                    <TouchableOpacity onPress={() => params.onHandleBack()}>
                        <IconComponent name="caretdown" size={24} color={COLORS.text.white} style={{ marginTop:-2}}/>
                    </TouchableOpacity>
                    <Text style={[STYLES.headerContainer.title, { fontSize: 17, marginLeft: 10 }]}>{state.params.header_now_status_string}</Text>
                </View>),
            // headerRight: (<View style={STYLES.headerContainer}>
            //     <TouchableOpacity>
            //         <IconFeather name="share"  size={24} style={styles.headerIcon}/> 
            //     </TouchableOpacity>
            //     <TouchableOpacity>
            //         <IconFeather name="plus" size={24} style={[styles.headerIcon, {marginLeft: 10}]}/>
            //     </TouchableOpacity>
            // </View>)

        };
    }
    constructor(props) {
        super(props);
        this.state = {

            track_title: "",
            track_artist: "",
            track_artwork: "",
            music_playing: false,
            header_now_status_string: "strings.now_pause",
            current_position: 0,

            isHidden: true,
            opacity: new Animated.Value(1),
            bounceValueView: new Animated.Value(0),
            bounceValue: new Animated.Value(200),
            viewRef: null,
            items: []
        };
    }

    UNSAFE_componentWillMount() {
        console.log("1234567")
    }

    componentDidMount() {
        this.props.navigation.setParams({ onHandleBack: this.onHandleBack });

        this.props.navigation.addListener('willFocus', this.init_func.bind(this));

        // this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
        //     const track = await TrackPlayer.getTrack(data.nextTrack);
        //     this.setState({
        //         track_title: track.title,
        //         track_artist: track.artist,
        //         track_artwork: track.artwork
        //     });
        // });

        this.onTrackStateChange = TrackPlayer.addEventListener('playback-state', async (data) => {
        
            const {setParams} = this.props.navigation;
            let playing_state = await TrackPlayer.getState();
            if(playing_state == STATE_PLAYING) {
                this.setState({
                    music_playing: true
                });
                setParams({ header_now_status_string: strings.now_playing });
            } else {
                this.setState({
                    music_playing: false
                });
                setParams({ header_now_status_string: strings.now_pause });
            }
    
            if(playing_state == STATE_PLAYING) {
                const currentTrackID = await TrackPlayer.getCurrentTrack();
                const trackQueue = await TrackPlayer.getQueue();
                for(i = 0; i < trackQueue.length; i ++) {
                    if(currentTrackID == trackQueue[i].id) {
                        break;
                    }
                }
                this.setState({
                    track_title: trackQueue[i].title,
                    track_artist: trackQueue[i].artist,
                    track_artwork: trackQueue[i].artwork
                });
                // this.send_song_play(trackQueue[i].id)
            }

        });
    }

    componentWillUnmount() {
        this.onTrackStateChange.remove()
    }

    init_func = async() => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        const currentTrack = await TrackPlayer.getTrack(currentTrackID);
        if(currentTrack != null) {
            this.setState({
                track_title: currentTrack.title,
                track_artist: currentTrack.artist,
                track_artwork: currentTrack.artwork,
            });
        }
        const {setParams} = this.props.navigation;
        let playing_state = await TrackPlayer.getState();
        if(playing_state == STATE_PLAYING) {
            setParams({ header_now_status_string: strings.now_playing });
        } else {
            setParams({ header_now_status_string: strings.now_pause });
        }

        if(currentTrack != null) {
            const trackQueue = await TrackPlayer.getQueue();
            var items = []
            for(i = 0; i < trackQueue.length; i ++) {
                items.push({
                    id: trackQueue[i].id,
                    title: trackQueue[i].title,
                    artist: trackQueue[i].artist,
                    url: trackQueue[i].url,
                    artwork: trackQueue[i].artwork
                })
            }
            this.setState({
                items: items
            })
        }
    }

    onPress = async(item, index) => {
        const trackQueue = await TrackPlayer.getQueue();
        await TrackPlayer.skip(trackQueue[index].id);
        await TrackPlayer.play();
    }

    onHandleBack = () => {
        this.props.navigation.goBack()
    }

    onHandleMore = () => {

    }

    onPressOption = item => {
        console.log("item==", item)
    }
    onHideUnderlay = item => {
        item.active = false
        this.setState({ item });
    }
    onShowUnderlay = item => {
        item.active = true
        this.setState({ item });
    }
    imageLoaded() {
        this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
    }
    onHandleToggleBttom = () =>{
        let { isHidden, bounceValue } = this.state
        if (isHidden){
            Animated.spring(
                bounceValue,{
                    toValue: -10,
                    velocity: 4,
                    tension: 3,
                    friction: 8,
                }
            ).start();
          
        }else {
            Animated.spring(
                bounceValue,{
                    toValue: 200,
                    velocity: 1,
                    tension: 1,
                    friction: 3,
                }
            ).start();
        }
        this.setState({
            isHidden: !isHidden
        })
    }

    music_play_button_func = async() => {
        const {setParams} = this.props.navigation;
        let playing_state = await TrackPlayer.getState();
        if(playing_state == STATE_PLAYING) {
            await TrackPlayer.pause();

        } else {
            await TrackPlayer.play();

        }
    }

    music_next_button_func = async() => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        const trackQueue = await TrackPlayer.getQueue();
        const {setParams} = this.props.navigation;
        var i = 0;
        for(i = 0; i < trackQueue.length; i ++) {
            if(currentTrackID == trackQueue[i].id) {
                break;
            }
        }
        if(i == trackQueue.length - 1) {
        //   alert("last");
        } else {
            await TrackPlayer.skipToNext();

        }
    }

    music_previous_button_func = async() => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        const trackQueue = await TrackPlayer.getQueue();
        const {setParams} = this.props.navigation;
        if(trackQueue[0].id == currentTrackID) {
        //   alert("last");
        } else {
            await TrackPlayer.skipToPrevious();

        }
    }

    render() {
        const { items, options, viewRef, bounceValue, isHidden} = this.state
        return (
        <SafeAreaView style={STYLES.container}>
        {
            this.state.track_artwork == "" &&
            <Image
                ref={img => {
                    this.backgroundImage = img;
                }}
                source={require('../../images/logo.png')}
                style={[styles.blurImage, { height: height/2}]}
                onLoadEnd={this.imageLoaded.bind(this)}
            />
        }
        {
            this.state.track_artwork != "" &&
            <Image
                ref={img => {
                    this.backgroundImage = img;
                }}
                source={{ uri: this.state.track_artwork }}
                style={[styles.blurImage, { height: height/2}]}
                onLoadEnd={this.imageLoaded.bind(this)}
            />
        }    
            <BlurView
                style={styles.blurImage}
                viewRef={viewRef}
                blurType="dark"
                blurAmount={100}
            />
            <ScrollView scrollEnabled={isHidden? false : true}>
                <View style={[styles.fixedContainer]}>
                {
                     this.state.track_artwork == "" &&
                     <ImageBoxView
                        customStyle={styles.largePicture}
                        isEmptyGrayBox
                        isRadius
                        boxSize="md"
                        source={require('../../images/logo.png')} />
                }
                {
                     this.state.track_artwork != "" &&
                     <ImageBoxView
                        customStyle={styles.largePicture}
                        isEmptyGrayBox
                        isRadius
                        boxSize="md"
                        source={{ uri: this.state.track_artwork }} />
                }    

                    <Text style={styles.title}>{this.state.track_title}</Text>
                    <Text style={styles.name}>{this.state.track_artist}</Text>

                    <View style={[styles.optionsContainer]}>
                        
                        <View style={styles.sliderContainer}>
                            {/* <Text style={styles.current_duration}>00:02</Text> */}
                            {/* <Slider
                                value={0}
                                minimumTrackTintColor={COLORS.text.pink}
                                trackStyle={styles.track}
                                thumbStyle={styles.thumb}
                                minimumValue = {0}
                                maximumValue = {200}
                            /> */}
                            {/* <Text style={styles.total_duration}>04:30</Text> */}
                            <ProgressBar current_audio_duration = {100}/>
                        </View>

                        <View style={[styles.buttonContainer]}>
                            <TouchableOpacity onPress={() => this.onHandleToggleBttom()}>
                                <IconFeather name={isHidden ? "align-center" : "x-square"} size={25} color={COLORS.text.white} />
                            </TouchableOpacity>
                            <View style={styles.rewindPlayFastContainer}>
                                <TouchableOpacity onPress = {() => this.music_previous_button_func()}>
                                    <IconFeather style={styles.rewind} name="rewind" size={25} color={COLORS.text.white} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress = {() => this.music_play_button_func()}>
                                {
                                    this.state.music_playing &&
                                    <IconFeather name="pause-circle" size={50} color={COLORS.text.white} />
                                }
                                {
                                    !this.state.music_playing &&
                                    <IconFeather name="play-circle" size={50} color={COLORS.text.white} />
                                }  
                                </TouchableOpacity>

                                <TouchableOpacity onPress = {() => this.music_next_button_func()}>
                                    <IconFeather style={styles.fastForward} name="fast-forward" size={25} color={COLORS.text.white} />
                                </TouchableOpacity>
                            </View>

                            {/* <TouchableOpacity>
                                <IconFeather name="volume-2" size={25} color={COLORS.text.white} />
                            </TouchableOpacity> */}
                            <View style = {{width: 25}}>
                                {/* <IconFeather name="volume-2" size={25} color={COLORS.text.white} /> */}
                            </View>
                        </View>

                     <Animated.FlatList
                            style={[styles.flatListContainer, { transform: [{ translateY: bounceValue }] }]}
                            data={items}
                            scrollEnabled={false}
                            refFlatlist={(ref) => { this.refFlatlist = ref; }}
                            keyExtractor={(item, index) => item + index || item.id || index.toString()}
                            listKey={(index) => index.toString()}
                            // ListHeaderComponent={
                            //     <View style={styles.headerFlatList}>
                            //         <PimaryButtonIcon iconName="repeat"
                            //             customStyle={{ width: width / 2 - 20, height: 45, backgroundColor: COLORS.backgroundGreyColor}} />
                                    
                            //         <PimaryButtonIcon iconName="shuffle-variant"
                            //             customStyle={{ width: width / 2 - 20, height: 45}} />
                            //     </View>
                            // }
                            renderItem={({ item, index }) => (
                                <PlayerComponent index={index} item={item} onPress={() => this.onPress(item, index)} lastIndex={items.length - 1} />
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
     </SafeAreaView>);
    }
}
export default PlayerContainer




