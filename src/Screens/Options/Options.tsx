import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
const {width} = Dimensions.get('screen');
import {Play} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../assets/color';
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {useOrientation} from '../../Templates/Orientation.tsx';

interface OptionsProps {
  onCancelAndRepeat: () => void;
  onVideoPlay: () => void;
  onSave: () => void;
}

const Options: React.FC<OptionsProps> = ({
  onCancelAndRepeat,
  onVideoPlay,
  onSave,
}) => {
  const {t} = useTranslation();
  const ssMode = useOrientation();
  const [, setOrientation] = useState(ssMode);

  /* LIFECYCLE TO SCREEN ORIENTATION LISTENER */
  useEffect(() => {
    lor(setOrientation);
    return () => rol();
  }, []);

  const btnTablet = () => {
    return (
      <View style={styles.btnContainer}>
        <View style={styles.btnSee}>
          <TouchableOpacity
            onPress={onVideoPlay}
            style={[
              styles.btnSeeContainer,
              {
                height: ssMode === 'portrait' ? hp('5.5%') : wp('5%'),
                paddingHorizontal:
                  ssMode === 'portrait' ? hp('1.2%') : wp('3%'),
              },
            ]}>
            <Text
              style={[
                styles.seeLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.5%') : wp('1.8%'),
                },
              ]}>
              {t('see testimonial')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnCancelSave}>
          <TouchableOpacity
            onPress={onCancelAndRepeat}
            style={[
              styles.btnCancelContainer,
              {
                height: ssMode === 'portrait' ? hp('5.5%') : wp('5%'),
                // paddingHorizontal: ssMode === 'portrait' ? 18 : 30,
                paddingHorizontal:
                  ssMode === 'portrait' ? hp('1.2%') : wp('3%'),
              },
            ]}>
            <Text
              style={[
                styles.seeLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.5%') : wp('1.8%'),
                },
              ]}>
              {t('cancel and repeat')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave}
            style={[
              styles.btnCancelContainer,
              {
                height: ssMode === 'portrait' ? hp('5.5%') : wp('5%'),
                marginLeft: ssMode === 'portrait' ? 19 : 36,
                // paddingHorizontal: ssMode === 'portrait' ? 18 : 30,
                paddingHorizontal:
                  ssMode === 'portrait' ? hp('1.2%') : wp('3%'),
              },
            ]}>
            <Text
              style={[
                styles.seeLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.5%') : wp('1.8%'),
                },
              ]}>
              {t('save testimony')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const btnMovile = () => {
    return (
      <View
        style={[
          styles.root,
          {
            flexDirection: ssMode === 'portrait' ? 'column' : 'row',
          },
        ]}>
        <View
          style={[
            styles.root,
            {
              justifyContent: ssMode === 'portrait' ? undefined : 'center',
              alignItems: ssMode === 'portrait' ? undefined : 'flex-start',
            },
          ]}>
          <TouchableOpacity
            onPress={onVideoPlay}
            style={[
              styles.btnCancelContainer,
              {
                height: ssMode === 'portrait' ? '100%' : wp('5%'),
                paddingHorizontal:
                  width < 330 ? 15 : DeviceInfo.hasNotch() ? 20 : 30,
              },
            ]}>
            <Text
              style={[
                styles.seeLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.5%') : wp('1.8%'),
                },
              ]}>
              {t('see testimonial')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: ssMode === 'portrait' ? undefined : 'flex-end',
            alignItems: ssMode === 'portrait' ? undefined : 'center',
            flexDirection: ssMode === 'portrait' ? 'column' : 'row',
            marginTop: ssMode === 'portrait' ? 2 : 0,
          }}>
          <TouchableOpacity
            onPress={onCancelAndRepeat}
            style={[
              styles.btnCancelContainer,
              {
                height: ssMode === 'portrait' ? 0 : wp('5%'),
                flex: ssMode === 'portrait' ? 1 : undefined,
                paddingHorizontal:
                  width < 330 ? 15 : DeviceInfo.hasNotch() ? 20 : 30,
              },
            ]}>
            <Text
              style={[
                styles.seeLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.5%') : wp('1.8%'),
                },
              ]}>
              {t('cancel and repeat')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave}
            style={[
              styles.btnCancelContainer,
              {
                height: ssMode === 'portrait' ? 0 : wp('5%'),
                flex: ssMode === 'portrait' ? 1 : undefined,
                marginLeft:
                  ssMode === 'portrait'
                    ? 0
                    : DeviceInfo.hasNotch()
                    ? '3%'
                    : '6%',
                paddingHorizontal:
                  width < 330 ? 15 : DeviceInfo.hasNotch() ? 20 : 30,
                marginTop: ssMode === 'portrait' ? 2 : 0,
              },
            ]}>
            <Text
              style={[
                styles.seeLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.5%') : wp('1.8%'),
                },
              ]}>
              {t('save testimony')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.root, styles.labelContainer]}>
        <Play />
        <View style={{position: 'absolute'}}>
          <Text
            style={{
              fontSize: ssMode === 'portrait' ? hp('1.8%') : wp('1.9%'),
              marginHorizontal: ssMode === 'portrait' ? hp('4%') : wp('8%'),
              fontFamily: 'Montserrat-Regular',
              textAlign: 'center',
            }}>
            {t(
              `${t(
                'Press “View Testimony” to view the testimony you just recorded.',
              )}\n${t(
                'If you are satisfied with it, click on “Save testimony“ so that we can upload it to our website.',
              )}\n${t(
                "If you don't like how it turned out, press “Cancel and repeat“ and try again :)",
              )}`,
            )}
          </Text>
        </View>
      </View>
      <View
        style={{
          height:
            ssMode === 'portrait'
              ? DeviceInfo.isTablet()
                ? hp('14%')
                : hp('20%')
              : DeviceInfo.isTablet()
              ? wp('12%')
              : wp('10%'),
          marginBottom: DeviceInfo.isTablet()
            ? undefined
            : ssMode === 'portrait'
            ? hp('4%')
            : undefined,
        }}>
        {DeviceInfo.isTablet() ? btnTablet() : btnMovile()}
      </View>
    </View>
  );
};

export default Options;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  label: {
    color: palette.black_1,
    textAlign: 'center',
  },
  labelContainer: {
    backgroundColor: palette.gray_2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  btnSee: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  btnSeeContainer: {
    backgroundColor: palette.black_2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeLabel: {
    color: palette.white_1,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Bold',
  },
  btnCancelSave: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnCancelContainer: {
    backgroundColor: palette.black_2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
