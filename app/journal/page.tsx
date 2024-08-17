"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MoodDocument } from "@/app/models/Mood";
import { HashLoader } from "react-spinners";
import { calculateColorInRange, parseDateString } from "../lib/utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Journal = () => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const response = await axios.get("/api/moods");
      return response.data as MoodDocument[];
    },
  });

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/");
  }

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
    <main className="p-4 flex flex-col-reverse gap-4">
      {data.map((mood) => {
        const bgColor = calculateColorInRange(
          mood.rating,
          "#be123c",
          "#15803d"
        );
        return (
          <div className="w-[500px] p-4 pb-0 mx-auto bg-slate-800 rounded-lg shadow-lg">
            <div
              className={`float-left mr-4 mb-2 font-brand text-center text-xl rounded-full w-16 h-16 flex flex-col justify-center`}
              style={{
                backgroundColor: bgColor,
              }}
            >
              {mood.rating}
            </div>
            <div className="mb-2">{parseDateString(mood.createdAt)}</div>
            <div className="mb-4">
              <span className="text-3xl font-brand ml-4 mr-2">{">"}</span>
              {mood.remarks}
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default Journal;
