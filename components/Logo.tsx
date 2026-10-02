import Image from "next/image";

// Logo autentico (file vettoriale Solace): monogramma SR + wordmark con payoff.
export default function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <span className="logo">
      <Image src="/brand/monogram.svg" alt="" width={302} height={287} className="logo__mark" priority unoptimized />
      <Image
        src={variant === "light" ? "/brand/wordmark.svg" : "/brand/wordmark-dark.svg"}
        alt="Solace Real Estate Short Rent"
        width={912}
        height={190}
        className="logo__word"
        priority
        unoptimized
      />
    </span>
  );
}
