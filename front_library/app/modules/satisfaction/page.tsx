"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import HeaderModule from "@/components/header-module";
import { UiSatisfactionList } from "./ui/UiSatisfactionList";
import { UiSatisfactionMetrics } from "./ui/UiSatisfactionMetrics";
import { UiSatisfactionPendingAlert } from "./ui/UiSatisfactionPendingAlert";
import { UiSatisfactionSubmit } from "./ui/UiSatisfactionSubmit";
import { Star } from "lucide-react";

export default function SatisfactionPage() {
  const [openGeneral, setOpenGeneral] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <HeaderModule
        title="Satisfacción del Servicio"
        description="Encuestas CSAT y métricas de calidad del servicio de biblioteca"
      />

      {/* Pending surveys banner */}
      <UiSatisfactionPendingAlert />

      <Tabs defaultValue="metrics" className="w-full">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <TabsList>
            <TabsTrigger value="metrics">Métricas CSAT</TabsTrigger>
            <TabsTrigger value="surveys">Encuestas Recibidas</TabsTrigger>
          </TabsList>

          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => setOpenGeneral(true)}
          >
            <Star className="w-4 h-4 text-amber-400" />
            Nueva encuesta general
          </Button>
        </div>

        <TabsContent value="metrics">
          <UiSatisfactionMetrics />
        </TabsContent>

        <TabsContent value="surveys">
          <UiSatisfactionList />
        </TabsContent>
      </Tabs>

      {/* General survey (no loan linked) */}
      <UiSatisfactionSubmit
        open={openGeneral}
        onOpenChange={setOpenGeneral}
        loanId={null}
      />
    </div>
  );
}
