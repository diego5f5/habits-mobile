import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import clsx from "clsx";

import { BackButton } from "../../components/BackButton";
import { ProgressBar } from "../../components/ProgressBar";
import { Checkbox } from "../../components/Checkbox";
import { Loading } from "../../components/Loading";
import { HabitsEmpty } from "../../components/HabitsEmpty";

import { generateProgressPercentage } from "../../utils/generate-progress-percentage";

import { api } from "../../lib/axios";

interface HabitParams {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: Array<{
    id: string;
    title: string;
  }>;
}

export const Habit = () => {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("MM/DD");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo?.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);

      const response = await api.get("/day", { params: { date } });

      setDayInfo(response.data);
      setCompletedHabits(response?.data?.completedHabits);
    } catch (error) {
      Alert.alert("Ops!", "Could not load habit information.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = (habitId: string) => {
    api
      .patch(`/habits/${habitId}/toggle`)
      .then(() => {
        if (completedHabits?.includes(habitId)) {
          setCompletedHabits((prev) =>
            prev.filter((habit) => habit !== habitId)
          );
        } else {
          setCompletedHabits((prev) => [...prev, habitId]);
        }
      })
      .catch(() => {
        Alert.alert("Ops!", "Unable to update habit status.");
      });
  };

  if (loading) {
    return <Loading />;
  }

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

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map((habit) => {
              return (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              );
            })
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            It is not possible to edit a habit from a past date.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
