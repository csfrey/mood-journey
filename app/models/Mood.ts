import mongoose, { Schema, model } from "mongoose";

export interface MoodDocument {
  _id: string;
  userEmail: string;
  rating: number;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoodSchema = new Schema<MoodDocument>(
  {
    userEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Mood = mongoose.models?.Mood || model<MoodDocument>("Mood", MoodSchema);

export default Mood;
