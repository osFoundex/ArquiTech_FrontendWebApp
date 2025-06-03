export class Incident {
  id: number;
  date: string;
  incident_type: string;
  severity: string;
  status: string;
  project_id: number;

  constructor(incident:{id?: number, date?: string, incident_type?: string, severity?: string, status?: string, project_id?: number}) {
    this.id = incident.id || 0;
    this.date = incident.date || "";
    this.incident_type = incident.incident_type || "";
    this.severity = incident.severity|| "";
    this.status = incident.status|| "";
    this.project_id = incident.project_id || 0;
  }
}
