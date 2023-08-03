import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../assets/color';
import {useOrientation} from '../../Templates/Orientation.tsx';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import i18n from 'i18next';
import {ES, IT, UK} from '../../../assets/images';

interface LanguageScreenProps {
  onChooseLanguage: () => void;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({onChooseLanguage}) => {
  const {t} = useTranslation();
  const ssMode = useOrientation();

  const languages = [
    {id: 1, label: t('Italian'), key: 'it', flag: '🇮🇹', image: IT},
    {id: 2, label: t('English'), key: 'en', flag: '🇬🇧', image: UK},
    {id: 3, label: t('Spanish'), key: 'es', flag: '🇪🇸', image: ES},
  ];

  const changeLaguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      onChooseLanguage();
    } catch (error) {}
  };

  return (
    <View style={styles.root}>
      <View style={{flexDirection: ssMode === 'portrait' ? 'column' : 'row'}}>
        {languages.map((o, i: number) => {
          return (
            <View key={i}>
              <TouchableOpacity
                onPress={() => changeLaguage(o.key)}
                style={[
                  styles.btnContainer,
                  {
                    height: ssMode === 'portrait' ? hp('19%') : wp('19%'),
                    width: ssMode === 'portrait' ? hp('19%') : wp('19%'),
                    borderRadius: ssMode === 'portrait' ? hp('19%') : wp('19%'),
                    marginBottom: ssMode === 'portrait' ? 18 : 0,
                    marginRight: ssMode === 'portrait' ? 0 : 18,
                  },
                ]}>
                <Image
                  source={o.image}
                  style={{
                    marginTop: 2,
                    flex: 1,
                    height: undefined,
                    width: undefined,
                    overflow: 'hidden',
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    backgroundColor: palette.black_2,
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  flag: {
    color: palette.white_1,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
});
