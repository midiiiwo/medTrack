import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Checkbox, Switch } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RootStackParamList } from "../../../App";
import { useAuth } from "../../hooks/useAuth";
import { Medication, TimeOfDay } from "../../types/medication";
import { generateId, saveMedication } from "../../utils/storageService";
import { getCurrentDate, formatDate } from "../../utils/dateUtils";

type AddMedicationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddMedication"
>;

type FormData = {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
};

const AddMedicationScreen = () => {
  const navigation = useNavigation<AddMedicationNavigationProp>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<TimeOfDay[]>([]);

  // Start date picker
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  // End date picker
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasEndDate, setHasEndDate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "Daily",
      startDate: startDate.toISOString(),
      instructions: "",
    },
  });

  const toggleTimeOfDay = (time: TimeOfDay) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!user) {
        setError("User is not authenticated");
        return;
      }

      if (selectedTimes.length === 0) {
        setError("Please select at least one time of day");
        return;
      }

      setIsLoading(true);
      setError(null);

      const newMedication: Medication = {
        id: generateId(),
        userId: user.id,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        timeOfDay: selectedTimes,
        startDate: startDate.toISOString(),
        endDate: hasEndDate && endDate ? endDate.toISOString() : undefined,
        instructions: data.instructions,
        createdAt: getCurrentDate(),
      };

      await saveMedication(newMedication);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save medication:", error);
      setError("Failed to save medication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const frequencyOptions = ["Daily", "Every other day", "Weekly", "As needed"];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-2xl font-bold text-primary mb-6">
          Add New Medication
        </Text>

        {error && (
          <View className="bg-red-100 p-3 rounded-md mb-4">
            <Text className="text-danger">{error}</Text>
          </View>
        )}

        <Controller
          control={control}
          rules={{ required: "Medication name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Medication Name"
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
          rules={{ required: "Dosage is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Dosage (e.g., 10mg, 1 tablet)"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.dosage}
              className="mb-2"
              style={{ backgroundColor: "white" }}
            />
          )}
          name="dosage"
        />
        {errors.dosage && (
          <Text className="text-danger text-xs mb-3">
            {errors.dosage.message}
          </Text>
        )}

        <Text className="font-semibold text-text my-2">Frequency</Text>
        <View className="mb-4">
          {frequencyOptions.map((option) => (
            <Controller
              key={option}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  onPress={() => onChange(option)}
                  className="flex-row items-center py-2"
                >
                  <View
                    className={`w-5 h-5 rounded-full mr-3 ${
                      value === option
                        ? "bg-secondary"
                        : "border border-gray-400"
                    }`}
                  />
                  <Text>{option}</Text>
                </TouchableOpacity>
              )}
              name="frequency"
            />
          ))}
        </View>

        <Text className="font-semibold text-text my-2">Time of Day</Text>
        <View className="flex-row flex-wrap mb-4">
          {["morning", "afternoon", "evening", "night"].map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => toggleTimeOfDay(time as TimeOfDay)}
              className="flex-row items-center mr-6 mb-2"
            >
              <Checkbox
                status={
                  selectedTimes.includes(time as TimeOfDay)
                    ? "checked"
                    : "unchecked"
                }
                color="#86BBD8"
              />
              <Text className="ml-1 capitalize">{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-semibold text-text my-2">Start Date</Text>
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          className="bg-white border border-gray-300 rounded-md p-3 mb-4"
        >
          <Text>{formatDate(startDate.toISOString())}</Text>
        </TouchableOpacity>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        <View className="flex-row items-center mb-2">
          <Text className="font-semibold text-text mr-2">Has End Date</Text>
          <Switch
            value={hasEndDate}
            onValueChange={setHasEndDate}
            color="#86BBD8"
          />
        </View>

        {hasEndDate && (
          <>
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              className="bg-white border border-gray-300 rounded-md p-3 mb-4"
            >
              <Text>
                {endDate
                  ? formatDate(endDate.toISOString())
                  : "Select End Date"}
              </Text>
            </TouchableOpacity>

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={startDate}
              />
            )}
          </>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Special Instructions (optional)"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={3}
              className="mb-4"
              style={{ backgroundColor: "white" }}
            />
          )}
          name="instructions"
        />
        <View className="mt-4 ">
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            className="py-1 bg-primary rounded-md"
          >
            Add Medication
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddMedicationScreen;
