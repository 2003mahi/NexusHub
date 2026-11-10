import Footer from "../components/Footer";
import Hero from "../components/ecosystem/Hero";
import SymbioticLoop from "../components/ecosystem/SymbioticLoop";
import InitiativeCard from "../components/ecosystem/InitiativeCard";
import AccessBanner from "../components/ecosystem/AccessBanner";

export const metadata = {
  title: "Ecosystem – NexusHub",
  description: "Explore NexusHub initiatives and see how they connect to empower innovators.",
};

const initiatives = [
  {
    id: "resources",
    title: "Curated Resources",
    description: "Hand‑picked tutorials, articles and tools that accelerate learning.",
    icon: "/globe.svg",
    href: "/resources",
  },
  {
    id: "projects",
    title: "Collaborative Projects",
    description: "Build, manage and showcase team projects within an integrated workspace.",
    icon: "/file.svg",
    href: "/projects",
  },
  {
    id: "mentors",
    title: "Mentor Marketplace",
    description: "Connect with experienced mentors for guidance, feedback and career advice.",
    icon: "/window.svg",
    href: "/mentors",
  },
];

export default function EcosystemPage() {
  return (
    <>
      <Hero />

      <SymbioticLoop />

      <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto" id="initiatives">
        <h2 className="text-3xl font-semibold mb-8 text-primary text-center">Our Initiatives</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {initiatives.map((item) => (
            <InitiativeCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              href={item.href}
            />
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted px-4 md:px-8" id="value">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Why It Matters</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each initiative works together to create a seamless experience: resources fuel projects, projects attract mentors, and mentors guide learners. This symbiotic loop accelerates personal growth and community impact.
          </p>
        </div>
      </section>

      <AccessBanner />

      <Footer />
    </>
  );
}
