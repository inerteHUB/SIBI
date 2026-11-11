"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useSatisfactionSubmit } from "../hooks/useSatisfactionSubmit";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (val: number) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
}

function StarRating({ value, onChange, size = "md", label }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === "lg" ? 32 : size === "md" ? 24 : 18;

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              width={starSize}
              height={starSize}
              className={
                star <= (hovered || value)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-amber-300"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}

interface UiSatisfactionSubmitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId?: number | null;
  onSuccess?: () => void;
}

export function UiSatisfactionSubmit({
  open,
  onOpenChange,
  loanId,
  onSuccess,
}: UiSatisfactionSubmitProps) {
  const { form, loading, onSubmit } = useSatisfactionSubmit({
    loanId,
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  // Reset form when dialog opens with a new loanId
  useEffect(() => {
    if (open) {
      form.reset({
        loan_id: loanId ?? undefined,
        is_anonymous: false,
        overall_rating: 0 as unknown as number,
      });
    }
  }, [open, loanId, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Califica tu experiencia ⭐</DialogTitle>
          <DialogDescription>
            Tu opinión nos ayuda a mejorar el servicio de la biblioteca.
            {loanId && (
              <span className="ml-1 font-medium text-primary">
                (Préstamo #{loanId})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Overall rating */}
            <FormField
              control={form.control as never}
              name="overall_rating"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold">
                    Calificación general <span className="text-destructive">*</span>
                  </Label>
                  <StarRating
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    size="lg"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub-ratings grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as never}
                name="staff_attention_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      size="sm"
                      label="Atención del personal"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="book_condition_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      size="sm"
                      label="Estado de los libros"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="facility_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      size="sm"
                      label="Instalaciones"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="speed_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      size="sm"
                      label="Rapidez del servicio"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comments */}
            <FormField
              control={form.control as never}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold">Comentarios (opcional)</Label>
                  <Textarea
                    {...field}
                    placeholder="Cuéntanos más sobre tu experiencia..."
                    className="resize-none"
                    rows={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Book suggestions */}
            <FormField
              control={form.control as never}
              name="book_suggestions"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold">
                    ¿Qué libros te gustaría que adquiramos? (opcional)
                  </Label>
                  <Textarea
                    {...field}
                    placeholder="Ej: El nombre de la rosa - Umberto Eco..."
                    className="resize-none"
                    rows={2}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Anonymous toggle */}
            <FormField
              control={form.control as never}
              name="is_anonymous"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="is_anonymous"
                  />
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="is_anonymous" className="cursor-pointer font-medium">
                      Enviar de forma anónima
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      Tu nombre no aparecerá en los reportes
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? "Enviando..." : "Enviar calificación"}
                <Star className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
