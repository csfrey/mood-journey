"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MoodDocument } from "../models/Mood";
import { HashLoader } from "react-spinners";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { parseDateString } from "../lib/utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Graph = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/");
  }

  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const response = await axios.get("/api/moods");
      return response.data as MoodDocument[];
    },
  });

  if (isPending || status === "loading") {
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
      <div className="font-brand text-center text-3xl mb-4">Your Moods</div>
      <div className="w-min h-min p-4 mx-auto rounded-lg">
        <LineChart width={700} height={500} data={data}>
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#6366f1"
            strokeWidth={5}
          />
          <CartesianGrid stroke="#fff" strokeDasharray={"1 4"} />
          <XAxis
            stroke="#fff"
            dataKey="createdAt"
            tickFormatter={(tick) => parseDateString(tick)}
          />
          <YAxis type="number" stroke="#fff" />
          <Tooltip
            formatter={(value, name, props) => {
              console.log(value, name, props);
              return `${value} (${parseDateString(props.payload.createdAt)})`;
            }}
          />
        </LineChart>
      </div>
    </main>
  );
};

export default Graph;
