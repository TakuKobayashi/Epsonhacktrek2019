/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Alert } from 'react-native';

import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { AudioRecorder, AudioUtils } from 'react-native-audio';

export default class App extends React.Component {
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
            <Button title="Press me" onPress={() => Alert.alert('Simple Button pressed')} />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  switchRecording() {}
}
