"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MoodDocument } from "@/app/models/Mood";
import { HashLoader } from "react-spinners";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";

type DailyMoods = {
  date: Date;
  rating: number;
};

type Series = {
  label: string;
  data: DailyMoods[];
};

const Graph = () => {
  const [data, setData] = useState<Series[]>([]);
  const [isBuilding, setIsBuilding] = useState(true);
  const {
    isPending,
    isError,
    isSuccess,
    data: moods,
    error,
  } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const response = await axios.get("/api/moods");
      return response.data as MoodDocument[];
    },
  });
  const primaryAxis = useMemo(
    (): AxisOptions<DailyMoods> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyMoods>[] => [
      {
        getValue: (datum) => datum.rating,
      },
    ],
    []
  );

  useEffect(() => {
    if (isSuccess) {
      setData([
        {
          label: "Your Moods",
          data: moods.map((mood) => ({
            date: new Date(mood.createdAt),
            rating: mood.rating,
          })),
        },
      ]);

      setIsBuilding(false);
    }
  }, [isSuccess]);

  if (isPending || isBuilding) {
    return (
      <main className="p-4 py-16 w-full flex justify-center">
        <HashLoader color="#60a5fa" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-4 py-16 w-full flex justify-center">
        <div>Error: {error?.message}</div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="w-[500px] h-[500px] bg-white">
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </main>
  );
};

export default Graph;
