export class Worker {
  worker_id: number;
  name: string;
  role: string;
  hired_date: string;
  project_id: number;

  constructor(worker:{worker_id?: number, name?: string, role?: string, hired_date?: string, project_id?: number}) {
    this.worker_id = worker.worker_id || 0;
    this.name = worker.name || "";
    this.role = worker.role || "";
    this.hired_date = worker.hired_date || "";
    this.project_id = worker.project_id || 0;
  }
}
