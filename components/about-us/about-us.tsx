// app/about/page.tsx or pages/about.tsx
import { BadgeCheck } from "lucide-react"

export default function AboutUsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-10">
      <h1 className="text-4xl font-bold">About Thriftee</h1>

      <p className="text-muted-foreground text-lg">
        At <span className="font-semibold text-foreground">Thriftee</span>, we believe in giving clothes a second life—and the planet a second chance. We're building a trusted platform for buying{" "}
        <span className="font-medium">secondhand clothing</span>, grounded in authenticity and sustainability.
      </p>

      <div className="space-y-6">
        <Section
          title="Our Mission"
          content="We're not just about fashion—we're about impact. Thriftee fights fast fashion by enabling circular shopping that's smarter, cleaner, and more conscious."
        />
        <Section
          title="Verified Authentic"
          content="Every item is checked for authenticity. What you see is what you get—no compromises."
          icon={<BadgeCheck className="text-emerald-500 dark:text-emerald-300 inline-block mb-1" size={20} />}
        />
        <Section
          title="Circular Fashion"
          content="We’re here to reshape consumption. Thrifting is more than a trend—it’s a movement toward a circular economy where reuse is the new norm."
        />
        <Section
          title="The Team"
          content="We’re a small team of builders, creatives, and sustainability advocates. As a purpose-driven startup, we aim to make fashion ethical, affordable, and responsible."
        />
      </div>
    </div>
  );
}

function Section({ title, content, icon }: { title: string; content: string; icon?: React.ReactNode }) {
  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {title}
        {icon}
      </h2>
      <p className="text-muted-foreground mt-1">{content}</p>
    </div>
  );
}
