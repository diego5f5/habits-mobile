import { useCallback, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { HabitDay, DAY_SIZE } from "../../components/HabitDay";

import { generateRangeDatesFromYearStart } from "../../utils/generateRangeDatesFromYearStart";

import { api } from "../../lib/axios";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

interface SummaryProps {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps[]>([]);

  const { navigate } = useNavigation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/summary");

      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops!", "Could not load habit summary.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

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
          {datesFromYearStart.map((date) => {
            const dayWithHabits = summary.find((day) => {
              return dayjs(date).isSame(day?.date, "day");
            });

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amountOfHabits={dayWithHabits?.amount}
                amountCompleted={dayWithHabits?.completed}
                onPress={() => navigate("Habit", { date: date.toISOString() })}
              />
            );
          })}

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
