import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {Check} from '../../../assets/images';
import {palette} from '../../../assets/color';
import React, {useEffect, useState} from 'react';
import {sendLogs, sendVideo} from '../../Network';
import {VideoInfo} from '../VideoRecording/VideoRecording';
import {useOrientation} from '../../Templates/Orientation.tsx';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface ScreenMessageProps {
  onBack: () => void;
  pathFinal: VideoInfo;
}

const ScreenMessage: React.FC<ScreenMessageProps> = ({onBack, pathFinal}) => {
  const {t} = useTranslation();
  const ssMode = useOrientation();
  const [end, setEnd] = useState(false);
  const [, setOrientation] = useState(ssMode);

  useEffect(() => {
    lor(setOrientation);
    return () => rol();
  }, []);

  useEffect(() => {
    if (pathFinal.uri !== '') {
      onSendVideo();
    }
  }, [pathFinal]);

  useEffect(() => {
    if (end) {
      setTimeout(() => {
        onBack();
      }, 5000);
    }
  }, [end]);

  const onSendVideo = async () => {
    try {
      const response = await sendVideo(pathFinal);
      setEnd(true);
      onSendLogs(
        'Success',
        `Vídeo envíado exitosamente: ${JSON.stringify(response)}`,
      );
    } catch (error) {
      onSendLogs('Error', `Error al enviar vídeo: ${JSON.stringify(error)}`);
      onBack();
    }
  };

  /* SEND LOGS TO ENDPOINT */
  const onSendLogs = async (type: string, message: string) => {
    try {
      await sendLogs(type, message);
    } catch (error) {}
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: palette.gray_2,
            marginBottom: ssMode === 'portrait' ? hp('4%') : wp('3%'),
          },
        ]}>
        {end ? (
          <View style={[styles.root, styles.container]}>
            <Check />
            <View style={styles.over}>
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: ssMode === 'portrait' ? hp('3%') : wp('3%'),
                    marginHorizontal:
                      ssMode === 'portrait' ? hp('4%') : wp('10%'),
                  },
                ]}>
                {t('Your testimonial has been successfully saved!')}
              </Text>
              <Text
                style={[
                  styles.description,
                  {
                    marginHorizontal:
                      ssMode === 'portrait' ? hp('4%') : wp('10%'),
                    fontSize: ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
                  },
                ]}>
                {t(
                  'Go to www.mysteryman.com/testimonials to see it and share it with your friends and family :)',
                )}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.root, styles.container]}>
            <Text
              style={[
                styles.title,
                {
                  fontSize: ssMode === 'portrait' ? hp('3%') : wp('3%'),
                },
              ]}>
              {t('Preparing your video')}
            </Text>
            <ActivityIndicator
              style={styles.top}
              size={'large'}
              color={palette.black_1}
            />
            <Text
              style={[
                styles.description,
                {
                  marginHorizontal:
                    ssMode === 'portrait' ? hp('4%') : wp('10%'),
                  fontSize: ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
                },
              ]}>
              {t('Once finished we will tell you where you can see it.')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScreenMessage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    backgroundColor: palette.gray_2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  over: {position: 'absolute'},
  top: {marginTop: 24},
  title: {
    color: palette.black_1,
    fontFamily: 'Raleway-SemiBold',
    textAlign: 'center',
  },
  description: {
    color: palette.black_1,
    marginTop: 24,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
});
