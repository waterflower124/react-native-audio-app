/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  YellowBox,
  BackHandler,
    Alert
} from 'react-native';

import RootContainer from './app/containers';

YellowBox.ignoreWarnings(["Warning:"]);
YellowBox.ignoreWarnings(["`-[RCTRootView cancelTouches]`"]);
YellowBox.ignoreWarnings(["VirtualizedLists"]);
YellowBox.ignoreWarnings(["RCTUIManager"]);

// function getActiveRouteName(navigationState) {
// 	if (!navigationState) {
// 		return null;
// 	}
// 	const route = navigationState.routes[navigationState.index];
// 	// dive into nested navigators
// 	// console.warn(route);
// 	if (route.routes) {
// 		return getActiveRouteName(route);
// 	}
//   	return route.routeName;
// }

// export default class App extends Component {

//     constructor(props) {
//         super(props);

//     }

//     componentDidMount() {
//         this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        
//     };

//     handleBackButton = () => {
// 		Alert.alert('Notice!', 'Do you really want to exit?',
// 			[
// 				{text: 'Cancel', onPress: null},
// 				{text: 'Ok', onPress: () => BackHandler.exitApp()}
// 			],
// 			{ cancelable: true }
// 		);
// 		return true;
		
//     };

//     render() {
//         return(
//             <RootContainer
//                 onNavigationStateChange={(prevState, currentState) => {
//                     const currentScreen = getActiveRouteName(currentState);
// 					if(currentScreen == 'Login' || currentScreen == 'LibraryStack') {
//                         this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
                        
//                     } else {
//                         this.backButtonListener.remove();
//                     }
//                     // console.warn(currentScreen);
//                 }}
//             />
//         )
//     }
// }

export default class App extends React.Component {
    render() {
        return (<RootContainer />);
    }
}


// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
