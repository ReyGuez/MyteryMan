import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {Play} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../assets/color';
import React, {useEffect, useState} from 'react';
import {useOrientation} from '../../Templates/Orientation.tsx';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface HomeProps {
  onRecord: () => void;
}

const Home: React.FC<HomeProps> = ({onRecord}) => {
  const {t} = useTranslation();
  const ssMode = useOrientation();
  const [, setOrientation] = useState(ssMode);
  useEffect(() => {
    lor(setOrientation);
    return () => rol();
  }, []);
  return (
    <View style={styles.root}>
      <View style={[styles.root, styles.container, styles.center]}>
        <Play />
        <View style={{position: 'absolute'}}>
          <Text
            style={[
              styles.title,
              {
                fontSize: ssMode === 'portrait' ? hp('3%') : wp('3%'),
                marginHorizontal: ssMode === 'portrait' ? hp('4%') : wp('10%'),
              },
            ]}>
            {t('Share your experience!')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                marginHorizontal: ssMode === 'portrait' ? hp('4%') : wp('10%'),
                fontSize: ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
              },
            ]}>
            {t(
              'Record your 30-second testimonial and we will upload it to the web to share it with thousands of people :)',
            )}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.center,
          {
            height: ssMode === 'portrait' ? hp('13%') : wp('10%'),
          },
        ]}>
        <TouchableOpacity
          onPress={onRecord}
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
            {t('Record testimony')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: palette.gray_2,
  },
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
  btnLabel: {
    color: palette.white_1,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
});
