export class Material {
  material_id: number;
  project_id: number;
  name: string;

  quantity: number;
  stock: number;
  unit_price: number;
  unit: string;
  provider: string;
  provider_ruc: string;
  date: string
  receipt_number: string;
  payment_method: string;
  status: string;



  constructor
  (material:{material_id?: number, project_id?: number, name?: string,quantity?: number,
    stock?: number, unit_price?: number, unit?: string, provider?: string, provider_ruc?: string,
    date?: string, receipt_number?: string, payment_method?: string, status?: string}) {
    this.material_id = material.material_id || 0;
    this.project_id = material.project_id || 0;
    this.name = material.name || "";

    this.quantity = material.quantity || 0;
    this.stock = material.stock||0;
    this.unit_price = material.unit_price||0;
    this.unit = material.unit||"";
    this.provider = material.provider||"";
    this.provider_ruc = material.provider_ruc||"";
    this.date = material.date||"";
    this.receipt_number = material.receipt_number || "";
    this.payment_method = material.payment_method|| "";
    this.status = material.status|| "";

  }
}
