import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { ScheduleRowForm, type ScheduleRow } from "./ScheduleRowForm";

export default async function AdminSchedulePage() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("toy_train_schedule")
    .select(
      "id, route_label, from_station_code, from_station_name, to_station_code, to_station_name, ticket_class, departs_approx, arrives_approx, notes, is_published, last_verified_on, verified_by"
    )
    .order("sort_order");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Toy train timetable</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Enter real times from IRCTC or Southern Railway before publishing a row — none were
        confirmed from an official source when this table was built, so every row starts
        unpublished with blank times on purpose.
      </p>
      <div className="mt-4 space-y-3">
        {(data ?? []).map((row) => (
          <ScheduleRowForm key={row.id} row={row as ScheduleRow} />
        ))}
      </div>
    </div>
  );
}
