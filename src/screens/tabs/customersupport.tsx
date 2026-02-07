import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext'; 
import { useTheme } from '../../contexts/themeContext';

const SUPPORT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/870/870175.png';
const DEFAULT_USER_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const getBotResponse = (text: string) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('late') || lowerText.includes('time')) return "I apologize for the delay. The rider is currently 5 minutes away.";
  if (lowerText.includes('food') || lowerText.includes('burger')) return "Your food is being prepared with care! It should be ready shortly.";
  if (lowerText.includes('thank')) return "You're very welcome! Enjoy your meal when it arrives.";
  return "I see. Let me check the status of that request for you immediately.";
};

const TypingIndicator = ({ dotColor }: { dotColor: string }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true })
        ])
      );
    };
    Animated.parallel([animate(dot1, 0), animate(dot2, 200), animate(dot3, 400)]).start();
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }]
  });

  return (
    <View style={localStyles.typingContainer}>
      <Animated.View style={[localStyles.dot, dotStyle(dot1), { backgroundColor: dotColor }]} />
      <Animated.View style={[localStyles.dot, dotStyle(dot2), { backgroundColor: dotColor }]} />
      <Animated.View style={[localStyles.dot, dotStyle(dot3), { backgroundColor: dotColor }]} />
    </View>
  );
};

const CustomerSupport = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: colors.background, 
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          display: 'flex'
        },
      });
    };
  }, [navigation, colors]);

  const userAvatarSource = user?.photoURL 
    ? { uri: user.photoURL } 
    : { uri: DEFAULT_USER_AVATAR };

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi, how can I help you?', sender: 'support' },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsgText = input;
    
    const userMsg = { id: Date.now().toString(), text: userMsgText, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = getBotResponse(userMsgText);

    setTimeout(() => {
      const systemMsg = { 
        id: (Date.now() + 1).toString(), 
        text: responseText, 
        sender: 'support' 
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, systemMsg]);
    }, 2000);
  };

  const renderMessage = ({ item }: any) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.supportMessageContainer
      ]}>
        
        {!isUser && (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
            <Image 
              source={{ uri: SUPPORT_AVATAR }} 
              style={styles.avatar} 
            />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : { backgroundColor: colors.card },
          ]}>
          <Text style={[
              styles.messageText,
              isUser ? styles.userText : { color: colors.text }
          ]}>
            {item.text}
          </Text>
        </View>

        {isUser && (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
            <Image 
              source={userAvatarSource}  
              style={styles.avatar} 
            /> 
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isTyping) return null;
    return (
      <View style={[styles.messageContainer, styles.supportMessageContainer]}>
        
         <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
            <Image 
              source={{ uri: SUPPORT_AVATAR }} 
              style={styles.avatar} 
            />
          </View>
          <View style={[
              styles.messageBubble, 
              { width: 80, alignItems: 'center', backgroundColor: colors.card }
            ]}>
             <TypingIndicator dotColor={colors.textSecondary} />
          </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Ionicons name="menu" size={22} color={colors.text} />
      </View>

      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />

        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Type here..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            editable={!isTyping} 
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: isTyping ? 0.5 : 1 }]} 
            onPress={handleSend}
            disabled={isTyping}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  }
});

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'space-between',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  chatContainer: {
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  supportMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 10
  },
  userBubble: {
    backgroundColor: '#EF2A39',
  },
  
  messageText: {
    fontSize: 16,
    fontWeight:'bold',
    lineHeight: 18,
  },
  userText: {
    color: '#fff',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent:'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 14,
    height: 60
  },
  sendButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#EF2A39',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
});

export default CustomerSupport;