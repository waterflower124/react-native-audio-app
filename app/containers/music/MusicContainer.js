import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { MusicVerticalComponent } from '../../components/music';
import { MinPlayerComponent } from '../../components/player';
import { FlatListHeaderButton } from '../../components/header';
import { STYLES, COLORS} from '../../themes'
import styles from '../../components/player/min-player/style';
import strings from '../../localization/strings';
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { SkypeIndicator } from 'react-native-indicators';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};


class MusicContainer extends Component {

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
            items:[]
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: params.title ? params.title : "",
            // headerRight: (<View style={STYLES.headerContainer}>
            //     <TouchableOpacity onPress={() => params.onHandleShowModalSort()}>
            //         <Icon name="list" size={24} color={COLORS.text.primary} />
            //     </TouchableOpacity>
            // </View>) 
        };
    }

    async UNSAFE_componentWillMount() {
        // if(global.music_play_style == "play") {
        //     this.setState({
        //         options: [
        //             {
        //                 name: "Play",
        //                 icon: "play",
        //                 active: true
        //             },
        //             {
        //                 name: "Shuffle",
        //                 icon: "shuffle-variant",
        //                 active: false
        //             },
        //         ]
        //     })
        // } else if(global.music_play_style == "shuffle") {
        //     this.setState({
        //         options: [
        //             {
        //                 name: "Play",
        //                 icon: "play",
        //                 active: false
        //             },
        //             {
        //                 name: "Shuffle",
        //                 icon: "shuffle-variant",
        //                 active: true
        //             },
        //         ]
        //     })
        // }
        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/songs', {
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
                
                for(i = 0; i < data.data.length; i ++) {
                    var artist_name = "";
                    if(data.data[i].artist == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data[i].artist.name;
                    }
                    items.push({
                        id: data.data[i].id,
                        artist: artist_name,
                        title: data.data[i].name,
                        url: global.server_url + data.data[i].audio,
                        artwork: global.server_url + data.data[i].img,
                        db_id: data.data[i].id,
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

    componentDidMount() {
        this.props.navigation.setParams({ onHandleShowModalSort: this.onHandleShowModalSort });

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

    onHandleShowModalSort = () => {
        const { options } = this.state
        this.props.navigation.navigate('SortModal', {
            options
        })
    }

    onPress = async item => {
        await TrackPlayer.reset();

        var track_list = Object.assign([], this.state.items);
        await TrackPlayer.add(track_list);
        await TrackPlayer.skip(String(item.id));
        await TrackPlayer.play()
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
                // global.music_play_style = "play";
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
                // global.music_play_style = "shuffle";
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

    onHandlePlayer = async(items) => {
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
        const { items, options } = this.state
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
                <ScrollView scrollEventThrottle={16}
                    style={STYLES.scrollContainer}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        viewabilityConfig={VIEWABILITY_CONFIG}
                        ListHeaderComponent={
                           <View>
                                <FlatListHeaderButton
                                    onPress={this.onPressOption}
                                    onHideUnderlay={this.onHideUnderlay}
                                    onShowUnderlay={this.onShowUnderlay}
                                    items={options}
                                />
                                <View style={styles.containerInfo}>
                                    <Text style={styles.containerInfo.title}>
                                        {strings.a_collection_of_all_music_recommended_just_for_you_we_hope_you_like_it}
                                    </Text>
                                </View>
                           </View>
                        }
                        removeClippedSubviews
                        data={items}
                        refFlatlist={(ref) => { this.refFlatlist = ref; }}
                        keyExtractor={(item, index) => item + index || item.id || index.toString()}
                        listKey={(index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <MusicVerticalComponent
                                index={index}
                                lastIndex={items.length - 1}
                                item={item}
                                onPress={this.onPress}
                            />
                        )}
                    />
                </ScrollView>
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
export default MusicContainer