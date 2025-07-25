import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronRight, FilePen } from "lucide-react";
import * as React from "react";

const cardVariants = cva(
  "flex items-center justify-between rounded-lg bg-white p-5 transition-colors hover:opacity-80 hover:border-transparent",
  {
    variants: {
      variant: {
        default: "bg-brand text-white",
        soon: "bg-white text-[#565656] disabled:pointer-events-none",
        results: "bg-white text-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type CycleData = {
  nome: string;
  status: "aberto" | "emRevisao" | "finalizado";
  resultadosDisponiveis?: boolean;
  diasRestantes?: number;
};

type CycleStatusCardProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ciclo: CycleData;
  isGestor?: boolean;
};

const CycleStatusCard = React.forwardRef<
  HTMLButtonElement,
  CycleStatusCardProps
>(({ ciclo, isGestor = false, className, ...props }, ref) => {
  const { nome, status, diasRestantes } = ciclo;

  let title = "";
  let description: React.ReactNode = "";
  let variant: "default" | "soon" | "results" = "default";

  if (status === "aberto") {
    title = `Ciclo ${nome} de avaliação está aberto`;
    description = (
      <>
        <span className="font-bold">{diasRestantes ?? 0} dias</span> restantes
      </>
    );
    variant = "default";
  } else if (status === "emRevisao") {
    if (isGestor) {
      title = `Ciclo ${nome} em revisão`;
      description = diasRestantes ? (
        <>
          <span className="font-bold">{diasRestantes}</span> dias restantes para
          concluir suas avaliações
        </>
      ) : (
        "Você pode avaliar seus liderados"
      );
    } else {
      title = `Ciclo de Avaliação ${nome} em revisão`;
      description = (
        <>
          Resultados disponíveis <span className="font-bold">em breve</span>
        </>
      );
    }
    variant = "soon";
  } else if (status === "finalizado") {
    title = `Ciclo de Avaliação ${nome} finalizado`;
    description = (
      <>
        Resultados <span className="font-bold text-brand">disponíveis</span>
      </>
    );
    variant = "results";
  }

  return (
    <button
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      type="button"
      disabled={variant === "soon"}
      {...props}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <FilePen className="w-8 h-8 sm:w-10 sm:h-10" />
        <div className="flex flex-col text-start">
          <p className="font-bold text-base sm:text-lg">{title}</p>
          <p className="text-xs">{description}</p>
        </div>
      </div>
      <div
        className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full ${
          variant === "default"
            ? "bg-brand"
            : variant === "soon"
            ? "bg-[#565656]"
            : "bg-brand"
        }`}
      >
        <ChevronRight className="text-white " />
      </div>
    </button>
  );
});

CycleStatusCard.displayName = "CycleStatusCard";

export default CycleStatusCard;
