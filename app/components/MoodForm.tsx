"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { MoodDocument } from "@/app/models/Mood";
import Link from "next/link";

type MoodFormState =
  | "undetermined"
  | "newEntry"
  | "entrySuccess"
  | "alreadyEnteredToday";

const MoodForm = () => {
  const [formState, setFormState] = useState<MoodFormState>("undetermined");
  const [slider, setSlider] = useState(50);
  const {
    isPending,
    isError,
    isSuccess: querySuccess,
    data,
    error,
  } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const response = await axios.get("/api/moods");
      return response.data as MoodDocument[];
    },
  });

  const { mutate: createMood, isSuccess: submitSuccess } = useMutation({
    mutationFn: (mood: Partial<MoodDocument>) => {
      return axios.post("/api/moods", mood);
    },
  });

  useEffect(() => {
    const madeToday = data?.find((mood: MoodDocument) => {
      const today = new Date();
      const createdAt = new Date(mood.createdAt);

      return (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    });

    if (!!madeToday) {
      setFormState("alreadyEnteredToday");
    } else {
      setFormState("newEntry");
    }
  }, [querySuccess]);

  useEffect(() => {
    if (submitSuccess) {
      setFormState("entrySuccess");
    }
  }, [submitSuccess]);

  function handleSubmit(event: any) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const mood: Partial<MoodDocument> = {};
    for (let [key, value] of formData.entries()) {
      if (key === "rating") {
        mood.rating = Number(value);
      }

      if (key === "remarks") {
        mood.remarks = (value ?? "") as string;
      }
    }

    createMood(mood);
    setFormState("undetermined");
  }

  const moodFormMain = (
    <main className="p-4">
      <div className="w-[500px] p-4 mx-auto bg-slate-800 rounded-lg shadow-lg">
        <div className="">How are you feeling today?</div>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <input
              name="rating"
              type="range"
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="w-full h-2 my-6 mr-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="my-auto w-16 text-center rounded-lg bg-gray-700 p-1.5">
              {slider}%
            </div>
          </div>
          <textarea
            rows={4}
            name="remarks"
            className="rounded-lg bg-gray-700 w-full mb-6 p-2"
            placeholder="Add a note if you like..."
          />
          <button
            type="submit"
            className="bg-blue-400 w-full hover:bg-blue-500 rounded-lg p-2"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );

  const loadingBox = (
    <main className="p-4 py-16 w-full flex justify-center">
      <HashLoader color="#60a5fa" />
    </main>
  );

  const alreadyEnteredToday = (
    <main className="p-4">
      <div className="w-[500px] p-4 mx-auto bg-slate-800 rounded-lg shadow-lg">
        <div className="mb-4">You've already entered a Mood for today!</div>
        <div className="flex justify-center">
          <button
            onClick={() => setFormState("newEntry")}
            className="bg-blue-400 hover:bg-blue-500 rounded-lg p-2 font-brand"
          >
            Enter another?
          </button>
        </div>
      </div>
    </main>
  );

  const submitConfirmation = (
    <main className="p-4">
      <div className="w-[500px] p-4 mx-auto bg-slate-800 rounded-lg shadow-lg">
        <div className="text-6xl text-green-400 flex justify-center">
          <FaCheck />
        </div>
        <div className="mb-4 text-center">Mood submitted!</div>
        <div className="mb-4 text-center">
          View trends in your mood on the Graph page, or read your past notes on
          the Journal page
        </div>
        <div className="w-full mb-4 flex justify-center gap-4 font-brand">
          <Link
            href="/graph"
            className="my-auto p-2 w-20 text-center rounded-lg bg-blue-400 hover:bg-blue-500"
          >
            Graph
          </Link>
          <Link
            href="/journal"
            className="my-auto p-2 w-20 text-center rounded-lg bg-blue-400 hover:bg-blue-500"
          >
            Journal
          </Link>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setFormState("newEntry")}
            className="bg-blue-400 hover:bg-blue-500 rounded-lg p-2 font-brand"
          >
            Enter another?
          </button>
        </div>
      </div>
    </main>
  );

  const errorBox = (
    <main className="p-4 py-16 w-full flex justify-center">
      <div>Error: {error?.message}</div>
    </main>
  );

  if (isPending || formState === "undetermined") {
    return loadingBox;
  }

  if (isError) {
    return errorBox;
  }

  if (formState === "newEntry") {
    return moodFormMain;
  }

  if (formState === "alreadyEnteredToday") {
    return alreadyEnteredToday;
  }

  if (formState === "entrySuccess") {
    return submitConfirmation;
  }

  return null;
};

export default MoodForm;
