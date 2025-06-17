export class Project {
  id: number;
  name: string;
  user_id: number;
  contractor_id: number | null; // Allow null for projects without contractors
  budget: number;
  image_url: string;
  status: string;

  constructor(project: {
    project_id?: number;
    name?: string;
    user_id?: number;
    contractor_id?: number | null;
    budget?: number;
    image_url?: string;
    status?: string;
  }) {
    this.id = project.project_id || 0;
    this.name = project.name || '';
    this.user_id = project.user_id || 0;
    this.contractor_id = project.contractor_id ?? null; // Use nullish coalescing
    this.budget = project.budget || 0;
    this.image_url = project.image_url || '';
    this.status = project.status || '';
  }
}
