import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Icon from 'react-native-vector-icons/Entypo'
import { MusicVerticalComponent } from '../../components/music';
import { PimaryButtonIcon } from '../../components/form';
import { MinPlayerComponent } from '../../components/player';
import { FlatListHeaderButton } from '../../components/header';
import ImageBoxView from '../../components/image/imageBoxView';
import { STYLES, COLORS, FONTS } from '../../themes'
import styles from './styles'

import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { SkypeIndicator } from 'react-native-indicators';
import strings from '../../localization/strings';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};

class PlaylistContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            // headerRight: (<View style={STYLES.headerContainer}>
            //     <TouchableOpacity onPress={() => params.onHandleMore()}>
            //         <Icon name="dots-three-horizontal" size={24} color={COLORS.text.white} />
            //     </TouchableOpacity>
            // </View>),

        };
    }
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',
            options: [
                {
                    name: "Play",
                    icon: "play",
                    active: false
                },
                {
                    name: "Shuffle",
                    icon: "shuffle-variant",
                    active: false
                },
            ],
            playlist: [],
            items: [
                {
                    title: "Soft Life",
                    name: "Terror Jr",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
                    picture: "https://is2-ssl.mzstatic.com/image/thumb/Music118/v4/f6/83/5e/f6835edd-43ac-fe7a-923c-44f486d88839/pr_source.png/1024x1024cc.jpg"
                },
                {
                    title: "Happy Accidents",
                    name: "Sara Bareilles",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song4.mp3",
                    picture: "https://is4-ssl.mzstatic.com/image/thumb/Features118/v4/6e/40/10/6e40102c-4436-fb25-448a-0eb915944d59/mzl.dkdwxiaa.jpg/1024x1024cc.jpg"
                },
                {
                    title: "A Fantasy Trip",
                    name: "Kandi Landi",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
                },
                {
                    title: "The Good Life",
                    name: "Cassarah",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song3.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/28sz5.jpg"
                },
                {
                    title: "Soft Life 007",
                    name: "Jodie",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/22sz5.jpg"
                },
                {
                    title: "Happy Accidents 008",
                    name: "Beatrice",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song4.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/24sz5.jpg"
                },
                {
                    title: "Soft Life 009",
                    name: "Jodie",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/22sz5.jpg"
                },
                {
                    title: "Happy Accidents 010",
                    name: "Beatrice",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song4.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/24sz5.jpg"
                },
                {
                    title: "A Fantasy Trip 011",
                    name: "Kandi Landi",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
                },
                {
                    title: "Happy Accidents 012",
                    name: "Beatrice",
                    url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song4.mp3",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/24sz5.jpg"
                },
            ]
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({ onHandleMore: this.onHandleMore });

        this.props.navigation.addListener('willFocus', this.init_func.bind(this));

        this.onTrackStateChange = TrackPlayer.addEventListener('playback-state', async (data) => {
            
            let playing_state = await TrackPlayer.getState();
            if(playing_state == STATE_PLAYING) {
                this.setState({
                    music_playing: true
                });
                
            } else {
                this.setState({
                    music_playing: false
                });
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

        this.onTrackQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
            console.log("queue ended")
            const trackQueue = await TrackPlayer.getQueue();
            if(trackQueue.length == 1) {
                await TrackPlayer.seekTo(0);
            } else {
                await TrackPlayer.skip(trackQueue[0].id);
                await TrackPlayer.play();
            }
        });
    }

    componentWillUnmount() {
        this.onTrackStateChange.remove();
        this.onTrackQueueEnded.remove();
    }

    async UNSAFE_componentWillMount() {
        const { state } = this.props.navigation;
        const params = state.params || {};
        this.setState({
            playlist: params.playlist
        })

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/artist_songs/' + params.playlist.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            }
        })
        .then(response => response.json())
        .then(async data => {
            const error_code = data.error.code;
            if(error_code == 401) {
                Alert.alert("Waves!", 'Token error!');
            } else if(error_code == 402) {
                Alert.alert("Waves!", 'Your account is disabled!');
            } else if(error_code == 200) {
                var items = [];
                
                for(i = 0; i < data.data.songs.length; i ++) {
                    var artist_name = "";
                    if(data.data.name == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data.name;
                    }
                    items.push({
                        id: data.data.songs[i].id,
                        artist: artist_name,
                        title: data.data.songs[i].name,
                        url: global.server_url + data.data.songs[i].audio,
                        artwork: global.server_url + data.data.songs[i].img,
                        db_id: data.data.songs[i].id,
                    });
                }
                    
                this.setState({
                    items: items,
                })
    
            } else {
                Alert.alert("Waves!", 'There is an error in server, Please try again.');
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', error.message);
        });
        
        this.setState({showIndicator: false});
    }

    init_func = async() => {

        let playing_state = await TrackPlayer.getState();
        if(playing_state != STATE_PLAYING) {
            this.setState({
                music_playing: false
            })
        } else {
            this.setState({
                music_playing: true
            })
        }
    
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        if(currentTrackID != null) {
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
        }

    }

    onHandleMore = () => {

    }

    onPressOption = async item => {
        if(item.name == "Play") {
            if(!this.state.options[0].active) {
                await TrackPlayer.reset();
                var track_list = Object.assign([], this.state.items);
                await TrackPlayer.add(track_list);
                await TrackPlayer.play();

                this.setState({
                    options: [
                        {
                            name: "Play",
                            icon: "play",
                            active: true
                        },
                        {
                            name: "Shuffle",
                            icon: "shuffle-variant",
                            active: false
                        },
                    ]
                })
            }
        } else if(item.name == "Shuffle") {
            if(!this.state.options[1].active) {
                await TrackPlayer.reset();
                var track_list = Object.assign([], this.state.items);
                for (let i = track_list.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [track_list[i], track_list[j]] = [track_list[j], track_list[i]];
                }
                await TrackPlayer.add(track_list);
                await TrackPlayer.play();
                this.setState({
                    options: [
                        {
                            name: "Play",
                            icon: "play",
                            active: false
                        },
                        {
                            name: "Shuffle",
                            icon: "shuffle-variant",
                            active: true
                        },
                    ]
                })
            }
        }
    }

    onHideUnderlay = item => {
        // item.active = false
        // this.setState({ item });
        // console.log("onHideUnderlay==", item)
    }

    onShowUnderlay = item => {
        // item.active = true
        // this.setState({ item });
        // console.log("onShowUnderlay==", item)
    }

    onPress = async item => {
        await TrackPlayer.reset();

        var track_list = Object.assign([], this.state.items);
        await TrackPlayer.add(track_list);
        await TrackPlayer.skip(String(item.id));
        await TrackPlayer.play()
    }

    onHandlePlayer = async items => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        if(currentTrackID != null) {
            let playing_state = await TrackPlayer.getState();
            var play_status = ""
            if(playing_state == STATE_PLAYING) {
                plsy_status = strings.now_playing;
            } else if(playing_state == STATE_PAUSED) {
                plsy_status = strings.now_pause;
            } else {
                plsy_status = strings.now_stop;
            }
            this.props.navigation.navigate('Player', {header_now_status_string: play_status});
        }
    }

    music_next_button_func = async() => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        const trackQueue = await TrackPlayer.getQueue();
        var i = 0;
        for(i = 0; i < trackQueue.length; i ++) {
          if(currentTrackID == trackQueue[i].id) {
            break;
          }
        }
        if(i == trackQueue.length - 1) {
          await TrackPlayer.skip(trackQueue[0].id)
        } else {
          await TrackPlayer.skipToNext();
        }
        await TrackPlayer.play();
      }
    
    music_play_button_func = async() => {
        const trackQueue = await TrackPlayer.getQueue();
        
        if(trackQueue.length > 0) {
            
            let playing_state = await TrackPlayer.getState();
            if(playing_state != STATE_PLAYING) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    }

    render() {
        const { playlist, items, options } = this.state
        if(this.state.showIndicator)
        {
            return (
            <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', zIndex: 100}}>
                <View style = {{flex: 1}}>
                    <SkypeIndicator color = '#ffffff' />
                </View>
            </View>
            )
        }
        return (
            <SafeAreaView style={STYLES.container}>
                <ParallaxScrollView style={[{ marginTop: -90 }]}
                    headerBackgroundColor={COLORS.emptyColor}
                    backgroundColor={COLORS.backgroundColor}
                    contentBackgroundColor={COLORS.backgroundColor}
                    parallaxHeaderHeight={400}
                    stickyHeaderHeight={90}
                    backgroundSpeed={10}
                    renderBackground={() => (
                        <View key="background">
                            <Image resizeMode="cover" style={styles.imageBackground}
                                source={{ uri: playlist.picture ? playlist.picture : "" }} />
                        </View>
                    )}
                    renderForeground={() => (
                        <View key="parallax-header" style={styles.parallaxHeader}>
                            <TouchableOpacity activeOpacity={0.8}>
                                <View style={styles.avatarContainer}>
                                    <ImageBoxView
                                        customStyle={styles.avatar}
                                        isEmptyGrayBox
                                        isRadius
                                        boxSize="md"
                                        source={playlist.picture ? { uri: playlist.picture } : ""}
                                    />
                                </View>
                                <Text style={styles.name} numberOfLines={1}>{playlist.name}</Text>
                            </TouchableOpacity>
                            {/* <PimaryButtonIcon iconName="account-plus"
                                title="Follow" customStyleTitle={{ fontFamily: FONTS.type.Bold }}
                                customStyle={{ width: 200, height: 45 }} /> */}
                        </View>
                    )}
                    renderStickyHeader={() => (<View key="sticky-header" />)}>
                    <FlatList
                        style={[styles.flatListContainer, STYLES.scrollContainer]}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        viewabilityConfig={VIEWABILITY_CONFIG}
                        removeClippedSubviews
                        data={items}
                        refFlatlist={(ref) => { this.refFlatlist = ref; }}
                        keyExtractor={(item, index) => item + index || item.id || index.toString()}
                        listKey={(index) => index.toString()}
                        ListHeaderComponent={
                            <FlatListHeaderButton
                                onPress={this.onPressOption}
                                onHideUnderlay={this.onHideUnderlay}
                                onShowUnderlay={this.onShowUnderlay}
                                items={options}
                            />
                        }
                        renderItem={({ item, index }) => (
                            <MusicVerticalComponent
                                index={index}
                                lastIndex={items.length - 1}
                                item={item}
                                onPress={this.onPress}
                            />
                        )}
                    />
                </ParallaxScrollView>
                <MinPlayerComponent 
                    onPress={this.onHandlePlayer}
                    music_playing = {this.state.music_playing}
                    track_title = {this.state.track_title}
                    track_artist = {this.state.track_artist}
                    track_artwork = {this.state.track_artwork}
                    music_play_button_func = {() => this.music_play_button_func()}
                    music_next_button_func = {() => this.music_next_button_func()}/>
            </SafeAreaView>
        );
    }
}
export default PlaylistContainer