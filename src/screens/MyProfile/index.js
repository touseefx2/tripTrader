import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Modal as MModal,
  Pressable,
} from 'react-native';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';

import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';

import {TabView, SceneMap} from 'react-native-tab-view';
import Reviews from './Reviews';
import Trips from './Trips';
import Photos from './Photos';

export default observer(MyProfile);

const Countries = [
  {
    ru: 'Афганистан',
    lt: 'Afganistanas',
    tr: 'Afganistan',
    en: 'Afghanistan',
    flag: '🇦🇫',
    code: 'AF',
    dialCode: '+93',
    mask: '999 999 9999',
  },
  {
    ru: 'Аландские острова',
    lt: 'Alandų salos',
    tr: 'Aland adaları',
    en: 'Åland Islands',
    flag: '🇦🇽',
    code: 'AX',
    dialCode: '+358',
    mask: '999 9999999',
  },
  {
    ru: 'Албания',
    lt: 'Albanija',
    tr: 'Arnavutluk',
    en: 'Albania',
    flag: '🇦🇱',
    code: 'AL',
    dialCode: '+355',
    mask: '999 999 9999',
  },
  {
    ru: 'Алжир',
    lt: 'Alžyras',
    tr: 'Cezayir',
    en: 'Algeria',
    flag: '🇩🇿',
    code: 'DZ',
    dialCode: '+213',
    mask: '9999 99 99 99',
  },
  {
    ru: 'американское Самоа',
    lt: 'Amerikos Samoa',
    tr: 'Amerikan Samoası',
    en: 'American Samoa',
    flag: '🇦🇸',
    code: 'AS',
    dialCode: '+1684',
    mask: '(999) 999-9999',
  },
  {
    ru: 'андорра',
    lt: 'Andora',
    tr: 'Andorra',
    en: 'Andorra',
    flag: '🇦🇩',
    code: 'AD',
    dialCode: '+376',
    mask: '999 999',
  },
  {
    ru: 'Ангола',
    lt: 'Angoloje',
    tr: 'Angora',
    en: 'Angola',
    flag: '🇦🇴',
    code: 'AO',
    dialCode: '+244',
    mask: '999 999 999',
  },
  {
    ru: 'Ангилья',
    lt: 'Angilija',
    tr: 'Anguilla',
    en: 'Anguilla',
    flag: '🇦🇮',
    code: 'AI',
    dialCode: '+1264',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Антигуа и Барбуда',
    lt: 'Antigva ir Barbuda',
    tr: 'Antigua ve Barbuda',
    en: 'Antigua and Barbuda',
    flag: '🇦🇬',
    code: 'AG',
    dialCode: '+1268',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Аргентина',
    lt: 'Argentina',
    tr: 'Arjantin',
    en: 'Argentina',
    flag: '🇦🇷',
    code: 'AR',
    dialCode: '+54',
    mask: '999 99-9999-9999',
  },
  {
    ru: 'Армения',
    lt: 'Armėnija',
    tr: 'Ermenistan',
    en: 'Armenia',
    flag: '🇦🇲',
    code: 'AM',
    dialCode: '+374',
    mask: '999 999999',
  },
  {
    ru: 'Аруба',
    lt: 'Aruba',
    tr: 'Aruba',
    en: 'Aruba',
    flag: '🇦🇼',
    code: 'AW',
    dialCode: '+297',
    mask: '999 9999',
  },
  {
    ru: 'Австралия',
    lt: 'Australija',
    tr: 'Avustralya',
    en: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    dialCode: '+61',
    mask: '9999 999 999',
  },
  {
    ru: 'Австрия',
    lt: 'Austrijoje',
    tr: 'Avusturya',
    en: 'Austria',
    flag: '🇦🇹',
    code: 'AT',
    dialCode: '+43',
    mask: '9999 999999',
  },
  {
    ru: 'Азербайджан',
    lt: 'Azerbaidžanas',
    tr: 'Azerbeycan',
    en: 'Azerbaijan',
    flag: '🇦🇿',
    code: 'AZ',
    dialCode: '+994',
    mask: '999 999 99 99',
  },
  {
    ru: 'Багамские о-ва',
    lt: 'Bahamos',
    tr: 'Bahamalar',
    en: 'Bahamas',
    flag: '🇧🇸',
    code: 'BS',
    dialCode: '+1242',
    mask: '(999) 999-999',
  },
  {
    ru: 'Бахрейн',
    lt: 'Bahreinas',
    tr: 'Bahreyn',
    en: 'Bahrain',
    flag: '🇧🇭',
    code: 'BH',
    dialCode: '+973',
    mask: '9999 9999',
  },
  {
    ru: 'Бангладеш',
    lt: 'Bangladešas',
    tr: 'Bangladeş',
    en: 'Bangladesh',
    flag: '🇧🇩',
    code: 'BD',
    dialCode: '+880',
    mask: '99999-999999',
  },
  {
    ru: 'Барбадос',
    lt: 'Barbadosas',
    tr: 'Barbados',
    en: 'Barbados',
    flag: '🇧🇧',
    code: 'BB',
    dialCode: '+1246',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Беларусь',
    lt: 'Baltarusija',
    tr: 'Belarus',
    en: 'Belarus',
    flag: '🇧🇾',
    code: 'BY',
    dialCode: '+375',
    mask: '9 999 999-99-99',
  },
  {
    ru: 'Бельгия',
    lt: 'Belgija',
    tr: 'Belçika',
    en: 'Belgium',
    flag: '🇧🇪',
    code: 'BE',
    dialCode: '+32',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Белиз',
    lt: 'Belizas',
    tr: 'Belize',
    en: 'Belize',
    flag: '🇧🇿',
    code: 'BZ',
    dialCode: '+501',
    mask: '999-9999',
  },
  {
    ru: 'Бенин',
    lt: 'Beninas',
    tr: 'Benin',
    en: 'Benin',
    flag: '🇧🇯',
    code: 'BJ',
    dialCode: '+229',
    mask: '99 99 99 99',
  },
  {
    ru: 'Бермудские острова',
    lt: 'Bermudai',
    tr: 'Bermuda',
    en: 'Bermuda',
    flag: '🇧🇲',
    code: 'BM',
    dialCode: '+1441',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Бутан',
    lt: 'Butanas',
    tr: 'Butan',
    en: 'Bhutan',
    flag: '🇧🇹',
    code: 'BT',
    dialCode: '+975',
    mask: '99 99 99 99',
  },
  {
    ru: 'Боливия, Многонациональное Государство Боливия',
    lt: 'Bolivija, Bolivijos daugiakalbė valstybė',
    tr: 'Bolivya, Bolivya Çokuluslu Devleti',
    en: 'Bolivia, Plurinational State of bolivia',
    flag: '🇧🇴',
    code: 'BO',
    dialCode: '+591',
    mask: '99999999',
  },
  {
    ru: 'Босния и Герцеговина',
    lt: 'Bosnija ir Hercegovina',
    tr: 'Bosna Hersek',
    en: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    code: 'BA',
    dialCode: '+387',
    mask: '999 999 999',
  },
  {
    ru: 'Ботсвана',
    lt: 'Botsvana',
    tr: 'Botsvana',
    en: 'Botswana',
    flag: '🇧🇼',
    code: 'BW',
    dialCode: '+267',
    mask: '99 999 999',
  },
  {
    ru: 'Остров Буве',
    lt: 'Bouvet sala',
    tr: 'Bouvet Adası',
    en: 'Bouvet Island',
    flag: '🇧🇻',
    code: 'BV',
    dialCode: '+47',
    mask: '(99) 99999-9999',
  },
  {
    ru: 'Бразилия',
    lt: 'Brazilija',
    tr: 'Brezilya',
    en: 'Brazil',
    flag: '🇧🇷',
    code: 'BR',
    dialCode: '+55',
    mask: '(99) 99999 9999',
  },
  {
    ru: 'Британская территория Индийского океана',
    lt: 'Britanijos Indijos vandenyno teritorija',
    tr: 'Britanya Hint Okyanusu Toprakları',
    en: 'British Indian Ocean Territory',
    flag: '🇮🇴',
    code: 'IO',
    dialCode: '+246',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Бруней-Даруссалам',
    lt: 'Brunėjaus Darusalamas',
    tr: 'Brunei Sultanlığı',
    en: 'Brunei Darussalam',
    flag: '🇧🇳',
    code: 'BN',
    dialCode: '+673',
    mask: '999 9999',
  },
  {
    ru: 'Болгария',
    lt: 'Bulgarija',
    tr: 'Bulgaristan',
    en: 'Bulgaria',
    flag: '🇧🇬',
    code: 'BG',
    dialCode: '+359',
    mask: '999 999 999',
  },
  {
    ru: 'Буркина-Фасо',
    lt: 'Burkina Fasas',
    tr: 'Burkina Faso',
    en: 'Burkina Faso',
    flag: '🇧🇫',
    code: 'BF',
    dialCode: '+226',
    mask: '99 99 99 99',
  },
  {
    ru: 'Бурунди',
    lt: 'Burundis',
    tr: 'Burundi',
    en: 'Burundi',
    flag: '🇧🇮',
    code: 'BI',
    dialCode: '+257',
    mask: '99 99 99 99',
  },
  {
    ru: 'Камбоджа',
    lt: 'Kambodža',
    tr: 'Kamboçya',
    en: 'Cambodia',
    flag: '🇰🇭',
    code: 'KH',
    dialCode: '+855',
    mask: '999 999 999',
  },
  {
    ru: 'Камерун',
    lt: 'Kamerūnas',
    tr: 'Kamerun',
    en: 'Cameroon',
    flag: '🇨🇲',
    code: 'CM',
    dialCode: '+237',
    mask: '9 99 99 99 99',
  },
  {
    ru: 'Канада',
    lt: 'Kanada',
    tr: 'Kanada',
    en: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
    dialCode: '+1',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Кабо-Верде',
    lt: 'Žaliasis Kyšulys',
    tr: 'Yeşil Burun Adaları',
    en: 'Cape Verde',
    flag: '🇨🇻',
    code: 'CV',
    dialCode: '+238',
    mask: '999 99 99',
  },
  {
    ru: 'Каймановы острова',
    lt: 'Kaimanų salos',
    tr: 'Cayman Adaları',
    en: 'Cayman Islands',
    flag: '🇰🇾',
    code: 'KY',
    dialCode: '+345',
    mask: '999 9999',
  },
  {
    ru: 'Центрально-Африканская Республика',
    lt: 'Centrine Afrikos Respublika',
    tr: 'Orta Afrika Cumhuriyeti',
    en: 'Central African Republic',
    flag: '🇨🇫',
    code: 'CF',
    dialCode: '+236',
    mask: '99 99 99 99',
  },
  {
    ru: 'Чад',
    lt: 'Čadas',
    tr: 'Çad',
    en: 'Chad',
    flag: '🇹🇩',
    code: 'TD',
    dialCode: '+235',
    mask: '99 99 99 99',
  },
  {
    ru: 'Чили',
    lt: 'Čilė',
    tr: 'Şili',
    en: 'Chile',
    flag: '🇨🇱',
    code: 'CL',
    dialCode: '+56',
    mask: '(9) 9999 9999',
  },
  {
    ru: 'Китай',
    lt: 'Kinija',
    tr: 'Çin',
    en: 'China',
    flag: '🇨🇳',
    code: 'CN',
    dialCode: '+86',
    mask: '999 9999 9999',
  },
  {
    ru: 'Остров Рождества',
    lt: 'Kalėdų sala',
    tr: 'Noel Adası',
    en: 'Christmas Island',
    flag: '🇨🇽',
    code: 'CX',
    dialCode: '+61',
    mask: '9999 999 999',
  },
  {
    ru: 'Кокосовые (Килинг) острова',
    lt: 'Kokosų (Kylingo) salos',
    tr: 'Cocos (Keeling) Adaları',
    en: 'Cocos (Keeling) Islands',
    flag: '🇨🇨',
    code: 'CC',
    dialCode: '+61',
    mask: '9999 999 999',
  },
  {
    ru: 'Колумбия',
    lt: 'Kolumbija',
    tr: 'Kolombiya',
    en: 'Colombia',
    flag: '🇨🇴',
    code: 'CO',
    dialCode: '+57',
    mask: '999 9999999',
  },
  {
    ru: 'Коморские острова',
    lt: 'Komorai',
    tr: 'Komorlar',
    en: 'Comoros',
    flag: '🇰🇲',
    code: 'KM',
    dialCode: '+269',
    mask: '999 99 99',
  },
  {
    ru: 'Конго',
    lt: 'Kongas',
    tr: 'Kongo',
    en: 'Congo',
    flag: '🇨🇬',
    code: 'CG',
    dialCode: '+242',
    mask: '9999 999 999',
  },
  {
    ru: 'Конго, Демократическая Республика Конго',
    lt: 'Kongo Demokratinė Kongo Respublika',
    tr: 'Kongo, Demokratik Kongo Cumhuriyeti',
    en: 'Congo, The Democratic Republic of the Congo',
    flag: '🇨🇩',
    code: 'CD',
    dialCode: '+243',
    mask: '99 999 9999',
  },
  {
    ru: 'Острова Кука',
    lt: 'Kuko salos',
    tr: 'Cook Adaları',
    en: 'Cook Islands',
    flag: '🇨🇰',
    code: 'CK',
    dialCode: '+682',
    mask: '99 999',
  },
  {
    ru: 'Коста Рика',
    lt: 'Kosta Rika',
    tr: 'Kosta Rika',
    en: 'Costa Rica',
    flag: '🇨🇷',
    code: 'CR',
    dialCode: '+506',
    mask: '9999 9999',
  },
  {
    ru: 'Берег Слоновой Кости',
    lt: 'Dramblio Kaulo Krantas',
    tr: 'Fildişi Sahili',
    en: "Cote d'Ivoire",
    flag: '🇨🇮',
    code: 'CI',
    dialCode: '+225',
    mask: '99 99 99 99',
  },
  {
    ru: 'Хорватия',
    lt: 'Kroatija',
    tr: 'Hırvatistan',
    en: 'Croatia',
    flag: '🇭🇷',
    code: 'HR',
    dialCode: '+385',
    mask: '999 999 9999',
  },
  {
    ru: 'Куба',
    lt: 'Kuba',
    tr: 'Küba',
    en: 'Cuba',
    flag: '🇨🇺',
    code: 'CU',
    dialCode: '+53',
    mask: '99 9999999',
  },
  {
    ru: 'Кипр',
    lt: 'Kipras',
    tr: 'Kıbrıs',
    en: 'Cyprus',
    flag: '🇨🇾',
    code: 'CY',
    dialCode: '+357',
    mask: '99 999999',
  },
  {
    ru: 'Республика Чехия',
    lt: 'Čekijos Respublika',
    tr: 'Çek Cumhuriyeti',
    en: 'Czech Republic',
    flag: '🇨🇿',
    code: 'CZ',
    dialCode: '+420',
    mask: '999 999 999',
  },
  {
    ru: 'Дания',
    lt: 'Danija',
    tr: 'Danimarka',
    en: 'Denmark',
    flag: '🇩🇰',
    code: 'DK',
    dialCode: '+45',
    mask: '99 99 99 99',
  },
  {
    ru: 'Джибути',
    lt: 'Džibutis',
    tr: 'Cibuti',
    en: 'Djibouti',
    flag: '🇩🇯',
    code: 'DJ',
    dialCode: '+253',
    mask: '99 99 99 99',
  },
  {
    ru: 'Доминика',
    lt: 'Dominika',
    tr: 'Dominika',
    en: 'Dominica',
    flag: '🇩🇲',
    code: 'DM',
    dialCode: '+1767',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Эквадор',
    lt: 'Ekvadoras',
    tr: 'Ekvador',
    en: 'Ecuador',
    flag: '🇪🇨',
    code: 'EC',
    dialCode: '+593',
    mask: '999 999 9999',
  },
  {
    ru: 'Египет',
    lt: 'Egiptas',
    tr: 'Mısır',
    en: 'Egypt',
    flag: '🇪🇬',
    code: 'EG',
    dialCode: '+20',
    mask: '9999 999 9999',
  },
  {
    ru: 'Сальвадор',
    lt: 'Salvadoras',
    tr: 'El Salvador',
    en: 'El Salvador',
    flag: '🇸🇻',
    code: 'SV',
    dialCode: '+503',
    mask: '9999 9999',
  },
  {
    ru: 'Экваториальная Гвинея',
    lt: 'Pusiaujo Gvinėja',
    tr: 'Ekvator Ginesi',
    en: 'Equatorial Guinea',
    flag: '🇬🇶',
    code: 'GQ',
    dialCode: '+240',
    mask: '999 999 999',
  },
  {
    ru: 'Эритрея',
    lt: 'Eritrėja',
    tr: 'Eritre',
    en: 'Eritrea',
    flag: '🇪🇷',
    code: 'ER',
    dialCode: '+291',
    mask: '99 999 999',
  },
  {
    ru: 'Эстония',
    lt: 'Estija',
    tr: 'Estonya',
    en: 'Estonia',
    flag: '🇪🇪',
    code: 'EE',
    dialCode: '+372',
    mask: '9999 9999',
  },
  {
    ru: 'Эфиопия',
    lt: 'Etiopija',
    tr: 'Etiyopya',
    en: 'Ethiopia',
    flag: '🇪🇹',
    code: 'ET',
    dialCode: '+251',
    mask: '999 999 9999',
  },
  {
    ru: 'Фолклендские (Мальвинские) острова',
    lt: 'Folklando salos (Malvinai)',
    tr: 'Falkland Adaları (Malvinas)',
    en: 'Falkland Islands (Malvinas)',
    flag: '🇫🇰',
    code: 'FK',
    dialCode: '+500',
    mask: '99999',
  },
  {
    ru: 'Фарерские острова',
    lt: 'Farerų salos',
    tr: 'Faroe Adaları',
    en: 'Faroe Islands',
    flag: '🇫🇴',
    code: 'FO',
    dialCode: '+298',
    mask: '999999',
  },
  {
    ru: 'Фиджи',
    lt: 'Fidžis',
    tr: 'Fiji',
    en: 'Fiji',
    flag: '🇫🇯',
    code: 'FJ',
    dialCode: '+679',
    mask: '999 9999',
  },
  {
    ru: 'Финляндия',
    lt: 'Suomija',
    tr: 'Finlandiya',
    en: 'Finland',
    flag: '🇫🇮',
    code: 'FI',
    dialCode: '+358',
    mask: '999 9999999',
  },
  {
    ru: 'Франция',
    lt: 'Prancūzijoje',
    tr: 'Fransa',
    en: 'France',
    flag: '🇫🇷',
    code: 'FR',
    dialCode: '+33',
    mask: '99 99 99 99 99',
  },
  {
    ru: 'Французская Гвиана',
    lt: 'Prancūzijos Gviana',
    tr: 'Fransız Guyanası',
    en: 'French Guiana',
    flag: '🇬🇫',
    code: 'GF',
    dialCode: '+594',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Французская Полинезия',
    lt: 'Prancūzų Polinezija',
    tr: 'Fransız Polinezyası',
    en: 'French Polynesia',
    flag: '🇵🇫',
    code: 'PF',
    dialCode: '+689',
    mask: '99 99 99 99',
  },
  {
    ru: 'Габон',
    lt: 'Gabonas',
    tr: 'Gabon',
    en: 'Gabon',
    flag: '🇬🇦',
    code: 'GA',
    dialCode: '+241',
    mask: '99 99 99 99',
  },
  {
    ru: 'Гамбия',
    lt: 'Gambija',
    tr: 'Gambiya',
    en: 'Gambia',
    flag: '🇬🇲',
    code: 'GM',
    dialCode: '+220',
    mask: '999 9999',
  },
  {
    ru: 'Грузия',
    lt: 'Gruzijoje',
    tr: 'Gürcistan',
    en: 'Georgia',
    flag: '🇬🇪',
    code: 'GE',
    dialCode: '+995',
    mask: '999 99 99 99',
  },
  {
    ru: 'Германия',
    lt: 'Vokietija',
    tr: 'Almanya',
    en: 'Germany',
    flag: '🇩🇪',
    code: 'DE',
    dialCode: '+49',
    mask: '99999 9999999',
  },
  {
    ru: 'Гана',
    lt: 'Gana',
    tr: 'Gana',
    en: 'Ghana',
    flag: '🇬🇭',
    code: 'GH',
    dialCode: '+233',
    mask: '999 999 9999',
  },
  {
    ru: 'Гибралтар',
    lt: 'Gibraltaras',
    tr: 'Cebelitarık',
    en: 'Gibraltar',
    flag: '🇬🇮',
    code: 'GI',
    dialCode: '+350',
    mask: '99999999',
  },
  {
    ru: 'Греция',
    lt: 'Graikija',
    tr: 'Yunanistan',
    en: 'Greece',
    flag: '🇬🇷',
    code: 'GR',
    dialCode: '+30',
    mask: '999 999 9999',
  },
  {
    ru: 'Гренландия',
    lt: 'Grenlandija',
    tr: 'Grönland',
    en: 'Greenland',
    flag: '🇬🇱',
    code: 'GL',
    dialCode: '+299',
    mask: '99 99 99',
  },
  {
    ru: 'Гренада',
    lt: 'Grenada',
    tr: 'Grenada',
    en: 'Grenada',
    flag: '🇬🇩',
    code: 'GD',
    dialCode: '+1473',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Гваделупа',
    lt: 'Gvadelupa',
    tr: 'Guadeloupe',
    en: 'Guadeloupe',
    flag: '🇬🇵',
    code: 'GP',
    dialCode: '+590',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Гуам',
    lt: 'Guamas',
    tr: 'Guam',
    en: 'Guam',
    flag: '🇬🇺',
    code: 'GU',
    dialCode: '+1671',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Гватемала',
    lt: 'Gvatemala',
    tr: 'Guatemala',
    en: 'Guatemala',
    flag: '🇬🇹',
    code: 'GT',
    dialCode: '+502',
    mask: '9999 9999',
  },
  {
    ru: 'шерстяная фуфайка',
    lt: 'Gernsis',
    tr: 'bir tür inek',
    en: 'Guernsey',
    flag: '🇬🇬',
    code: 'GG',
    dialCode: '+44',
    mask: '99999 999999',
  },
  {
    ru: 'Гвинея',
    lt: 'Gvinėjos',
    tr: 'Gine',
    en: 'Guinea',
    flag: '🇬🇳',
    code: 'GN',
    dialCode: '+224',
    mask: '999 99 99 99',
  },
  {
    ru: 'Гвинея-Бисау',
    lt: 'Bisau Gvinėja',
    tr: 'Gine-Bissau',
    en: 'Guinea-Bissau',
    flag: '🇬🇼',
    code: 'GW',
    dialCode: '+245',
    mask: '999 999 999',
  },
  {
    ru: 'Гайана',
    lt: 'Gajana',
    tr: 'Guyana',
    en: 'Guyana',
    flag: '🇬🇾',
    code: 'GY',
    dialCode: '+592',
    mask: '999 9999',
  },
  {
    ru: 'Гаити',
    lt: 'Haitis',
    tr: 'Haiti',
    en: 'Haiti',
    flag: '🇭🇹',
    code: 'HT',
    dialCode: '+509',
    mask: '99 99 9999',
  },
  {
    ru: 'Гондурас',
    lt: 'Hondūras',
    tr: 'Honduras',
    en: 'Honduras',
    flag: '🇭🇳',
    code: 'HN',
    dialCode: '+504',
    mask: '9999-9999',
  },
  {
    ru: 'Гонконг',
    lt: 'Honkongas',
    tr: 'Hong Kong',
    en: 'Hong Kong',
    flag: '🇭🇰',
    code: 'HK',
    dialCode: '+852',
    mask: '9999 9999',
  },
  {
    ru: 'Венгрия',
    lt: 'Vengrija',
    tr: 'Macaristan',
    en: 'Hungary',
    flag: '🇭🇺',
    code: 'HU',
    dialCode: '+36',
    mask: '(99) 999 9999',
  },
  {
    ru: 'Исландия',
    lt: 'Islandija',
    tr: 'İzlanda',
    en: 'Iceland',
    flag: '🇮🇸',
    code: 'IS',
    dialCode: '+354',
    mask: '999 9999',
  },
  {
    ru: 'Индия',
    lt: 'Indija',
    tr: 'Hindistan',
    en: 'India',
    flag: '🇮🇳',
    code: 'IN',
    dialCode: '+91',
    mask: '99999 99999',
  },
  {
    ru: 'Индонезия',
    lt: 'Indonezija',
    tr: 'Endonezya',
    en: 'Indonesia',
    flag: '🇮🇩',
    code: 'ID',
    dialCode: '+62',
    mask: '9999-999-999',
  },
  {
    ru: 'Иран, Исламская Республика Персидского залива',
    lt: 'Iranas, Persijos įlankos Islamo Respublika',
    tr: 'İran, Basra Körfezi İslam Cumhuriyeti',
    en: 'Iran, Islamic Republic of Persian Gulf',
    flag: '🇮🇷',
    code: 'IR',
    dialCode: '+98',
    mask: '9999 999 9999',
  },
  {
    ru: 'Ирак',
    lt: 'Irakas',
    tr: 'Irak',
    en: 'Iraq',
    flag: '🇮🇶',
    code: 'IQ',
    dialCode: '+964',
    mask: '9999 999 9999',
  },
  {
    ru: 'Ирландия',
    lt: 'Airija',
    tr: 'İrlanda',
    en: 'Ireland',
    flag: '🇮🇪',
    code: 'IE',
    dialCode: '+353',
    mask: '999 999 9999',
  },
  {
    ru: 'Остров Мэн',
    lt: 'Meno sala',
    tr: 'Man Adası',
    en: 'Isle of Man',
    flag: '🇮🇲',
    code: 'IM',
    dialCode: '+44',
    mask: '99999 999999',
  },
  {
    ru: 'Израиль',
    lt: 'Izraelis',
    tr: 'İsrail',
    en: 'Israel',
    flag: '🇮🇱',
    code: 'IL',
    dialCode: '+972',
    mask: '999-999-9999',
  },
  {
    ru: 'Италия',
    lt: 'Italijoje',
    tr: 'İtalya',
    en: 'Italy',
    flag: '🇮🇹',
    code: 'IT',
    dialCode: '+39',
    mask: '999 999 9999',
  },
  {
    ru: 'Ямайка',
    lt: 'Jamaika',
    tr: 'Jamaika',
    en: 'Jamaica',
    flag: '🇯🇲',
    code: 'JM',
    dialCode: '+1876',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Япония',
    lt: 'Japonija',
    tr: 'Japonya',
    en: 'Japan',
    flag: '🇯🇵',
    code: 'JP',
    dialCode: '+81',
    mask: '999-9999-9999',
  },
  {
    ru: 'Джерси',
    lt: 'Džersis',
    tr: 'Jersey',
    en: 'Jersey',
    flag: '🇯🇪',
    code: 'JE',
    dialCode: '+44',
    mask: '99999 999999',
  },
  {
    ru: 'Иордания',
    lt: 'Jordanija',
    tr: 'Ürdün',
    en: 'Jordan',
    flag: '🇯🇴',
    code: 'JO',
    dialCode: '+962',
    mask: '99 9999 9999',
  },
  {
    ru: 'Казахстан',
    lt: 'Kazachstanas',
    tr: 'Kazakistan',
    en: 'Kazakhstan',
    flag: '🇰🇿',
    code: 'KZ',
    dialCode: '+7',
    mask: '(999) 999 9999',
  },
  {
    ru: 'Кения',
    lt: 'Kenija',
    tr: 'Kenya',
    en: 'Kenya',
    flag: '🇰🇪',
    code: 'KE',
    dialCode: '+254',
    mask: '9999 999999',
  },
  {
    ru: 'Кирибати',
    lt: 'Kiribatis',
    tr: 'Kiribati',
    en: 'Kiribati',
    flag: '🇰🇮',
    code: 'KI',
    dialCode: '+686',
    mask: '99999999',
  },
  {
    ru: 'Корея, Корейская Народно-Демократическая Республика',
    lt: 'Korėja, Korėjos Liaudies Demokratinė Respublika',
    tr: 'Kore, Kore Demokratik Halk Cumhuriyeti',
    en: "Korea, Democratic People's Republic of Korea",
    flag: '🇰🇵',
    code: 'KP',
    dialCode: '+850',
    mask: '(9) 99999',
  },
  {
    ru: 'Корея, Республика Южная Корея',
    lt: 'Korėja, Pietų Korėjos Respublika',
    tr: 'Güney Kore Cumhuriyeti',
    en: 'Korea, Republic of South Korea',
    flag: '🇰🇷',
    code: 'KR',
    dialCode: '+82',
    mask: '999-9999-9999',
  },
  {
    ru: 'Косово',
    lt: 'Kosovas',
    tr: 'Kosova',
    en: 'Kosovo',
    flag: '🇽🇰',
    code: 'XK',
    dialCode: '+383',
    mask: '999 999 999',
  },
  {
    ru: 'Кувейт',
    lt: 'Kuveitas',
    tr: 'Kuveyt',
    en: 'Kuwait',
    flag: '🇰🇼',
    code: 'KW',
    dialCode: '+965',
    mask: '999 99999',
  },
  {
    ru: 'Киргизия',
    lt: 'Kirgizija',
    tr: 'Kırgızistan',
    en: 'Kyrgyzstan',
    flag: '🇰🇬',
    code: 'KG',
    dialCode: '+996',
    mask: '9999 999 999',
  },
  {
    ru: 'Лаос',
    lt: 'Laosas',
    tr: 'Laos',
    en: 'Laos',
    flag: '🇱🇦',
    code: 'LA',
    dialCode: '+856',
    mask: '999 99 999 999',
  },
  {
    ru: 'Латвия',
    lt: 'Latvijoje',
    tr: 'Letonya',
    en: 'Latvia',
    flag: '🇱🇻',
    code: 'LV',
    dialCode: '+371',
    mask: '99 999 999',
  },
  {
    ru: 'Ливан',
    lt: 'Libanas',
    tr: 'Lübnan',
    en: 'Lebanon',
    flag: '🇱🇧',
    code: 'LB',
    dialCode: '+961',
    mask: '99 999 999',
  },
  {
    ru: 'Лесото',
    lt: 'Lesotas',
    tr: 'Lesotho',
    en: 'Lesotho',
    flag: '🇱🇸',
    code: 'LS',
    dialCode: '+266',
    mask: '9999 9999',
  },
  {
    ru: 'Либерия',
    lt: 'Liberija',
    tr: 'Liberya',
    en: 'Liberia',
    flag: '🇱🇷',
    code: 'LR',
    dialCode: '+231',
    mask: '999 999 9999',
  },
  {
    ru: 'Ливийская арабская джамахирия',
    lt: 'Libijos arabų Jamahiriya',
    tr: 'Libya Arap Jamahiriya',
    en: 'Libyan Arab Jamahiriya',
    flag: '🇱🇾',
    code: 'LY',
    dialCode: '+218',
    mask: '999-9999999',
  },
  {
    ru: 'Лихтенштейн',
    lt: 'Lichtenšteinas',
    tr: 'Lihtenştayn',
    en: 'Liechtenstein',
    flag: '🇱🇮',
    code: 'LI',
    dialCode: '+423',
    mask: '999 999 999',
  },
  {
    ru: 'Литва',
    lt: 'Lietuva',
    tr: 'Litvanya',
    en: 'Lithuania',
    flag: '🇱🇹',
    code: 'LT',
    dialCode: '+370',
    mask: '(9-999) 9999',
  },
  {
    ru: 'Люксембург',
    lt: 'Liuksemburgas',
    tr: 'Lüksemburg',
    en: 'Luxembourg',
    flag: '🇱🇺',
    code: 'LU',
    dialCode: '+352',
    mask: '999 999 999',
  },
  {
    ru: 'Macao',
    lt: 'Makao',
    tr: 'Macao',
    en: 'Macao',
    flag: '🇲🇴',
    code: 'MO',
    dialCode: '+853',
    mask: '9999 9999',
  },
  {
    ru: 'Македония',
    lt: 'Makedonija',
    tr: 'Makedonya',
    en: 'Macedonia',
    flag: '🇲🇰',
    code: 'MK',
    dialCode: '+389',
    mask: '999 999 999',
  },
  {
    ru: 'Мадагаскар',
    lt: 'Madagaskaras',
    tr: 'Madagaskar',
    en: 'Madagascar',
    flag: '🇲🇬',
    code: 'MG',
    dialCode: '+261',
    mask: '999 99 999 99',
  },
  {
    ru: 'Малави',
    lt: 'Malavis',
    tr: 'Malawi',
    en: 'Malawi',
    flag: '🇲🇼',
    code: 'MW',
    dialCode: '+265',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Малайзия',
    lt: 'Malaizija',
    tr: 'Malezya',
    en: 'Malaysia',
    flag: '🇲🇾',
    code: 'MY',
    dialCode: '+60',
    mask: '999-999 9999',
  },
  {
    ru: 'Мальдивы',
    lt: 'Maldyvai',
    tr: 'Maldivler',
    en: 'Maldives',
    flag: '🇲🇻',
    code: 'MV',
    dialCode: '+960',
    mask: '999-9999',
  },
  {
    ru: 'Мали',
    lt: 'Malis',
    tr: 'Mali',
    en: 'Mali',
    flag: '🇲🇱',
    code: 'ML',
    dialCode: '+223',
    mask: '99 99 99 99',
  },
  {
    ru: 'Мальта',
    lt: 'Malta',
    tr: 'Malta',
    en: 'Malta',
    flag: '🇲🇹',
    code: 'MT',
    dialCode: '+356',
    mask: '9999 9999',
  },
  {
    ru: 'Маршалловы острова',
    lt: 'Maršalo salos',
    tr: 'Marşal Adaları',
    en: 'Marshall Islands',
    flag: '🇲🇭',
    code: 'MH',
    dialCode: '+692',
    mask: '999-9999',
  },
  {
    ru: 'Мартиника',
    lt: 'Martinika',
    tr: 'Martinik',
    en: 'Martinique',
    flag: '🇲🇶',
    code: 'MQ',
    dialCode: '+596',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Мавритания',
    lt: 'Mauritanija',
    tr: 'Moritanya',
    en: 'Mauritania',
    flag: '🇲🇷',
    code: 'MR',
    dialCode: '+222',
    mask: '99 99 99 99',
  },
  {
    ru: 'Маврикий',
    lt: 'Mauricijus',
    tr: 'Mauritius',
    en: 'Mauritius',
    flag: '🇲🇺',
    code: 'MU',
    dialCode: '+230',
    mask: '9999 9999',
  },
  {
    ru: 'Майотта',
    lt: 'Majotas',
    tr: 'Mayotte',
    en: 'Mayotte',
    flag: '🇾🇹',
    code: 'YT',
    dialCode: '+262',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Мексика',
    lt: 'Meksika',
    tr: 'Meksika',
    en: 'Mexico',
    flag: '🇲🇽',
    code: 'MX',
    dialCode: '+52',
    mask: '999-999 9999',
  },
  {
    ru: 'Микронезия, Федеративные Штаты Микронезии',
    lt: 'Mikronezijos Federacinės Mikronezijos valstybės',
    tr: 'Mikronezya, Mikronezya Federal Devletleri',
    en: 'Micronesia, Federated States of Micronesia',
    flag: '🇫🇲',
    code: 'FM',
    dialCode: '+691',
    mask: '999 9999',
  },
  {
    ru: 'Молдова',
    lt: 'Moldovoje',
    tr: 'Moldova',
    en: 'Moldova',
    flag: '🇲🇩',
    code: 'MD',
    dialCode: '+373',
    mask: '9999 99 999',
  },
  {
    ru: 'Монако',
    lt: 'Monakas',
    tr: 'Monako',
    en: 'Monaco',
    flag: '🇲🇨',
    code: 'MC',
    dialCode: '+377',
    mask: '99 99 99 99 99',
  },
  {
    ru: 'Монголия',
    lt: 'Mongolija',
    tr: 'Moğolistan',
    en: 'Mongolia',
    flag: '🇲🇳',
    code: 'MN',
    dialCode: '+976',
    mask: '9999 9999',
  },
  {
    ru: 'Черногория',
    lt: 'Juodkalnija',
    tr: 'Karadağ',
    en: 'Montenegro',
    flag: '🇲🇪',
    code: 'ME',
    dialCode: '+382',
    mask: '999 999 999',
  },
  {
    ru: 'Монсеррат',
    lt: 'Montserratas',
    tr: 'Montserrat',
    en: 'Montserrat',
    flag: '🇲🇸',
    code: 'MS',
    dialCode: '+1664',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Марокко',
    lt: 'Marokas',
    tr: 'Fas',
    en: 'Morocco',
    flag: '🇲🇦',
    code: 'MA',
    dialCode: '+212',
    mask: '9999-999999',
  },
  {
    ru: 'Мозамбик',
    lt: 'Mozambikas',
    tr: 'Mozambik',
    en: 'Mozambique',
    flag: '🇲🇿',
    code: 'MZ',
    dialCode: '+258',
    mask: '99 999 9999',
  },
  {
    ru: 'Мьянма',
    lt: 'Mianmaras',
    tr: 'Myanmar',
    en: 'Myanmar',
    flag: '🇲🇲',
    code: 'MM',
    dialCode: '+95',
    mask: '99 999 9999',
  },
  {
    ru: 'Намибия',
    lt: 'Namibija',
    tr: 'Namibya',
    en: 'Namibia',
    flag: '🇳🇦',
    code: 'NA',
    dialCode: '+264',
    mask: '999 999 99999',
  },
  {
    ru: 'Науру',
    lt: 'Nauru',
    tr: 'Nauru',
    en: 'Nauru',
    flag: '🇳🇷',
    code: 'NR',
    dialCode: '+674',
    mask: '999 9999',
  },
  {
    ru: 'Непал',
    lt: 'Nepalas',
    tr: 'Nepal',
    en: 'Nepal',
    flag: '🇳🇵',
    code: 'NP',
    dialCode: '+977',
    mask: '999-9999999',
  },
  {
    ru: 'Нидерланды',
    lt: 'Nyderlandai',
    tr: 'Hollanda',
    en: 'Netherlands',
    flag: '🇳🇱',
    code: 'NL',
    dialCode: '+31',
    mask: '99 99999999',
  },
  {
    ru: 'Новая Каледония',
    lt: 'Naujoji Kaledonija',
    tr: 'Yeni Kaledonya',
    en: 'New Caledonia',
    flag: '🇳🇨',
    code: 'NC',
    dialCode: '+687',
    mask: '99.99.99',
  },
  {
    ru: 'Новая Зеландия',
    lt: 'Naujoji Zelandija',
    tr: 'Yeni Zelanda',
    en: 'New Zealand',
    flag: '🇳🇿',
    code: 'NZ',
    dialCode: '+64',
    mask: '999 999 9999',
  },
  {
    ru: 'Никарагуа',
    lt: 'Nikaragva',
    tr: 'Nikaragua',
    en: 'Nicaragua',
    flag: '🇳🇮',
    code: 'NI',
    dialCode: '+505',
    mask: '9999 9999',
  },
  {
    ru: 'Нигер',
    lt: 'Nigeris',
    tr: 'Nijer',
    en: 'Niger',
    flag: '🇳🇪',
    code: 'NE',
    dialCode: '+227',
    mask: '99 99 99 99',
  },
  {
    ru: 'Нигерия',
    lt: 'Nigerija',
    tr: 'Nijerya',
    en: 'Nigeria',
    flag: '🇳🇬',
    code: 'NG',
    dialCode: '+234',
    mask: '9999 999 9999',
  },
  {
    ru: 'Niue',
    lt: 'Niue',
    tr: 'Niue',
    en: 'Niue',
    flag: '🇳🇺',
    code: 'NU',
    dialCode: '+683',
    mask: '999 9999',
  },
  {
    ru: 'Остров Норфолк',
    lt: 'Norfolko sala',
    tr: 'Norfolk Adası',
    en: 'Norfolk Island',
    flag: '🇳🇫',
    code: 'NF',
    dialCode: '+672',
    mask: '9 99999',
  },
  {
    ru: 'Северные Марианские острова',
    lt: 'Šiaurinės Marianos salos',
    tr: 'Kuzey Mariana Adaları',
    en: 'Northern Mariana Islands',
    flag: '🇲🇵',
    code: 'MP',
    dialCode: '+1670',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Норвегия',
    lt: 'Norvegija',
    tr: 'Norveç',
    en: 'Norway',
    flag: '🇳🇴',
    code: 'NO',
    dialCode: '+47',
    mask: '999 99 999',
  },
  {
    ru: 'Оман',
    lt: 'Omanas',
    tr: 'Umman',
    en: 'Oman',
    flag: '🇴🇲',
    code: 'OM',
    dialCode: '+968',
    mask: '9999 9999',
  },
  {
    ru: 'Пакистан',
    lt: 'Pakistanas',
    tr: 'Pakistan',
    en: 'Pakistan',
    flag: '🇵🇰',
    code: 'PK',
    dialCode: '+92',
    mask: '999 9999 999',
    regExp: /^[3]\d{9}$/ || /^[0][3]\d{9}$/,
  },
  {
    ru: 'Palau',
    lt: 'Palau',
    tr: 'Palau',
    en: 'Palau',
    flag: '🇵🇼',
    code: 'PW',
    dialCode: '+680',
    mask: '999 9999',
  },
  {
    ru: 'Палестинская территория, оккупированная',
    lt: 'Palestinos teritorija, okupuota',
    tr: 'Filistin Arazisi, İşgal altında',
    en: 'Palestinian Territory, Occupied',
    flag: '🇵🇸',
    code: 'PS',
    dialCode: '+970',
    mask: '9999 999 999',
  },
  {
    ru: 'Панама',
    lt: 'Panama',
    tr: 'Panama',
    en: 'Panama',
    flag: '🇵🇦',
    code: 'PA',
    dialCode: '+507',
    mask: '9999-9999',
  },
  {
    ru: 'Папуа - Новая Гвинея',
    lt: 'Papua Naujoji Gvinėja',
    tr: 'Papua Yeni Gine',
    en: 'Papua New Guinea',
    flag: '🇵🇬',
    code: 'PG',
    dialCode: '+675',
    mask: '9999 9999',
  },
  {
    ru: 'Парагвай',
    lt: 'Paragvajus',
    tr: 'Paraguay',
    en: 'Paraguay',
    flag: '🇵🇾',
    code: 'PY',
    dialCode: '+595',
    mask: '9999 999999',
  },
  {
    ru: 'Перу',
    lt: 'Peru',
    tr: 'Peru',
    en: 'Peru',
    flag: '🇵🇪',
    code: 'PE',
    dialCode: '+51',
    mask: '999 999 999',
  },
  {
    ru: 'Филиппины',
    lt: 'Filipinai',
    tr: 'Filipinler',
    en: 'Philippines',
    flag: '🇵🇭',
    code: 'PH',
    dialCode: '+63',
    mask: '9999 999 9999',
  },
  {
    ru: 'Польша',
    lt: 'Lenkija',
    tr: 'Polonya',
    en: 'Poland',
    flag: '🇵🇱',
    code: 'PL',
    dialCode: '+48',
    mask: '999 999 999',
  },
  {
    ru: 'Португалия',
    lt: 'Portugalija',
    tr: 'Portekiz',
    en: 'Portugal',
    flag: '🇵🇹',
    code: 'PT',
    dialCode: '+351',
    mask: '999 999 999',
  },
  {
    ru: 'Пуэрто-Рико',
    lt: 'Puerto Rikas',
    tr: 'Porto Riko',
    en: 'Puerto Rico',
    flag: '🇵🇷',
    code: 'PR',
    dialCode: '+1939',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Катар',
    lt: 'Kataras',
    tr: 'Katar',
    en: 'Qatar',
    flag: '🇶🇦',
    code: 'QA',
    dialCode: '+974',
    mask: '9999 9999',
  },
  {
    ru: 'Румыния',
    lt: 'Rumunija',
    tr: 'Romanya',
    en: 'Romania',
    flag: '🇷🇴',
    code: 'RO',
    dialCode: '+40',
    mask: '9999 999 999',
  },
  {
    ru: 'Россия',
    lt: 'Rusija',
    tr: 'Rusya',
    en: 'Russia',
    flag: '🇷🇺',
    code: 'RU',
    dialCode: '+7',
    mask: '(999) 999-99-99',
  },
  {
    ru: 'Руанда',
    lt: 'Ruanda',
    tr: 'Ruanda',
    en: 'Rwanda',
    flag: '🇷🇼',
    code: 'RW',
    dialCode: '+250',
    mask: '9999 999 999',
  },
  {
    ru: 'Сен-Бартельми',
    lt: 'Šventasis Barthelemy',
    tr: 'Saint Barthelemy',
    en: 'Saint Barthelemy',
    flag: '🇧🇱',
    code: 'BL',
    dialCode: '+590',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Святой Елены, Вознесения и Тристан-да-Кунья',
    lt: 'Šventoji Helena, Ascension ir Tristan Da Cunha',
    tr: 'Saint Helena, Yükseliş ve Tristan Da Cunha',
    en: 'Saint Helena, Ascension and Tristan Da Cunha',
    flag: '🇸🇭',
    code: 'SH',
    dialCode: '+290',
    mask: '99999',
  },
  {
    ru: 'Сент-Китс и Невис',
    lt: 'Sent Kitsas ir Nevis',
    tr: 'Saint Kitts ve Nevis',
    en: 'Saint Kitts and Nevis',
    flag: '🇰🇳',
    code: 'KN',
    dialCode: '+1869',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Сент-Люсия',
    lt: 'Sent Lusija',
    tr: 'Saint Lucia',
    en: 'Saint Lucia',
    flag: '🇱🇨',
    code: 'LC',
    dialCode: '+1758',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Святой мартин',
    lt: 'Sent Martinas',
    tr: 'Aziz Martin',
    en: 'Saint Martin',
    flag: '🇲🇫',
    code: 'MF',
    dialCode: '+590',
    mask: '9999 99 99 99',
  },
  {
    ru: 'Сен-Пьер и Микелон',
    lt: 'Sent Pjeras ir Mikelonas',
    tr: 'Saint Pierre ve Miquelon',
    en: 'Saint Pierre and Miquelon',
    flag: '🇵🇲',
    code: 'PM',
    dialCode: '+508',
    mask: '999 99 99',
  },
  {
    ru: 'Святой Винсент и Гренадины',
    lt: 'Sent Vinsentas ir Grenadinai',
    tr: 'Saint Vincent ve Grenadinler',
    en: 'Saint Vincent and the Grenadines',
    flag: '🇻🇨',
    code: 'VC',
    dialCode: '+1784',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Самоа',
    lt: 'Samoa',
    tr: 'Samoa',
    en: 'Samoa',
    flag: '🇼🇸',
    code: 'WS',
    dialCode: '+685',
    mask: '99 99999',
  },
  {
    ru: 'Сан-Марино',
    lt: 'San Marinas',
    tr: 'San Marino',
    en: 'San Marino',
    flag: '🇸🇲',
    code: 'SM',
    dialCode: '+378',
    mask: '99 99 99 99',
  },
  {
    ru: 'Сан-Томе и Принсипи',
    lt: 'San Tomė ir Principe',
    tr: 'Sao Tome ve Principe',
    en: 'Sao Tome and Principe',
    flag: '🇸🇹',
    code: 'ST',
    dialCode: '+239',
    mask: '999 9999',
  },
  {
    ru: 'Саудовская Аравия',
    lt: 'Saudo Arabija',
    tr: 'Suudi Arabistan',
    en: 'Saudi Arabia',
    flag: '🇸🇦',
    code: 'SA',
    dialCode: '+966',
    mask: '999 999 9999',
  },
  {
    ru: 'Сенегал',
    lt: 'Senegalas',
    tr: 'Senegal',
    en: 'Senegal',
    flag: '🇸🇳',
    code: 'SN',
    dialCode: '+221',
    mask: '99 999 99 99',
  },
  {
    ru: 'Сербия',
    lt: 'Serbija',
    tr: 'Sırbistan',
    en: 'Serbia',
    flag: '🇷🇸',
    code: 'RS',
    dialCode: '+381',
    mask: '999 9999999',
  },
  {
    ru: 'Сейшельские острова',
    lt: 'Seišeliai',
    tr: 'Seyşeller',
    en: 'Seychelles',
    flag: '🇸🇨',
    code: 'SC',
    dialCode: '+248',
    mask: '9 999 999',
  },
  {
    ru: 'Сьерра-Леоне',
    lt: 'Siera Leonė',
    tr: 'Sierra Leone',
    en: 'Sierra Leone',
    flag: '🇸🇱',
    code: 'SL',
    dialCode: '+232',
    mask: '(999) 999999',
  },
  {
    ru: 'Сингапур',
    lt: 'Singapūras',
    tr: 'Singapur',
    en: 'Singapore',
    flag: '🇸🇬',
    code: 'SG',
    dialCode: '+65',
    mask: '9999 9999',
  },
  {
    ru: 'Словакия',
    lt: 'Slovakija',
    tr: 'Slovakya',
    en: 'Slovakia',
    flag: '🇸🇰',
    code: 'SK',
    dialCode: '+421',
    mask: '9999 999 999',
  },
  {
    ru: 'Словения',
    lt: 'Slovėnija',
    tr: 'Slovenya',
    en: 'Slovenia',
    flag: '🇸🇮',
    code: 'SI',
    dialCode: '+386',
    mask: '999 999 999',
  },
  {
    ru: 'Соломоновы острова',
    lt: 'Saliamono salos',
    tr: 'Solomon Adaları',
    en: 'Solomon Islands',
    flag: '🇸🇧',
    code: 'SB',
    dialCode: '+677',
    mask: '99 99999',
  },
  {
    ru: 'Сомали',
    lt: 'Somalis',
    tr: 'Somali',
    en: 'Somalia',
    flag: '🇸🇴',
    code: 'SO',
    dialCode: '+252',
    mask: '9 9999999',
  },
  {
    ru: 'Южная Африка',
    lt: 'pietų Afrika',
    tr: 'Güney Afrika',
    en: 'South Africa',
    flag: '🇿🇦',
    code: 'ZA',
    dialCode: '+27',
    mask: '999 999 9999',
  },
  {
    ru: 'южный Судан',
    lt: 'Pietų Sudanas',
    tr: 'Güney Sudan',
    en: 'South Sudan',
    flag: '🇸🇸',
    code: 'SS',
    dialCode: '+211',
    mask: '9999 999 999',
  },
  {
    ru: 'Испания',
    lt: 'Ispanija',
    tr: 'ispanya',
    en: 'Spain',
    flag: '🇪🇸',
    code: 'ES',
    dialCode: '+34',
    mask: '999 99 99 99',
  },
  {
    ru: 'Шри-Ланка',
    lt: 'Šri Lanka',
    tr: 'Sri Lanka',
    en: 'Sri Lanka',
    flag: '🇱🇰',
    code: 'LK',
    dialCode: '+94',
    mask: '999 999 9999',
  },
  {
    ru: 'Судан',
    lt: 'Sudanas',
    tr: 'Sudan',
    en: 'Sudan',
    flag: '🇸🇩',
    code: 'SD',
    dialCode: '+249',
    mask: '999 999 9999',
  },
  {
    ru: 'Суринам',
    lt: 'Surinamas',
    tr: 'Surinam',
    en: 'Suriname',
    flag: '🇸🇷',
    code: 'SR',
    dialCode: '+597',
    mask: '999-9999',
  },
  {
    ru: 'Шпицберген и Ян Майен',
    lt: 'Svalbardas ir Janas Mayenas',
    tr: 'Svalbard ve Jan Mayen',
    en: 'Svalbard and Jan Mayen',
    flag: '🇸🇯',
    code: 'SJ',
    dialCode: '+47',
    mask: '999 99 999',
  },
  {
    ru: 'Свазиленд',
    lt: 'Svazilandas',
    tr: 'Svaziland',
    en: 'Swaziland',
    flag: '🇸🇿',
    code: 'SZ',
    dialCode: '+268',
    mask: '9999 9999',
  },
  {
    ru: 'Швеция',
    lt: 'Švedija',
    tr: 'İsveç',
    en: 'Sweden',
    flag: '🇸🇪',
    code: 'SE',
    dialCode: '+46',
    mask: '999-999 99 99',
  },
  {
    ru: 'Швейцария',
    lt: 'Šveicarija',
    tr: 'İsviçre',
    en: 'Switzerland',
    flag: '🇨🇭',
    code: 'CH',
    dialCode: '+41',
    mask: '999 999 99 99',
  },
  {
    ru: 'Сирийская Арабская Республика',
    lt: 'Sirijos Arabų Respublika',
    tr: 'Suriye Arap Cumhuriyeti',
    en: 'Syrian Arab Republic',
    flag: '🇸🇾',
    code: 'SY',
    dialCode: '+963',
    mask: '9999 999 999',
  },
  {
    ru: 'Тайвань',
    lt: 'Taivanas',
    tr: 'Tayvan',
    en: 'Taiwan',
    flag: '🇹🇼',
    code: 'TW',
    dialCode: '+886',
    mask: '9999 999 999',
  },
  {
    ru: 'Таджикистан',
    lt: 'Tadžikistanas',
    tr: 'Tacikistan',
    en: 'Tajikistan',
    flag: '🇹🇯',
    code: 'TJ',
    dialCode: '+992',
    mask: '999 99 9999',
  },
  {
    ru: 'Танзания, Объединенная Республика Танзания',
    lt: 'Tanzanija, Jungtinė Tanzanijos Respublika',
    tr: 'Tanzanya, Tanzanya Birleşik Cumhuriyeti',
    en: 'Tanzania, United Republic of Tanzania',
    flag: '🇹🇿',
    code: 'TZ',
    dialCode: '+255',
    mask: '9999 999 999',
  },
  {
    ru: 'Таиланд',
    lt: 'Tailandas',
    tr: 'Tayland',
    en: 'Thailand',
    flag: '🇹🇭',
    code: 'TH',
    dialCode: '+66',
    mask: '999 999 9999',
  },
  {
    ru: 'Восточный Тимор',
    lt: 'Timoras-Leste',
    tr: 'Timor-Leste',
    en: 'Timor-Leste',
    flag: '🇹🇱',
    code: 'TL',
    dialCode: '+670',
    mask: '9999 9999',
  },
  {
    ru: 'Идти',
    lt: 'Eiti',
    tr: 'Gitmek',
    en: 'Togo',
    flag: '🇹🇬',
    code: 'TG',
    dialCode: '+228',
    mask: '99 99 99 99',
  },
  {
    ru: 'Токелау',
    lt: 'Tokelau',
    tr: 'Tokelau',
    en: 'Tokelau',
    flag: '🇹🇰',
    code: 'TK',
    dialCode: '+690',
    mask: '9999',
  },
  {
    ru: 'Тонга',
    lt: 'Tonga',
    tr: 'Tonga',
    en: 'Tonga',
    flag: '🇹🇴',
    code: 'TO',
    dialCode: '+676',
    mask: '999 9999',
  },
  {
    ru: 'Тринидад и Тобаго',
    lt: 'Trinidadas ir Tobagas',
    tr: 'Trinidad ve Tobago',
    en: 'Trinidad and Tobago',
    flag: '🇹🇹',
    code: 'TT',
    dialCode: '+1868',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Тунис',
    lt: 'Tunisas',
    tr: 'Tunus',
    en: 'Tunisia',
    flag: '🇹🇳',
    code: 'TN',
    dialCode: '+216',
    mask: '99 999 999',
  },
  {
    ru: 'индейка',
    lt: 'Turkija',
    tr: 'Türkiye',
    en: 'Turkey',
    flag: '🇹🇷',
    code: 'TR',
    dialCode: '+90',
    mask: '(999) 999 9999',
  },
  {
    ru: 'Туркменистан',
    lt: 'Turkmėnistanas',
    tr: 'Türkmenistan',
    en: 'Turkmenistan',
    flag: '🇹🇲',
    code: 'TM',
    dialCode: '+993',
    mask: '9 99 999999',
  },
  {
    ru: 'Острова Теркс и Кайкос',
    lt: 'Terkso ir Kaikoso salos',
    tr: 'Turks ve Caicos Adaları',
    en: 'Turks and Caicos Islands',
    flag: '🇹🇨',
    code: 'TC',
    dialCode: '+1649',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Тувалу',
    lt: 'Tuvalu',
    tr: 'Tuvalu',
    en: 'Tuvalu',
    flag: '🇹🇻',
    code: 'TV',
    dialCode: '+688',
    mask: '999999',
  },
  {
    ru: 'Уганда',
    lt: 'Uganda',
    tr: 'Uganda',
    en: 'Uganda',
    flag: '🇺🇬',
    code: 'UG',
    dialCode: '+256',
    mask: '9999 999999',
  },
  {
    ru: 'Украина',
    lt: 'Ukraina',
    tr: 'Ukrayna',
    en: 'Ukraine',
    flag: '🇺🇦',
    code: 'UA',
    dialCode: '+380',
    mask: '999 999 9999',
  },
  {
    ru: 'Объединенные Арабские Эмираты',
    lt: 'Jungtiniai Arabų Emyratai',
    tr: 'Birleşik Arap Emirlikleri',
    en: 'United Arab Emirates',
    flag: '🇦🇪',
    code: 'AE',
    dialCode: '+971',
    mask: '999 999 9999',
  },
  {
    ru: 'объединенное Королевство',
    lt: 'Jungtinė Karalystė',
    tr: 'Birleşik Krallık',
    en: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    dialCode: '+44',
    mask: '99999 999999',
  },
  {
    ru: 'Соединенные Штаты',
    lt: 'Jungtinės Valstijos',
    tr: 'Amerika Birleşik Devletleri',
    en: 'United States',
    flag: '🇺🇸',
    code: 'US',
    dialCode: '+1',
    mask: '(999) 999-9999',
  },
  {
    ru: 'Уругвай',
    lt: 'Urugvajus',
    tr: 'Uruguay',
    en: 'Uruguay',
    flag: '🇺🇾',
    code: 'UY',
    dialCode: '+598',
    mask: '999 999 999',
  },
  {
    ru: 'Узбекистан',
    lt: 'Uzbekistanas',
    tr: 'Özbekistan',
    en: 'Uzbekistan',
    flag: '🇺🇿',
    code: 'UZ',
    dialCode: '+998',
    mask: '9 99 999 99 99',
  },
  {
    ru: 'Вануату',
    lt: 'Vanuatu',
    tr: 'Vanuatu',
    en: 'Vanuatu',
    flag: '🇻🇺',
    code: 'VU',
    dialCode: '+678',
    mask: '999 9999',
  },
  {
    ru: 'Венесуэла, Боливарианская Республика Венесуэла',
    lt: 'Venesuela, Venesuelos Bolivaro Respublika',
    tr: 'Venezuela, Bolivarcı Venezuela Cumhuriyeti',
    en: 'Venezuela, Bolivarian Republic of Venezuela',
    flag: '🇻🇪',
    code: 'VE',
    dialCode: '+58',
    mask: '9999-9999999',
  },
  {
    ru: 'Вьетнам',
    lt: 'Vietnamas',
    tr: 'Vietnam',
    en: 'Vietnam',
    flag: '🇻🇳',
    code: 'VN',
    dialCode: '+84',
    mask: '999 999 99 99',
  },
  {
    ru: 'Уоллис и Футуна',
    lt: 'Volis ir Futuna',
    tr: 'Wallis ve Futuna',
    en: 'Wallis and Futuna',
    flag: '🇼🇫',
    code: 'WF',
    dialCode: '+681',
    mask: '99 99 99',
  },
  {
    ru: 'Йемен',
    lt: 'Jemenas',
    tr: 'Yemen',
    en: 'Yemen',
    flag: '🇾🇪',
    code: 'YE',
    dialCode: '+967',
    mask: '999 999 999',
  },
  {
    ru: 'Замбия',
    lt: 'Zambija',
    tr: 'Zambiya',
    en: 'Zambia',
    flag: '🇿🇲',
    code: 'ZM',
    dialCode: '+260',
    mask: '999 9999999',
  },
  {
    ru: 'Zimbabve',
    lt: 'Zimbabvė',
    tr: 'Zimbabve',
    en: 'Zimbabwe',
    flag: '🇿🇼',
    code: 'ZW',
    dialCode: '+263',
    mask: '999 999 9999',
  },
];

function MyProfile(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'My Profile';

  let internet = store.General.isInternet;
  let user = store.User.user;
  let loader = store.User.regLoader;

  let loc = store.User.location;
  let cart = store.User.cart;
  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
  let tagLine = '';

  let userName = '';
  let phn = '';
  let followers = 102;
  let following = 100;
  let src = '';
  let srccnic = '';

  if (user == 'guest') {
    userName = 'guest';
  }

  if (user != 'guest' && user) {
    userName = user.first_name + ' ' + user.last_name;
    phn = user.phone;
    src = user.photo != '' ? user.photo : '';
    srccnic = user.cnic_front_image != '' ? user.cnic_front_image : '';
  }

  const [tab, setTab] = useState('reviews');

  const [photo, setphoto] = useState(src);
  const [phone, setPhone] = useState(phn);
  const [cntry, setcntry] = useState('');
  const [pwc, setpwc] = useState('');

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [profileImageLoader, setprofileImageLoader] = useState(false);
  const [showFullprofileImageLoader, setshowFullprofileImageLoader] =
    useState(false);

  const [isSHowChangePhoto, setisSHowChangePhoto] = useState(false);
  const [cphoto, setcphoto] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const [isTabBarShow, setisTabBarShow] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'reviews', title: 'Reviews'},
    {key: 'trips', title: 'Trips'},
    {key: 'photos', title: 'Photos'},
  ]);
  const renderScene = SceneMap({
    reviews: Reviews,
    trips: Trips,
    photos: Photos,
  });

  useEffect(() => {
    if (user && user !== 'guest') {
      setPhone(user.phone);
      setphoto(user.photo);
    }
  }, [user]);

  useEffect(() => {
    if (user && user !== 'guest') {
      setTimeout(() => {
        setisTabBarShow(true);
      }, 100);
    }
  }, []);

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const MultipleImage = async button => {
    let apiLevel = store.General.apiLevel;
    try {
      let options = {
        mediaType: 'image',
        isPreview: false,
        singleSelectedMode: true,
      };

      const res = await MultipleImagePicker.openPicker(options);
      if (res) {
        console.log('mutipicker image res true  ');
        const {path, fileName, mime} = res;
        let uri = path;
        if (Platform.OS == 'android' && apiLevel < 29) {
          uri = 'file://' + uri;
        }

        ImageCompressor.compress(uri, {
          compressionMethod: 'auto',
        })
          .then(async res => {
            let imageObject = {
              uri: res,
              type: mime,
              fileName: fileName,
            };
            console.log('Compress image  : ', imageObject);
            if (button == 'photoChange') {
              setisSHowChangePhoto(true);
              setcphoto(imageObject);

              return;
            } else if (button == 'CNICFront') {
              // setCnicFrontImage(imageObject);
              return;
            } else {
              return;
            }
          })
          .catch(err => {
            console.log('Image compress error : ', err);
          });
      }
    } catch (error) {
      console.log('multi photo picker error : ', error);
    }
  };

  const changePhoto = c => {
    if (c == 'photoView') {
      setpv(photo.uri ? photo.uri : photo);
      setpvm(true);
      return;
    }
    if (c == 'photoViewC') {
      setpv(cphoto.uri);
      setpvm(true);
      return;
    }

    if (c == 'photoChange') {
      MultipleImage(c);
      return;
    }
  };

  const setPhoto = c => {
    setcphoto(c);
  };

  const editProfile = () => {
    props.navigation.navigate('EditProfile', {
      phn: phone,
      cntry: cntry,
      pwc: pwc,
    });
  };

  const uploadPhoto = c => {
    let imgArr = [];

    if (c == 'Profile') {
      cphoto.chk = 'Profile';
      imgArr.push(cphoto);
    }

    // if (c == 'CNICFront') {
    //   cnicFrontImage.chk = 'CnicF';
    //   imgArr.push(cnicFrontImage);
    // }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUploadImage2(
          imgArr,
          setErrMessage,
          setPhoto,
          closePhotoModal,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const renderProfileSection = () => {
    const renderProfileShow = () => {
      return (
        <TouchableOpacity
          disabled={photo == '' ? true : false}
          onPress={() => changePhoto('photoView')}
          activeOpacity={0.9}
          style={styles.profileImageContainer}>
          <Image
            onLoadStart={() => {
              setprofileImageLoader(false);
            }}
            onLoad={() => {
              setprofileImageLoader(true);
            }}
            style={styles.ProfileImg}
            source={
              photo != ''
                ? {uri: photo.uri ? photo.uri : photo}
                : require('../../assets/images/drawer/guest/img.png')
            }
          />
          {user && user !== 'guest' && (
            <TouchableOpacity
              style={styles.changeImgContainer}
              onPress={() => changePhoto('photoChange')}
              activeOpacity={0.7}>
              <Image
                style={styles.changeImg}
                source={require('../../assets/images/changePhoto/img.png')}
              />
            </TouchableOpacity>
          )}

          {!profileImageLoader && (
            <ActivityIndicator
              size={22}
              color={theme.color.button1}
              style={{top: 40, position: 'absolute'}}
            />
          )}
        </TouchableOpacity>
      );
    };

    const renderEditButton = () => {
      return (
        <TouchableOpacity
          style={styles.editImgConatiner}
          onPress={editProfile}
          activeOpacity={0.5}>
          <Image
            style={styles.editImg}
            source={require('../../assets/images/editPhoto/img.png')}
          />
        </TouchableOpacity>
      );
    };

    const renderTextSection = () => {
      return (
        <View style={styles.TextSecConatiner}>
          <View style={styles.profileTitleConatiner}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle}>
              {userName}
            </Text>
          </View>
          {user && user !== 'guest' && (
            <View style={styles.profileTitle2Conatiner}>
              <View style={styles.profileTitle2Conatiner1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  <Text style={styles.profileTitle2ConatinerTitle2}>
                    {followers}
                    {'  '}
                  </Text>
                  followers
                </Text>
              </View>

              <View style={styles.profileTitle2Conatiner2}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  <Text style={styles.profileTitle2ConatinerTitle2}>
                    {following}
                    {'  '}
                  </Text>
                  following
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    };

    return (
      <View style={{paddingHorizontal: 15}}>
        <View style={styles.profileSecConatiner}>
          {renderProfileShow()}
          {user && user !== 'guest' && renderEditButton()}
          {renderTextSection()}
        </View>
      </View>
    );
  };

  const renderTabBar = () => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
            marginTop: 10,
            marginBottom: 5,
          }}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </>
    );
  };

  const closePhotoModal = () => {
    if (!loader) {
      setisSHowChangePhoto(false);
      setcphoto(false);
    }
  };

  const renderShowCahngePhotoModal = () => {
    const renderHeader = () => {
      let text = 'review profile photo';

      const renderCross = () => {
        return (
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.5 : 1.0},
              styles.modalCross,
            ]}
            onPress={closePhotoModal}>
            <utils.vectorIcon.EvilIcons
              name="close"
              color={theme.color.title}
              size={30}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.section2Title1}>{text}</Text>;
      };

      return (
        <View style={{alignItems: 'center'}}>
          {renderTitle()}
          {renderCross()}
        </View>
      );
    };

    const renderButton = c => {
      return (
        <>
          <TouchableOpacity
            disabled={loader}
            onPress={() => {
              uploadPhoto(c);
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, {marginTop: 40}]}>
            {!loader ? (
              <Text style={styles.buttonTextBottom}>Confirm & Continue</Text>
            ) : (
              <ActivityIndicator size={18} color={theme.color.buttonText} />
            )}
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonSkip = () => {
      return (
        <>
          <TouchableOpacity
            disabled={loader}
            onPress={() => {
              closePhotoModal();
            }}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {backgroundColor: theme.color.button2},
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.subTitle,
                  textTransform: 'none',
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 14,
                },
              ]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    // const renderButtonCP = c => {
    //   return (
    //     <>
    //       <TouchableOpacity
    //         onPress={() => {
    //           changePhoto(c);
    //         }}
    //         activeOpacity={0.7}
    //         style={[
    //           styles.BottomButton,
    //           {
    //             marginTop: 12,
    //             backgroundColor: theme.color.background,
    //             borderWidth: 0.5,
    //             borderColor: theme.color.subTitle,
    //           },
    //         ]}>
    //         <Text
    //           style={[
    //             styles.buttonTextBottom,
    //             {
    //               color: theme.color.buttonTextGreen,
    //               fontFamily: theme.fonts.fontMedium,
    //             },
    //           ]}>
    //           Change Photo
    //         </Text>
    //       </TouchableOpacity>
    //     </>
    //   );
    // };

    let src =
      cphoto != ''
        ? {uri: cphoto.uri}
        : require('../../assets/images/imgLoad/img.jpeg');
    return (
      <MModal
        animationType="slide"
        visible={isSHowChangePhoto}
        transparent
        onRequestClose={() => {
          closePhotoModal();
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 15,
          }}>
          <View
            style={{
              backgroundColor: theme.color.background,
              borderRadius: 15,
              marginBottom: 15,
              padding: 18,
              width: '100%',
            }}>
            {renderHeader()}
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2LogoTitle}>
                If you are happy with the result, click Confirm & Continue below
                or try a different photo.
              </Text>

              <TouchableOpacity
                style={styles.imageContainerP}
                activeOpacity={0.7}
                onPress={() =>
                  Platform.OS == 'android' ? changePhoto('photoViewC') : null
                }>
                <Image source={src} style={styles.imageP} />
              </TouchableOpacity>
            </View>

            {renderButton('Profile')}
            {renderButtonSkip()}
            {/* {renderButtonCP('photoChange')} */}
          </View>
        </View>
      </MModal>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          {renderProfileSection()}
          <View style={{flex: 1}}>{isTabBarShow && renderTabBar()}</View>
          <Toast ref={toast} position="bottom" />
          {/* <utils.Loader2 load={Loader} /> */}

          {!isTabBarShow && (
            <utils.Footer
              nav={props.navigation}
              screen={headerTitle}
              focusScreen={store.General.focusScreen}
            />
          )}
          {renderShowCahngePhotoModal()}
        </View>
      </SafeAreaView>
      {pvm && (
        <utils.FullimageModal
          show={pvm}
          pv={pv}
          setshow={c => setpvm(c)}
          setpv={c => setpv(c)}
        />
      )}
    </View>
  );
}
