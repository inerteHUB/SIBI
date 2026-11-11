"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSatisfactionMetrics } from "../hooks/useSatisfactionMetrics";
import { Star, Users, TrendingUp, BookOpen, Zap, Building2 } from "lucide-react";

function ScoreCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | null | undefined;
  icon: React.ReactNode;
}) {
  const display = value != null ? value.toFixed(1) : "—";
  const stars = value != null ? Math.round(value) : 0;

  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{display}</span>
          <div className="flex mb-1 gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={
                  s <= stars
                    ? "w-3 h-3 fill-amber-400 text-amber-400"
                    : "w-3 h-3 fill-transparent text-amber-200"
                }
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DistributionBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-12 text-right font-medium text-muted-foreground">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-xs text-muted-foreground">{count} ({pct}%)</span>
    </div>
  );
}

export function UiSatisfactionMetrics() {
  const { metrics, loading, fetchMetrics } = useSatisfactionMetrics();

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Cargando métricas...
      </div>
    );
  }

  if (!metrics) return null;

  const totalDist =
    metrics.distribution.star_1 +
    metrics.distribution.star_2 +
    metrics.distribution.star_3 +
    metrics.distribution.star_4 +
    metrics.distribution.star_5;

  return (
    <div className="space-y-6">
      {/* Header KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CSAT */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-5 pb-4 flex flex-col items-center gap-1">
            <TrendingUp className="w-6 h-6 opacity-80" />
            <span className="text-4xl font-extrabold">
              {metrics.csat_percentage.toFixed(1)}%
            </span>
            <span className="text-sm font-medium opacity-80">CSAT Score</span>
          </CardContent>
        </Card>

        {/* Average */}
        <Card>
          <CardContent className="pt-5 pb-4 flex flex-col items-center gap-1">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span className="text-4xl font-extrabold">
              {metrics.average_overall_rating.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">Promedio general</span>
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardContent className="pt-5 pb-4 flex flex-col items-center gap-1">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-4xl font-extrabold">{metrics.total_surveys}</span>
            <span className="text-sm text-muted-foreground">Encuestas totales</span>
          </CardContent>
        </Card>
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ScoreCard
          label="Atención del personal"
          value={metrics.average_staff_attention}
          icon={<Users className="w-4 h-4" />}
        />
        <ScoreCard
          label="Estado de libros"
          value={metrics.average_book_condition}
          icon={<BookOpen className="w-4 h-4" />}
        />
        <ScoreCard
          label="Instalaciones"
          value={metrics.average_facility}
          icon={<Building2 className="w-4 h-4" />}
        />
        <ScoreCard
          label="Rapidez"
          value={metrics.average_speed}
          icon={<Zap className="w-4 h-4" />}
        />
      </div>

      {/* Distribution + Faculty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Star distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Distribución de calificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DistributionBar label="⭐⭐⭐⭐⭐" count={metrics.distribution.star_5} total={totalDist} />
            <DistributionBar label="⭐⭐⭐⭐" count={metrics.distribution.star_4} total={totalDist} />
            <DistributionBar label="⭐⭐⭐" count={metrics.distribution.star_3} total={totalDist} />
            <DistributionBar label="⭐⭐" count={metrics.distribution.star_2} total={totalDist} />
            <DistributionBar label="⭐" count={metrics.distribution.star_1} total={totalDist} />
          </CardContent>
        </Card>

        {/* Faculty ranking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              CSAT por Facultad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.by_faculty.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin datos por facultad</p>
            ) : (
              <div className="space-y-2">
                {metrics.by_faculty.map((f) => (
                  <div
                    key={f.faculty_id}
                    className="flex items-center justify-between py-1 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{f.faculty_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.total_surveys} encuestas
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ⭐ {f.average_rating.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
