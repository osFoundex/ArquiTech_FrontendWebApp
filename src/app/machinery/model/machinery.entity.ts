export class Machinery {
  machine_id: number;
  name: string;
  license_plate: string;
  register_date: string;
  estatus: string;
  project_id: number;


  constructor
  (machinery: {machine_id?: number, name?: string, license_plate?: string,
    register_date?: string, estatus?: string, project_id?: number}) {
    this.machine_id = machinery.machine_id || 0;
    this.name = machinery.name ||"";
    this.license_plate = machinery.license_plate||"";
    this.register_date = machinery.register_date||"";
    this.estatus = machinery.estatus||"";
    this.project_id = machinery.project_id|| 0;
  }
}
