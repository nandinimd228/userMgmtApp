import React from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from '../utils/api';
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email format"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await api.post("login", values);
      const user = response.data;
      dispatch(setUser({ accountId: user.accountId, email: user.email }));
      navigation.navigate("Dashboard");
    } catch (error: any) {
        Alert.alert("Login Error", "Invalid email or password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <InputField
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              errorMessage={errors.email}
            />
            <InputField
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
              errorMessage={errors.password}
            />
            <Button title="Login" onPress={handleSubmit} />
            <Text style={styles.footerText}>
              New User?
              <Text 
                style={styles.createAccountText} 
                onPress={() => navigation.navigate("CreateAccount")}
              >
                Create Account
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
    justifyContent: "center",
  },
  logoContainer: {
    marginHorizontal: "20%",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  footerText: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  createAccountText: {
    fontWeight: "bold",
    color: "#D83B34",
  },
});

export default LoginScreen;
