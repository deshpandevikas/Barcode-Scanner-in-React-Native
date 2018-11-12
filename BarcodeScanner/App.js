import React, {Component} from 'react';
import {
Platform,
AppRegistry,
StyleSheet,
Button,
Text,
View,
Alert,
Linking,
Vibration,
Dimensions
} from 'react-native';

import { RNCamera } from 'react-native-camera';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
         type: RNCamera.Constants.Type.back,
	       flashMode: RNCamera.Constants.FlashMode.auto,
	       barcodeFinderVisible: false
      }
    };
  }
  onBarCodeRead(scanResult) {
    var upcCode = scanResult.data;
    fetch('https://barcodescannerserver.herokuapp.com/products/' +upcCode, {
            method: 'GET',
            headers: {
               Accept: 'application/json',
              'Content-Type': 'application/json',
            }})
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.data.length!=0) {
        //console.warn(scanResult.data + ' upccode belongs to ' + responseJson.data[0].Name);
        Alert.alert('Result','Success!! ' + scanResult.data + ' upccode belongs to ' + responseJson.data[0].Name,
        [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: true}
      )
      } else {
        //console.warn(scanResult.data + ' does not exist in the database');
        Alert.alert('Result', 'Failure!! ' + scanResult.data + ' does not exist in the database',
      [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
       {text: 'OK', onPress: () => console.log('OK Pressed')},],
       {cancelable: true}
     )
      }
    })
    .catch((error) => { console.error(error); });

    if (scanResult.data != null) {
	  if (!this.barcodeCodes.includes(scanResult.data)) {
	  this.barcodeCodes.push(scanResult.data);
	 // console.warn('onBarCodeRead call');
	}
    }
    return;
  }
  pendingView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Waiting</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
            barcodeFinderWidth={280}
            barcodeFinderHeight={220}
            barcodeFinderBorderColor="white"
            barcodeFinderBorderWidth={2}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            style={styles.preview}
            type={this.state.camera.type}
        />
        <View style={[styles.overlay, styles.topOverlay]}>
	  <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
	</View>
</View>
    );
  }

}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
}
};
