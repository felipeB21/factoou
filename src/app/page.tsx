import CreatePost from "@/components/create-post";
import GetPosts from "@/components/get-posts";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="grid grid-cols-2 h-screen">
      <Hero />
      <div className="flex flex-col gap-10 w-[40dvw]">
        <CreatePost />
        <GetPosts />
      </div>
    </main>
  );
}
