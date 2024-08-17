import { getServerSession } from "next-auth";
import { authOptions } from "./lib/options";
import MoodForm from "./components/MoodForm";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <MoodForm />;
  }

  return (
    <main className="p-4">
      <div className="mb-4">
        Welcome to Mood Journey, where you can visualize trends in your mood. It
        works like a daily diary and it works the best if you use it every day.
        Sign in above to get started!
      </div>
      <div className="w-[500px] mx-auto rounded-lg shadow-lg p-4 mb-4 bg-slate-800">
        <div className="font-brand text-xl mb-4">Aug 16, 2024</div>
        <div>
          Please note: this is a demo application that I built for fun. Your
          data is NOT secure. Don&apos;t say anything here that would put you or
          anyone else at risk. In a later update I plan to encrypt all user data
          so there is a degree of privacy, but currently there is very little.
        </div>
      </div>
    </main>
  );
}
