import { connectDB } from "@/app/lib/mongodb";
import { authOptions } from "@/app/lib/options";
import Mood from "@/app/models/Mood";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const moods = await Mood.find({ userEmail: session?.user?.email });
    return NextResponse.json(moods, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch moods!" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { rating, remarks } = await req.json();

    if (!!session?.user?.email) {
      const newMood = new Mood({
        userEmail: session?.user?.email,
        rating,
        remarks,
      });

      await newMood.save();

      return NextResponse.json(newMood, { status: 201 });
    } else {
      throw new Error("Couldn't find user email!");
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}
