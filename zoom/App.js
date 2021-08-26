import React from 'react';

import {View, Text, ScrollView} from 'react-native';
import {joinRoom} from './src/actions/VideoActions';
import {connect} from 'react-redux';
import 'react-native-gesture-handler';

import {RTCPeerConnection, mediaDevices, RTCView} from 'react-native-webrtc';
import {windowHeight, windowWidth} from './src/utils/Dimesions';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    const pc = new RTCPeerConnection(configuration);

    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then((stream) => {
          console.log(stream);
          this.props.joinRoom(stream);
        })
        .catch((error) => {
          // Log error
        });
    });

    // also support setRemoteDescription, createAnswer, addIceCandidate, onnegotiationneeded, oniceconnectionstatechange, onsignalingstatechange, onaddstream
  }

  render() {
    const {streams} = this.props.video;
    console.log(streams, this.props.video);

    return (
      <View style={{flex: 1, justifyContent: 'flex-start', padding: 10}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            borderColor: 'yellow',
            borderWidth: 4,
            height: windowHeight * 0.5,
          }}>
          {this.props.video.myStream ? (
            <RTCView
              streamURL={this.props.video.myStream.toURL()} 
              style={{
                height: windowHeight * 0.4,
                width: windowWidth,
              }}
            />
          ) : null}
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
          }}>
          <ScrollView horizontal style={{padding: 10}}>
            <>
              {streams.length > 0 ? (
                <>
                  {streams.map((stream, index) => (
                    <View
                      key={index}
                      style={{
                        width: 280,
                        backgroundColor: 'red',
                        borderWidth: 1,
                        borderColor: '#fff',
                        marginRight: 10,
                        padding: 5,
                      }}>
                      <RTCView
                        streamURL={stream.toURL()}
                        style={{
                          height: windowHeight * 0.4,
                          width: 180,
                        }}
                      />
                    </View>
                  ))}
                </>
              ) : null}
            </>
            <>
              <View
                style={{
                  width: 280,
                  backgroundColor: 'blue',
                  borderWidth: 1,
                  borderColor: '#fff',
                  marginRight: 10,
                  padding: 5,
                }}></View>
            </>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({video}) => ({
  video,
});
export default connect(mapStateToProps, {joinRoom})(App);
