import Image from "next/image";
import ImageStack from "./components/ImageStack";
import Link from "next/link";

export default function Home() {
  const images = [
    "/Cuking.jpg",
    "/Cuking2.jpg",
    "/Cuking3.jpg",
    "/Cuking4.jpg",
    "/Cuking5.jpg",
  ];

  return (
    <div className="relative pb-30">
      <header className="flex justify-between">
        <h1 className="text-4xl flex items-start font-bold">
          dumel<span className="text-xl font-thin">Dump</span>
        </h1>
        <div>
          <Image
            src="/Cuking.jpg"
            width={50}
            height={50}
            alt={"Profil Image"}
            className="rounded-full"
          />
        </div>
      </header>
      <div className="flex gap-3 text-3xl mt-5 mb-12">
        <p>🤩</p>
        <p>😡</p>
        <p>😢</p>
        <p>😆</p>
        <p>🫤</p>
      </div>
      <main className="flex flex-col gap-8">
        <div className="bg-dumel-paper rounded-lg px-2">
          <div className="flex justify-between pt-3">
            <div className="flex items-center gap-3">
              <p className="text-4xl">😡</p>
              <h2 className="font-bold text-lg">Stupiiid People</h2>
            </div>
            <div className="pr-6">
              <span>...</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-3">
            <ImageStack images={images} />
            <div className="mt-10 pb-4">
              <p className="pl-2 line-clamp-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                soluta tempora expedita non. At itaque, aspernatur illo
                molestiae saepe assumenda quas minus voluptatem quaerat, libero
                reiciendis possimus laborum ipsa veniam hic repellat animi
                accusamus. Incidunt obcaecati tempora, officia facere inventore
                nemo maiores molestiae distinctio praesentium iste, quidem sunt
                quo assumenda?
              </p>
            </div>
          </div>
        </div>
        <div className="bg-dumel-paper rounded-lg px-2">
          <div className="flex justify-between pt-3">
            <div className="flex items-center gap-3">
              <p className="text-4xl">😡</p>
              <h2 className="font-bold text-lg">Stupiiid People</h2>
            </div>
            <div className="pr-6">
              <span>...</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-3">
            <ImageStack images={images} />
            <div className="mt-10">
              <p className="pl-2 pb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                ipsam, dolor qui nisi hic architecto adipisci. Mollitia aperiam
                illum hic.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="w-[100px] text-center z-[9999] fixed bottom-4 right-5 bg-dumel-yellow  rounded-full">
        <Link href="/posts/create" className="text-8xl">
          +
        </Link>
      </div>
    </div>
  );
}
