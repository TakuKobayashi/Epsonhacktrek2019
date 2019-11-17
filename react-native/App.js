/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import axios from 'axios';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Alert, PermissionsAndroid } from 'react-native';

import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import AudioRecord from 'react-native-audio-record';
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";

export default class App extends React.Component {
  //コンストラクタ
  constructor(props) {
    super(props); //必ず呼ぶ
    this.state = {
      isRecording: false,
      isRecordPermissionGranted: false,
      scanedText: 'じゃああの開会式動画編集すればいいだけなのでじゃあちょっとプロジェクトの振り返りということでちょっと今日は1日考えてみましょうかねなんだか前にちょっとね振り返りやりましょうねトイレットペーパー入らない可能性がありますね ウォシュレットあと面白かったのは英語でしゃべって文モーニングモーニング出てこないじゃん出てこないねこれ出てきた形の形の形の形がやってるで待ってますねこれぐらいこれぐらいかなお疲れ様ですか会いしましょうねばーれっとぺーぱー',
      resultImageUrl: null,
    };
    this.setupRecrording();
    this.setupWebsocket();
  }

  setupWebsocket(){
    const ws = new WebSocket('wss://websocketserversample.au-syd.mybluemix.net/');

    ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
    };

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };

    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
    this.websocket = ws;
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
    buttonsContainer: {
      flex: 1,
      justifyContent: 'space-between',
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
            <View style={this.styles.body}>
              <View style={this.styles.sectionContainer}>
                <Text style={this.styles.sectionDescription}>{this.state.scanedText}</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <AwesomeButtonRick width={200} type="secondary" onPress={() => this.switchRecording()} >録音開始</AwesomeButtonRick>
                <AwesomeButtonRick width={200} type="primary" onPress={() => this.sendRecordedSentence()} >送信</AwesomeButtonRick>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  async sendRecordedSentence(){
    const formdata = new FormData();
    formdata.append("sentence", this.state.scanedText)
    const BASE_URL = 'https://189f6480.ngrok.io'
    const response = await axios.post(BASE_URL + '/generate', formdata);
    console.log(response.data.image_url);
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

    const options = {
      channels: 1,
      audioSource: 6,
    };
    const result = AudioRecord.init(options);
    console.log(result)
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
      const result = await AudioRecord.stop();
      this.setState({ isRecording: false });
      console.log(result);
    } else {
      const result = await AudioRecord.start();
      this.setState({ isRecording: true });
      AudioRecord.on('data', (data) => {
        // base64-encoded audio data chunks
        console.log(data);
      });
      console.log(result);

    }
  }
}
