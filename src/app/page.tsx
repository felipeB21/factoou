import CreatePost from "@/components/create-post";
import GetPosts from "@/components/get-posts";

export default function Home() {
  return (
    <main className="flex justify-between">
      <h1 className="text-5xl font-bold uppercase">
        <span className="p-1 bg-yellow-400/50">Factoou</span> of the day
      </h1>
      <div className="flex flex-col gap-10 xl:max-w-[26dvw] overflow-hidden h-screen">
        <CreatePost />
        <GetPosts />
      </div>
    </main>
  );
}
