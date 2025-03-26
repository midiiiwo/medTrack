import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useAuth } from '../../hooks/useAuth';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await login(data.email, data.password);
      // Navigation will be handled by the AuthContext when isAuthenticated changes
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-6">
      <View className="items-center mb-10 mt-10">
        <Image
          source={require('../../../assets/icon.png')}
          className="w-20 h-20 mb-4"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-primary">medTrack</Text>
        <Text className="text-textLight mt-2 text-center">
          Track your medications and never miss a dose
        </Text>
      </View>

      {error && (
        <View className="bg-red-100 p-3 rounded-md mb-4">
          <Text className="text-danger">{error}</Text>
        </View>
      )}

      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
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
            style={{ backgroundColor: 'white' }}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text className="text-danger text-xs mb-3">{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
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
            style={{ backgroundColor: 'white' }}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text className="text-danger text-xs mb-3">{errors.password.message}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="mt-6 py-1 bg-primary rounded-md"
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          'Sign In'
        )}
      </Button>

      <View className="flex-row justify-center mt-6">
        <Text className="text-textLight mr-2">Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text className="text-primary font-semibold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
