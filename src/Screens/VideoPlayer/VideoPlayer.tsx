import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../assets/color';
import React, {useEffect, useRef, useState} from 'react';
import {useOrientation} from '../../Templates/Orientation.tsx';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface VideoPlayerProps {
  onBack: () => void;
  path: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({onBack, path}) => {
  const {t} = useTranslation();
  const ssMode = useOrientation();
  const videoRef = useRef<Video>(null);
  const [, setOrientation] = useState(ssMode);
  useEffect(() => {
    lor(setOrientation);
    return () => rol();
  }, []);
  return (
    <View style={styles.root}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: palette.gray_2,
          },
        ]}>
        <Video
          source={{uri: path}}
          ref={videoRef}
          style={styles.root}
          resizeMode="cover"
          fullscreen={false}
          onEnd={onBack}
        />
      </View>
      <View
        style={[
          styles.center,
          {
            height: ssMode === 'portrait' ? hp('13%') : wp('10%'),
            backgroundColor: palette.gray_1,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            onBack();
          }}
          style={{
            backgroundColor: palette.black_2,
            paddingHorizontal: ssMode === 'portrait' ? hp('5%') : wp('5%'),
            paddingVertical: ssMode === 'portrait' ? hp('2%') : wp('1.5%'),
          }}>
          <Text
            style={[
              styles.btnLabel,
              {
                fontSize: ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
              },
            ]}>
            {t('go back')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    color: palette.white_1,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
});
