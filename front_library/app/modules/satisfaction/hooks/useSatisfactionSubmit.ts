"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { serviceSatisfactionSubmit } from "../services/serviceSatisfactionSubmit";
import { SatisfactionCreate } from "../type/typeSatisfactionBase";

const schema = z.object({
  loan_id: z.number().optional(),
  service_type: z.string().optional(),
  is_anonymous: z.boolean(),
  overall_rating: z
    .number({ required_error: "La calificación general es obligatoria" })
    .min(1, "Mínimo 1 estrella")
    .max(5, "Máximo 5 estrellas"),
  staff_attention_rating: z.number().min(1).max(5).optional(),
  book_condition_rating: z.number().min(1).max(5).optional(),
  facility_rating: z.number().min(1).max(5).optional(),
  speed_rating: z.number().min(1).max(5).optional(),
  comments: z.string().optional(),
  book_suggestions: z.string().optional(),
});

export type SatisfactionSubmitForm = z.infer<typeof schema>;

interface UseSatisfactionSubmitProps {
  loanId?: number | null;
  onSuccess?: () => void;
}

export function useSatisfactionSubmit({
  loanId,
  onSuccess,
}: UseSatisfactionSubmitProps = {}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SatisfactionSubmitForm>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      loan_id: loanId ?? undefined,
      is_anonymous: false,
      overall_rating: 0 as unknown as number,
    },
  });

  async function onSubmit(values: SatisfactionSubmitForm) {
    setLoading(true);
    try {
      const payload: SatisfactionCreate = {
        ...(values as unknown as SatisfactionCreate),
        loan_id: loanId ?? values.loan_id,
      };
      await serviceSatisfactionSubmit(payload);
      toast.success("¡Gracias por tu calificación!");
      form.reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setLoading(false);
    }
  }

  return { form, loading, onSubmit: form.handleSubmit(onSubmit as never) };
}
