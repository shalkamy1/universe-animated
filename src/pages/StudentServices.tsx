import { ArrowLeft, Stethoscope, MessageSquareWarning, CreditCard, AlertTriangle, HelpCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Stethoscope,
    title: "Medical Excuse",
    description: "Submit and track your medical excuses for missed classes.",
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/30",
    bgGradient: "from-primary/5 to-transparent",
  },
  {
    icon: MessageSquareWarning,
    title: "Complaints",
    description: "Submit academic or general complaints to the administration.",
    color: "bg-course-orange/10 text-course-orange",
    borderColor: "border-course-orange/30",
    bgGradient: "from-course-orange/5 to-transparent",
  },
  {
    icon: CreditCard,
    title: "Online Payment",
    description: "Pay your tuition fees and other charges securely online.",
    color: "bg-course-green/10 text-course-green",
    borderColor: "border-course-green/30",
    bgGradient: "from-course-green/5 to-transparent",
  },
  {
    icon: AlertTriangle,
    title: "Warning",
    description: "View academic warnings and take necessary actions.",
    color: "bg-course-orange/10 text-course-orange",
    borderColor: "border-course-orange/30",
    bgGradient: "from-course-orange/5 to-transparent",
  },
  {
    icon: HelpCircle,
    title: "Requests",
    description: "Submit and track requests for official documents.",
    color: "bg-course-purple/10 text-course-purple",
    borderColor: "border-course-purple/30",
    bgGradient: "from-course-purple/5 to-transparent",
  },
];

const StudentServices = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Student Services</h1>
        </div>
        <p className="text-muted-foreground ml-13">
          Manage your academic requests, payments, and administrative needs in one convenient place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card
            key={service.title}
            className={`opacity-0 animate-fade-up cursor-pointer group hover:shadow-lg transition-all duration-300 border ${service.borderColor} bg-gradient-to-br ${service.bgGradient}`}
            style={{ animationFillMode: "forwards", animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className={`h-12 w-12 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                <service.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="mt-4 h-0.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary/30 rounded-full w-0 group-hover:w-full transition-all duration-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentServices;
