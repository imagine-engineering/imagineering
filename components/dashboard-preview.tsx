import Image from "next/image" // Import the Image component

export function DashboardPreview() {
  return (
    <figure className="w-[calc(100vw-32px)] md:w-[1160px]">
      <div className="bg-primary-light/50 rounded-2xl p-2 shadow-2xl">
        <Image
          src="/images/copper-origin-dev.jpg"
          alt="Copper development build with Rust source code and the Cargo workspace panel"
          priority
          width={3072}
          height={2192}
          className="w-full h-auto aspect-[2320/1289] object-cover object-top rounded-xl shadow-lg"
        />
      </div>
      <figcaption className="mt-3 text-center text-muted-foreground text-xs">
        Copper development build: Rust editor and Cargo panel.
      </figcaption>
    </figure>
  )
}
