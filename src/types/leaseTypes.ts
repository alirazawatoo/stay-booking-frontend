export type ReviewStatus = 'Pending' | 'Draft' | 'Rejected' | 'Approved' | 'Error';

export interface Document {
  id: number;
  name: string;
  file?: string;
  version?: string;
  uploaded_at: string;
  status: ReviewStatus;
}

export interface Lease {
  id: number;
  date: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  status: ReviewStatus;
  num_of_docs: number;
  documents?: Document[];
}
