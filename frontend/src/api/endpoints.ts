import { apiClient } from './client';

export interface StockPublicView {
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy_address: string;
  city: string;
  phone: string;
  distance_km?: number;
  medicine_id: number;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  last_updated: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  license_number: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email?: string;
  opening_hours: string;
  is_verified: boolean;
}

export interface EnquiryRequest {
  pharmacy_id: number;
  medicine_query: string;
  message: string;
  contact_phone?: string;
}

export interface HoldRequest {
  pharmacy_id: number;
  medicine_id: number;
  quantity: number;
}

export const api = {
  // Search
  searchMedicine: (query: string, city?: string) =>
    apiClient.get<StockPublicView[]>('/search', { params: { q: query, city } }),
  getMedicineSuggestions: (query: string) =>
    apiClient.get<
      Array<{
        id: number;
        brand_name: string;
        generic_name: string;
        dosage_form: string;
        strength: string;
        full_name: string;
      }>
    >('/search/suggestions', { params: { q: query } }),

  // Pharmacies
  getPharmacies: () => apiClient.get<Pharmacy[]>('/pharmacies'),
  getPharmacy: (id: number | string) => apiClient.get<Pharmacy>(`/pharmacies/${id}`),

  // Stock
  getPharmacyStock: (pharmacyId: number | string) =>
    apiClient.get(`/stock/pharmacy/${pharmacyId}`),
  updateStock: (stockId: number, data: { quantity?: number; status?: string }) =>
    apiClient.patch(`/stock/${stockId}`, data),

  // Enquiries
  submitEnquiry: (data: EnquiryRequest) => apiClient.post('/enquiries', data),
  getPharmacyEnquiries: (pharmacyId: number | string) =>
    apiClient.get(`/enquiries/pharmacy/${pharmacyId}`),

  // Holds
  requestHold: (data: HoldRequest) => apiClient.post('/holds', data),
  getHoldByCode: (code: string) => apiClient.get(`/holds/code/${code}`),
  getPharmacyHolds: (pharmacyId: number | string) =>
    apiClient.get(`/holds/pharmacy/${pharmacyId}`),
  fulfillHold: (holdId: number) => apiClient.post(`/holds/${holdId}/fulfill`),

  // Prescriptions
  uploadPrescription: (formData: FormData) =>
    apiClient.post('/prescriptions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getSamplePrescription: () => apiClient.get('/prescriptions/sample'),

  // Admin
  getAdminStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/admin/users'),
};

