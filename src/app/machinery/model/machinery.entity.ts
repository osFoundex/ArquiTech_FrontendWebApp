export class Machinery {
  id: number;
  name: string;
  license_plate: string;
  register_date: string;
  status: string;
  project_id: number;


  constructor
  (machinery: {id?: number, name?: string, license_plate?: string,
    register_date?: string, status?: string, project_id?: number}) {
    this.id = machinery.id || 0;
    this.name = machinery.name ||"";
    this.license_plate = machinery.license_plate||"";
    this.register_date = machinery.register_date||"";
    this.status = machinery.status||"";
    this.project_id = machinery.project_id|| 0;
  }
}
