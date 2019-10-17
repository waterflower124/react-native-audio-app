import React, { Component } from 'react';
import { FlatList, 
    SafeAreaView, 
    ScrollView, 
    View, 
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { SearchBar } from 'react-native-elements';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';

import { MinPlayerComponent } from '../../components/player';

import { STYLES, COLORS, FONTS} from '../../themes'
import styles_setting from './styles/setting.style';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};

const picker_options = {
    title: 'Select avtar...',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    takePhotoButtonTitle: 'Select from camera',
    chooseFromLibraryButtonTitle: 'Select from Library',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
        width: '100%',
        height: '100%',
        aspect: [1, 1],
    },
};

class MyAccountContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: "My Account",
            headerRight: (<View style={STYLES.headerContainer}>
                <TouchableOpacity onPress={() => params.onHandleShowModalSort()}>
                    <Icon name="list" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
            </View>) 
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            avatar_url: '',
            isDateTimePickerVisible: false,
            email: '',
            password: '',
            gender: 'Male',
            birthday: '',
            country: '',
            display_name: '',

            gender_view_show: false,


            search:'',
            items: [
                {
                    name: "Breathe",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/125sz5.jpg"
                },
                {
                    name: "Stay as you are",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/126sz5.jpg"
                },
                {
                    name: "Shooting Star",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/127sz5.jpg"
                },
                {
                    name: "Something",
                    picture: "https://is2-ssl.mzstatic.com/image/thumb/Music124/v4/91/f0/95/91f09528-2155-6a1d-45c0-0208e8efe059/886447489642.jpg/1024x0w.jpg"
                },
                {
                    name: "Alone Together",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/131sz5.jpg"
                }
            ]
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({ onHandleShowModalSort: this.onHandleShowModalSort });
    }
    onHandleShowModalSort = () => {
        const { options } = this.state
        this.props.navigation.navigate('SortModal', {
            options
        })
    }
    // onPress = item => {
    //     console.log("item==", item)
    // }
    // updateSearch = search => {
    //     this.setState({ search });
    // };
    // onHandlePlayer = items => {
    //     this.props.navigation.navigate('Player')
    // }

    avatar_selecet_alert() {
        ImagePicker.showImagePicker(picker_options, (response) => {
            const {error, uri, originalRotation} = response;
            if (response.didCancel) {
                console.log('image picker cancelled');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({avatar_url: response.uri});
                
            }
        });
    }

    showDateTimePicker = () => {
        this.setState({ 
            isDateTimePickerVisible: true,
        });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        // console.warn("A date has been picked: ", date);
        
        this.setState({
            birthday: moment(date).format("YYYY-MM-DD"),
            birthday_date: date
        })
        
        this.hideDateTimePicker();
    }

    select_gender(gender) {
        this.setState({
            gender: gender,
            gender_view_show: false
        })
    }

    render() {
        const { items, search } = this.state
        return (
            <SafeAreaView style={[STYLES.container, {alignItems: 'center'}]}>
                <KeyboardAwareScrollView scrollEventThrottle={16}
                    style={[STYLES.scrollContainer, {width: '90%'}]}>
                        <View style = {{width: '100%', height: 150, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{height: '80%', aspectRatio: 1, borderRadius: 150,  overflow: 'hidden'}} onPress = {() => this.avatar_selecet_alert()}>
                            {
                                this.state.avatar_url == "" &&
                                <Image style = {{height: '100%', aspectRatio: 1}} resizeMode = {'cover'} source = {require('../../images/avatar.png')}/>
                            }
                            {
                                this.state.avatar_url != "" &&
                                <Image style = {{height: '100%', aspectRatio: 1}} resizeMode = {'cover'} source = {{uri: this.state.avatar_url}}/>
                            }  
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            mode = {'date'}
                            date = {this.state.birthday == "" ? new Date() : this.state.birthday_date}
                        />
                        <View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Email</Text>
                            </View>
                            <View style = {styles.input_text_view}>
                                <TextInput style = {styles.input_text} placeholder = {'Email'} onChangeText = {(text) => this.setState({email: text})}></TextInput>
                            </View>
                        </View>
                        <View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Password</Text>
                            </View>
                            <View style = {styles.input_text_view}>
                                <TextInput style = {styles.input_text} placeholder = {'Password'} secureTextEntry = {true} onChangeText = {(text) => this.setState({password: text})}></TextInput>
                            </View>
                        </View>
                        <View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Confirm Password</Text>
                            </View>
                            <View style = {styles.input_text_view}>
                                <TextInput style = {styles.input_text} placeholder = {'Confirm Password'} secureTextEntry = {true} onChangeText = {(text) => this.setState({confirm: text})}></TextInput>
                            </View>
                        </View>
                        <View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Display Name</Text>
                            </View>
                            <View style = {styles.input_text_view}>
                                <TextInput style = {styles.input_text} placeholder = {'Display Name'} onChangeText = {(text) => this.setState({display_name: text})}></TextInput>
                            </View>
                        </View>
                        <View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Country</Text>
                            </View>
                            <View style = {styles.input_text_view}>
                                <TextInput style = {styles.input_text} placeholder = {'Country'} onChangeText = {(text) => this.setState({country: text})}></TextInput>
                            </View>
                        </View><View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Gender</Text>
                            </View>
                            {/* <View style = {styles.input_text_view}>
                                <TextInput style = {styles.input_text} placeholder = {'Gender'}></TextInput>
                            </View> */}
                            <TouchableOpacity style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222'}]} onPress = {() => this.setState({gender_view_show: true})}>
                                <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>{this.state.gender}</Text>
                            </TouchableOpacity>
                        {
                            this.state.gender_view_show &&
                            <View style = {{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRadius: 5, backgroundColor: '#222222'}}>
                                <TouchableOpacity style = {{width: '100%', height: '50%', justifyContent: 'center',}} onPress = {() => this.select_gender('Male')}>
                                    <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{width: '100%', height: '50%', justifyContent: 'center',}} onPress = {() => this.select_gender('Female')}>
                                    <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>Female</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        </View>
                        <View style = {styles.input_component}>
                            <View style = {styles.input_comment}>
                                <Text style = {styles.comment_text}>Birthday</Text>
                            </View>
                            <TouchableOpacity style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222'}]} onPress = {() => this.showDateTimePicker()}>
                                <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5}}>{this.state.birthday}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style = {{width: '100%', height: 40, marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 5}}>
                            <Text style = {[{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold,}]}>Change My Account</Text>
                        </TouchableOpacity>
                    {/* <FlatList
                        showsHorizontalScrollIndicator={false}
                        viewabilityConfig={VIEWABILITY_CONFIG}
                        removeClippedSubviews
                        data={items}
                        refFlatlist={(ref) => { this.refFlatlist = ref; }}
                        keyExtractor={(item, index) => item + index || item.id || index.toString()}
                        listKey={(index) => index.toString()}
                        ListHeaderComponent={
                            <View style={{marginBottom: 15}}>
                                <SearchBar
                                    round={true}
                                    lightTheme={false}
                                    containerStyle={{ backgroundColor: COLORS.backgroundColor }}
                                    placeholder="Search"
                                    onChangeText={this.updateSearch}
                                    value={search}
                                />
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <ArtistVerticalComponent
                                index={index}
                                lastIndex={items.length - 1}
                                item={item}
                                onPress={this.onPress}
                            />
                        )}
                        numColumns={1}
                    /> */}
                </KeyboardAwareScrollView>
                <MinPlayerComponent/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#000000',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // safe_area: {
    //     width: '90%',
    //     height: safearea_height,
    //     alignItems: 'center',
    //     marginTop: top_inset,
    //     marginBottom: bottom_inset,
    // },
    input_component: {
        width: '100%', 
        height: 70, 
        marginBottom: 20
    },
    input_comment: {
        width: '100%', 
        height: '40%', 
        justifyContent: 'center'
    },
    comment_text: {
        fontSize: 14, 
        color: '#808080',
        fontFamily: FONTS.type.Regular
    },
    input_text_view: {
        width: '100%', 
        height: '60%', 
        justifyContent: 'center',

    },
    input_text: {
        width: '100%', 
        height: '100%', 
        fontSize: 16, 
        color: '#ffffff', 
        backgroundColor: '#222222', 
        paddingLeft: 5, 
        borderRadius: 5,
        fontFamily: FONTS.type.Regular
    }
});


export default MyAccountContainer