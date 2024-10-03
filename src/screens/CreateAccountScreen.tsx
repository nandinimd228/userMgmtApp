import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../utils/api';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^[a-zA-Z0-9]*$/, 'Password can only contain letters and numbers'),
});

const CreateAccountScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await api.post('userAccount', values);
      navigation.navigate('Success');
    } catch (error) {
      Alert.alert(
        'Error',
        'There was an issue creating your account. Please try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity accessibilityRole="header">
        <Text style={styles.title}>Create Account</Text>
      </TouchableOpacity>

      <Formik
        initialValues={{name: '', email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <InputField
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
            />
            {errors.name && (
              <TouchableOpacity accessibilityRole="alert">
                <Text>{errors.name}</Text>
              </TouchableOpacity>
            )}
            <InputField
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {errors.email && (
              <TouchableOpacity accessibilityRole="alert">
                <Text>{errors.email}</Text>
              </TouchableOpacity>
            )}
            <InputField
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {errors.password && (
              <TouchableOpacity accessibilityRole="alert">
                <Text>{errors.password}</Text>
              </TouchableOpacity>
            )}
            <Button title="Create Account" onPress={() => handleSubmit()} />
            <Text>
              <Text style={styles.footerText}>Already a User? </Text>
              <Text
                style={styles.createAccountText}
                onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </Text>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoContainer: {
    marginHorizontal: '20%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  createAccountText: {
    fontWeight: 'bold',
    color: '#D83B34',
  },
});

export default CreateAccountScreen;
