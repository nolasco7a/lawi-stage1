import { ArrowRight, Briefcase, Building2, Scale } from "lucide-react";

// Mock Data (This simulates the props you would pass)
const lawyerData = {
  name: "Elena Velasco",
  firm: "Velasco & Partners",
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
  specialties: ["Derecho Penal", "Corporativo"],
};

interface LawyerCardProps {
  name: string;
  firm: string;
  image: string;
  specialties: string[];
}

export const LawyerCard = ({ name, firm, image, specialties }: LawyerCardProps) => {
  return (
    <div className="group relative w-full max-w-[350px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Image Section with subtle interaction */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <img
          src={lawyerData.image}
          alt={lawyerData.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay for text readability if needed, or aesthetic touch */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick Action: Firm Name appearing on image hover (Optional sleek touch) */}
        <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="flex items-center gap-2 text-xs font-medium text-white/90">
            <Building2 className="h-3 w-3" />
            {lawyerData.firm}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Header: Name and Firm */}
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {lawyerData.name}
          </h3>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            {lawyerData.firm}
          </p>
        </div>

        {/* Specialties (Badges) */}
        <div className="flex flex-wrap gap-2">
          {lawyerData.specialties.slice(0, 2).map((specialty, index) => (
            <span
              key={specialty}
              className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              {index === 0 ? (
                <Scale className="mr-1 h-3 w-3" />
              ) : (
                <Briefcase className="mr-1 h-3 w-3" />
              )}
              {specialty}
            </span>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-border" />

        {/* CTA Button */}
        <button
          type="button"
          className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 group/btn"
        >
          Enviar resumen de caso
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default LawyerCard;
