export interface InterventionAppointmentFormData {
  id?: number | null;
  intervention_start: Date;
  intervention_end: Date;
  notes: string;
  accepted: boolean;
  refused: boolean;
  system: number;
  base: number;
}
