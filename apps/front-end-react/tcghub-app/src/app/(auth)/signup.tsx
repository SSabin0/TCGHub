
import { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(
        'http://100.65.32.184:8080/api/v1/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        },
      );

      if (!response.ok) {
        setError(
          'Account creation failed. Check your details or try another username or email.',
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>TCG HUB</Text>
          <Text style={styles.subtitle}>YOUR NEXT TRADE STARTS HERE</Text>
        </View>

        <View style={styles.form}>
          <Text variant="headlineMedium" style={styles.title}>
            Create your account
          </Text>

          <Text style={styles.description}>
            Join other Planeswalkers and find your next trade.
          </Text>

          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            autoCapitalize="words"
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
          />

          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            autoCapitalize="words"
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
          />

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
            right={
              <TextInput.Icon
                icon={passwordVisible ? 'eye-off' : 'eye'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {success ? (
            <Text style={styles.success}>
              Account created successfully! You can now sign in.
            </Text>
          ) : null}

          {success ? (
            <Button
              mode="contained"
              onPress={() => router.replace('/(auth)/login')}
              buttonColor="#171717"
              textColor="#E2D7BD"
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Go to Sign In
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              buttonColor="#171717"
              textColor="#E2D7BD"
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.loginLink}>
              Sign In
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>Built for the love of the game.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    color: '#171717',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#655D50',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 8,
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  title: {
    color: '#171717',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#655D50',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F4EBDD',
    marginBottom: 16,
  },
  error: {
    color: '#A12626',
    fontSize: 13,
    marginBottom: 12,
  },
  success: {
    color: '#276738',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
  },
  buttonContent: {
    height: 48,
  },
  loginContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#655D50',
  },
  loginLink: {
    color: '#171717',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    color: '#817663',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 36,
  },
});
