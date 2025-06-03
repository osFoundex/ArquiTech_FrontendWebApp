export class Worker {
  id: number;
  name: string;
  role: string;
  hired_date: string;
  project_id: number;

  constructor(worker:{id?: number, name?: string, role?: string, hired_date?: string, project_id?: number}) {
    this.id = worker.id || 0;
    this.name = worker.name || "";
    this.role = worker.role || "";
    this.hired_date = worker.hired_date || "";
    this.project_id = worker.project_id || 0;
  }
}
