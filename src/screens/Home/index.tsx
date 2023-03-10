import { Text, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { HabitDay, DAY_SIZE } from "../../components/HabitDay";

import { generateRangeDatesFromYearStart } from "../../utils/generateRangeDatesFromYearStart";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

export const Home = () => {
  const { navigate } = useNavigation();

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => (
            <HabitDay
              onPress={() => navigate("Habit", { date: date.toISOString() })}
              key={date.toString()}
            />
          ))}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={`empty-day-${index}`}
                className={
                  "bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                }
                style={{
                  width: DAY_SIZE,
                  height: DAY_SIZE,
                }}
              ></View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};
