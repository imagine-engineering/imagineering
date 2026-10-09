import Image from "next/image"

export function SocialProof() {
  return (
    <section className="self-stretch py-16 flex flex-col justify-center items-center gap-6 overflow-hidden">
      <div className="text-center text-muted-foreground text-sm font-medium leading-tight">
        Rust tooling and editor functions in Copper
      </div>
      <div className="self-stretch grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {["Rust", "Cargo", "rust-analyzer", "Git", "Terminal", "Debugger", "Agents", "ACP"].map((tool, i) => (
          <Image
            key={i}
            src={`/images/tooling/tool-${i + 1}.svg`}
            alt={tool}
            width={400}
            height={120}
            className="w-full max-w-[400px] h-auto object-contain grayscale opacity-70"
          />
        ))}
      </div>
    </section>
  )
}
