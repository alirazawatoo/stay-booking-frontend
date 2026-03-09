export enum RentalPropertyStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Error = "Error"
}

export const VALID_FILE_EXTENSIONS: string[] = [".xls", ".xlsx", ".csv"];

// The import needs these spreadsheet columns; the API rejects files without them.
export const REQUIRED_COLUMNS: string[] = ["Location", "Price", "Sq. ft.", "Ba", "Br", "Link"];

export interface RentalProperty {
  created_at?: string | null;
  created_at_formatted?: string | null;
  updated_at?: string | null;
  location?: string | null;
  rent?: number | null;
  no_of_bedrooms?: number | null;
  no_of_bathrooms?: number | null;
  square_feet?: number | null;
  utilities?: number | null;
  adr?: number | null;
  occupancy_rate?: number | null;
  property_zillow_link: string;
  property_status: RentalPropertyStatus;
  yearly_rent_cost_util?: number | null;
  yearly_projected_revenue?: number | null;
  monthly_estimated_profit?: number | null;
  batch_id: number;
}

export interface FilteredRentalsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    all_batch_ids: number[];
    properties: RentalProperty[];
  };
}
