import { useRoute } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import dayjs from "dayjs";

import { BackButton } from "../../components/BackButton";
import { ProgressBar } from "../../components/ProgressBar";
import { Checkbox } from "../../components/Checkbox";

interface HabitParams {
  date: string;
}

export const Habit = () => {
  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("MM/DD");

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={60} />

        <View className="mt-6">
          <Checkbox title="Drink water" checked onPress={() => {}} />
          <Checkbox title="Walk the dog" checked={false} onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
};
