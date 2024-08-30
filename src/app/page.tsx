import CreatePost from "@/components/create-post";
import GetPosts from "@/components/get-posts";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="grid grid-cols-2">
      <Hero />
      <div className="flex flex-col gap-10 overflow-hidden h-screen">
        <CreatePost />
        <GetPosts />
      </div>
    </main>
  );
}
