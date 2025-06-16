export interface InterventionAppointment {
  intervention_id: number;
  intervention_start: string | null; 
  intervention_end: string | null;   
  notes: string | null;
  base_id: number;
  created_at: string;                
  accepted: boolean | null;
  refused: boolean | null;
  form_type: string;                
  audience: string | null;
  name: string | null;
  email: string | null;
  user_id: string;                  
  form_created_at: string;          
  seen: boolean | null;
}
