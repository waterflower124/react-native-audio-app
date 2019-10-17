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

import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

import { MinPlayerComponent } from '../../components/player';

import { STYLES, COLORS, FONTS} from '../../themes'
import styles_setting from './styles/setting.style';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};



class PaymentContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: "Credit Card",
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
            isReady: false,

            showIndicator: false,

            card_data: {},
            credit_number: '4242414141414141',
            credit_expiry: '12/23',
            credit_cvc: '833'
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ onHandleShowModalSort: this.onHandleShowModalSort });

        this.refs.credit_card_ref.setValues({number: this.state.credit_number});
        // this.refs.credit_card_ref.focus("expiry");
        // this.refs.credit_card_ref.setValues({expiry: this.state.credit_expiry});
        // this.refs.credit_card_ref.setValues({cvv: this.state.credit_cvc});
    }

    onHandleShowModalSort = () => {
        const { options } = this.state
        this.props.navigation.navigate('SortModal', {
            options
        })
    }

    _onChange = (formData) => {
        this.setState({
            card_data: formData
        })
        // console.warn(JSON.stringify(formData, null, " "))
    };

    register_card = async() => {
        // console.warn(this.state.card_data);
        var card_data = this.state.card_data;
        if(!card_data.valid) {
            Alert.alert("Warning!", "Please input valid data.");
            return;
        }
    }
    

    render() {
        const { items, search } = this.state
        return (
            <SafeAreaView style={[STYLES.container, {alignItems: 'center'}]}>
            {
                this.state.showIndicator &&
                <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.3, zIndex: 100}}>
                    <View style = {{flex: 1}}>
                        <SkypeIndicator color = '#ffffff' />
                    </View>
                </View>
            }
                <ScrollView scrollEventThrottle={16}
                    style={[STYLES.scrollContainer, {width: '90%'}]}>
                    <CreditCardInput
                        ref = 'credit_card_ref'
                        onChange={this._onChange} 
                        allowScroll = {true}
                        inputStyle = {{color:'#ffffff'}} 
                        labelStyle = {{color: '#ffffff'}}
                        inputContainerStyle = {{borderBottomWidth: 1, borderBottomColor: '#808080'}}/>
                    <View style = {{width: '100%', height: 40, marginTop: 40, alignItems: 'center'}}>
                        <TouchableOpacity style = {{width: '80%', height: '100%', borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.register_card()}>
                            <Text style = {{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold}}>Register Card</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <MinPlayerComponent/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

});


export default PaymentContainer