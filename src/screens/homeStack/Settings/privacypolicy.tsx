import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native'; 
import { useTheme } from '../../../contexts/themeContext';

const PrivacyPolicy = () => {
  const { colors } = useTheme();
  const navigation = useNavigation(); 

  const themeScript = `
    document.body.style.backgroundColor = "${colors.background}";
    document.body.style.color = "${colors.text}";
    true;
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <WebView
        originWhitelist={['*']}
        source={require('../../../assets/privacy-policy.html')}
        showsVerticalScrollIndicator={false}
        containerStyle={{ backgroundColor: colors.background }}
        style={{ backgroundColor: colors.background }}
        injectedJavaScript={themeScript}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'GO_BACK') {
            navigation.goBack();
          }
        }}
      />
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: { flex: 1 },
});