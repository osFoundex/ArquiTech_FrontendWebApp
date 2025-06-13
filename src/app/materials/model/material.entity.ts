export class Material {
  id: number;
  material_id?: number;
  project_id: number;
  name: string;

  quantity: number;
  quantity_exit?: number;
  stock?: number;
  unit_price: number;
  unit: string;
  provider: string;
  provider_ruc: string;
  date: string
  exit_date?: string;
  receipt_number: string;
  payment_method: string;
  status: string;

  entry_type: string;
  exit_type?: string;

  constructor
  (material:{id?: number, material_id?: number, project_id?: number, name?: string,quantity?: number, quantity_exit?: number,
    stock?: number, unit_price?: number, unit?: string, provider?: string, provider_ruc?: string,
    date?: string, exit_date?:string, receipt_number?: string, payment_method?: string, status?: string,
    entry_type?: string, exit_type?: string,}) {
    this.id = material.id || 0;
    this.material_id = material.material_id || 0;
    this.project_id = material.project_id || 0;
    this.name = material.name || "";

    this.quantity = material.quantity || 0;
    this.quantity_exit = material.quantity_exit || 0;
    this.stock = material.stock || 0;
    this.unit_price = material.unit_price||0;
    this.unit = material.unit||"";
    this.provider = material.provider||"";
    this.provider_ruc = material.provider_ruc||"";
    this.date = material.date||""; //fecha de entrada
    this.exit_date = material.exit_date || ""; //fecha de salida
    this.receipt_number = material.receipt_number || "";
    this.payment_method = material.payment_method|| "";
    this.status = material.status|| "";
    this.entry_type = material.entry_type || "Entrada";
    this.exit_type = material.exit_type || "Salida";

  }
}
