export class TaskEntity {
  id: number;
  id_worker: number;
  id_project: number;
  description: string;
  start_date: string;
  due_date: string;
  status: string;

  constructor(id?: number, id_worker?: number, id_project?: number, description?: string, start_date?: string, due_date?: string, status?: string) {
    this.id = id || 0;
    this.id_worker = id_worker || 0;
    this.id_project = id_project || 0;
    this.description = description || '';
    this.start_date = start_date || '';
    this.due_date = due_date || '';
    this.status = status || '';
  }
}
