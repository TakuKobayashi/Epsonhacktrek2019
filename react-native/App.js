/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Alert, PermissionsAndroid } from 'react-native';

import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import Voice from 'react-native-voice';
//import { AudioRecorder, AudioUtils } from 'react-native-audio';

export default class App extends React.Component {
  //コンストラクタ
  constructor(props) {
    super(props); //必ず呼ぶ
    this.state = {
      isRecording: false,
      isRecordPermissionGranted: false,
    };
    this.setupRecrording();
  }

  styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: Colors.white,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={this.styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={this.styles.engine}>
                <Text style={this.styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={this.styles.body}>
              <View style={this.styles.sectionContainer}>
                <Text style={this.styles.sectionTitle}>Step One</Text>
                <Text style={this.styles.sectionDescription}>
                  Edit <Text style={this.styles.highlight}>App.js</Text> to change this screen and then come back to see your edits.
                </Text>
              </View>
              <View style={this.styles.sectionContainer}>
                <Text style={this.styles.sectionTitle}>See Your Changes</Text>
                <Text style={this.styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={this.styles.sectionContainer}>
                <Text style={this.styles.sectionTitle}>Debug</Text>
                <Text style={this.styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={this.styles.sectionContainer}>
                <Text style={this.styles.sectionTitle}>Learn More</Text>
                <Text style={this.styles.sectionDescription}>Read the docs to discover what to do next:</Text>
              </View>
              <LearnMoreLinks />
            </View>
            <Button title="Press me" onPress={() => this.switchRecording()} />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  async checkRecordPermissionRoutine() {
    const isAuthorized = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    console.log(isAuthorized);
    if (isAuthorized) {
      return true;
    } else {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    }
  }

  async setupRecrording() {
    const isAgree = await this.checkRecordPermissionRoutine();
    this.setState({ isRecordPermissionGranted: isAgree });
    if (!isAgree) {
      return false;
    }
    Voice.onSpeechStart = (event) => {
      console.log(event);
    };
    Voice.onSpeechEnd = (event) => {
      console.log(event);
    };
    Voice.onSpeechResults = (event) => {
      console.log(event);
    };
    /*
    const audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';

    const prepareResult = await AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
    });
    console.log(prepareResult);

    const audioProgress = (AudioRecorder.onProgress = (data) => {
      console.log(data);
    });
 */
    return true;
  }

  async switchRecording() {
    if (!this.state.isRecordPermissionGranted) {
      const isSetupSuccess = await this.setupRecrording();
      if (!isSetupSuccess) {
        Alert.alert('まずは録音できるようにしようか?');
        return false;
      }
    }
    console.log('press');
    if (this.state.isRecording) {
      this.setState({ isRecording: false });
      const result = await Voice.start('ja-JP');
      console.log(result);
      //return await AudioRecorder.stopRecording();
    } else {
      this.setState({ isRecording: true });
      const result = await Voice.stop();
      console.log(result);
      //return await AudioRecorder.startRecording();
    }
  }
}
