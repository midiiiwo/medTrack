import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useAuth } from "../../hooks/useAuth";

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await signup(data.name, data.email, data.password);
      // Navigation will be handled by the AuthContext when isAuthenticated changes
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-3xl font-bold text-primary mb-2">
          Create Account
        </Text>
        <Text className="text-textLight mb-8">
          Sign up to start tracking your medications
        </Text>

        {error && (
          <View className="bg-red-100 p-3 rounded-md mb-4">
            <Text className="text-danger">{error}</Text>
          </View>
        )}

        <Controller
          control={control}
          rules={{
            required: "Name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Full Name"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.name}
              className="mb-2"
              style={{ backgroundColor: "white" }}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text className="text-danger text-xs mb-3">
            {errors.name.message}
          </Text>
        )}

        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              className="mb-2"
              style={{ backgroundColor: "white" }}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text className="text-danger text-xs mb-3">
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              error={!!errors.password}
              className="mb-2"
              style={{ backgroundColor: "white" }}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text className="text-danger text-xs mb-3">
            {errors.password.message}
          </Text>
        )}

        <Controller
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              error={!!errors.confirmPassword}
              className="mb-2"
              style={{ backgroundColor: "white" }}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text className="text-danger text-xs mb-3">
            {errors.confirmPassword.message}
          </Text>
        )}
        <View className="mt-6">
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-6 py-1 bg-primary rounded-md"
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              "Create Account"
            )}
          </Button>
        </View>
        <View className="flex-row justify-center mt-6">
          <Text className="text-textLight mr-2">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-primary font-semibold">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
