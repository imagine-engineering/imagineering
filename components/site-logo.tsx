import Image from "next/image"

/** The adjacent wordmark supplies the accessible name; the supplied artwork stays static. */
export function SiteLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/images/imagineering-logo.png"
      alt=""
      aria-hidden="true"
      width={28}
      height={28}
      priority={priority}
      className="block h-7 w-7 shrink-0 object-contain"
    />
  )
}
