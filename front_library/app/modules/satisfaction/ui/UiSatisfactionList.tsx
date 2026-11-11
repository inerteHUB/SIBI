"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSatisfactionList } from "../hooks/useSatisfactionList";
import { Star, Filter, RefreshCw, User, EyeOff } from "lucide-react";

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            s <= value
              ? "w-3.5 h-3.5 fill-amber-400 text-amber-400"
              : "w-3.5 h-3.5 fill-transparent text-amber-200"
          }
        />
      ))}
    </div>
  );
}

export function UiSatisfactionList() {
  const { items, loading, fetch, params } = useSatisfactionList();
  const [minRating, setMinRating] = useState<string>("all");

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilter() {
    fetch({
      ...params,
      min_rating: minRating === "all" ? undefined : Number(minRating),
    });
  }

  function resetFilter() {
    setMinRating("all");
    fetch({ limit: 50, skip: 0 });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold">
            Encuestas recibidas ({items.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue placeholder="Calificación mín." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="1">⭐ 1+</SelectItem>
                <SelectItem value="2">⭐⭐ 2+</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3+</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4+</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ Solo 5</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={applyFilter}>
              Filtrar
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={resetFilter} title="Resetear">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Cargando encuestas...
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No hay encuestas registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Usuario</TableHead>
                  <TableHead>General</TableHead>
                  <TableHead className="hidden md:table-cell">Personal</TableHead>
                  <TableHead className="hidden md:table-cell">Libros</TableHead>
                  <TableHead className="hidden lg:table-cell">Instalac.</TableHead>
                  <TableHead className="hidden lg:table-cell">Rapidez</TableHead>
                  <TableHead>Comentarios</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.is_anonymous ? (
                          <>
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground italic">Anónimo</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-primary" />
                            <span className="text-xs font-medium">
                              {item.user?.full_name ?? item.user?.username ?? `#${item.user_id}`}
                            </span>
                          </>
                        )}
                      </div>
                      {item.loan && (
                        <Badge variant="outline" className="text-[10px] mt-0.5">
                          {item.loan.code}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StarDisplay value={item.overall_rating} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.staff_attention_rating ? (
                        <StarDisplay value={item.staff_attention_rating} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.book_condition_rating ? (
                        <StarDisplay value={item.book_condition_rating} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {item.facility_rating ? (
                        <StarDisplay value={item.facility_rating} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {item.speed_rating ? (
                        <StarDisplay value={item.speed_rating} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate">
                        {item.comments ?? "—"}
                      </p>
                      {item.book_suggestions && (
                        <p className="text-[10px] text-primary truncate mt-0.5">
                          📚 {item.book_suggestions}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
