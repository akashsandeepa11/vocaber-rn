import {
  View,
  Text,
  StatusBar,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { auth, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, signIn } from "../store/reducers/AuthSlice";
import LanguageSelectorModal from "./../modals/LanguageSelectorModal";

// const signInWithGoogle = async () => {
//   try {
//     await signInWithPopup(auth, googleProvider);
//   } catch (error) {
//     console.log(error);
//   }
// };

console.log(auth?.currentUser);

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email."),
  password: Yup.string()
    .min(6, "Must contain  minimum 6 characters")
    .required("Please enter your password"),
  confirmPassword: Yup.string()
    .min(6, "Must contain  minimum 6 characters")
    .oneOf([Yup.ref("password")], "Your Password do not match")
    .required("Confirm Password is required"),
});

export default function SignUpScreen({ route }) {
  const { promptAsync } = route.params;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = useSelector(selectAuth);
  const [yourLanguage, setYourLanguage] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);

  // toggle Modal
  const toggleModal = (modalSetter) => {
    modalSetter((prev) => !prev);
  };

  const signUp = async (data) => {
    const { email, password } = data;
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          console.log("sign up", userCredential._tokenResponse.idToken);
          console.log("Sign in Auth ", userId);
          dispatch(signIn(userCredential._tokenResponse.idToken));
          // await AsyncStorage.setItem(
          //   "@user",
          // JSON.stringify(userCredenti/al._tokenResponse.idToken)
          // );
        })
        .catch((err) => {
          alert(err);
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View className="bg-white flex-1 ">
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View className="items-center mt-[70] mx-5 ">
        <Text className=" text-2xl text-[#1e6aca] font-bold">Sign Up</Text>
        <Text className="my-3 w-full">
          Please Registration with Email and SignUp to continue using our app
        </Text>
        {/* Formik  */}
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => signUp(values)}
          validationSchema={SignupSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            setFieldTouched,
          }) => (
            <View className="w-full">
              <View className="border w-full border-gray-500 p-3 rounded-[24px] mt-5">
                <TextInput
                  // autoCapitalize={false}
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  value={values.email}
                  placeholder="Email"
                />
              </View>
              {touched.email && errors.email && (
                <View className=" items-end px-4">
                  <Text className="text-red-600 ">{errors.email}</Text>
                </View>
              )}

              {/* Language */}
              <Pressable
                onPress={() => toggleModal(setModalVisible)}
                className="border w-full border-gray-500 p-4 rounded-[24px] mt-5"
              >
                <Text className="ml-2 ">
                  {yourLanguage === null
                    ? "Select your language"
                    : `${yourLanguage.name}`}
                </Text>
              </Pressable>

              <View className="border w-full border-gray-500 p-3 rounded-[24px] mt-5">
                <TextInput
                  // autoCapitalize={false}
                  onChangeText={handleChange("password")}
                  onBlur={() => setFieldTouched("password")}
                  value={values.password}
                  placeholder="Password"
                />
              </View>
              {touched.password && errors.password && (
                <View className=" items-end px-4">
                  <Text className="text-red-600 ">{errors.password}</Text>
                </View>
              )}

              <View className="border w-full border-gray-500 p-3 rounded-[24px] mt-5">
                <TextInput
                  // autoCapitalize={false}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={() => setFieldTouched("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder="Confirm Password"
                />
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <View className=" items-end px-4">
                  <Text className="text-red-600 ">
                    {errors.confirmPassword}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                disabled={!isValid}
                onPress={handleSubmit}
                title="submit"
                className="bg-[#1e6aca] items-center justify-center p-4 mt-5 rounded-[24px]"
              >
                <Text className="text-white text-[16px] font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            //  <View>
            //    <TextInput
            //      onChangeText={handleChange('email')}
            //      onBlur={handleBlur('email')}
            //      value={values.email}
            //    />
            //    <Button onPress={handleSubmit} title="Submit" />
            //  </View>
          )}
        </Formik>

        <Text className="text-lg my-3">or</Text>

        <View className="w-full">
          <Pressable
            onPress={() => promptAsync()}
            className="border flex-row items-center justify-center w-full border-gray-500 p-3 rounded-[24px] mt-3"
          >
            <Image
              source={require("./../../assets/google-logo.png")}
              className="w-[30] h-[30] mr-3"
            />
            <Text>Continue with Google</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.navigate("SignIn")}
          className="flex-row mt-5"
        >
          <Text className="font-medium">You already have an account?</Text>
          <Text className="font-medium text-[#1e6aca] font-bold"> Sign In</Text>
        </Pressable>
      </View>

      <LanguageSelectorModal
        isModalVisible={isModalVisible}
        toggleModal={() => toggleModal(setModalVisible)}
        language={yourLanguage}
        setLanguage={setYourLanguage}
      />
    </View>
  );
}
