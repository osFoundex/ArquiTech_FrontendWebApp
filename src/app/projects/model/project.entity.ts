export class Project {
  project_id: number;
  name: string;
  user_id: number;
  budget: number;
  image_url: string;
  status:string;

  constructor(project:{project_id?: number, name?: string, user_id?: number, budget?: number, image_url?: string, status?:string}) {
    this.project_id = project.project_id || 0;
    this.name = project.name || "";
    this.user_id = project.project_id || 0;
    this.budget = project.budget|| 0;
    this.image_url = project.image_url|| "";
    this.status=project.status || "";
  }
}
