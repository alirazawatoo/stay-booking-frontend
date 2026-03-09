import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'

type QueryValue = string | number | null | undefined

// Builds "path?a=1&b=2", skipping empty values so the API applies no filter for them.
export function withQuery(path: string, params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.append(key, String(value))
  }
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export interface LeaseSearchParams {
  page?: number
  address?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface RegulationSearchParams {
  page?: number
  query?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface RentalFilters {
  min_profit?: number
  max_profit?: number
  status?: string
  batch_id?: number
  start_date?: string
  end_date?: string
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token ?? localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: 'api/token/', method: 'POST', body: credentials }),
    }),

    getUsers: builder.query({
      query: (page = 1) => withQuery('account/users/', { page }),
      keepUnusedDataFor: 0,
    }),
    createUser: builder.mutation({
      query: (userData) => ({ url: 'account/users/', method: 'POST', body: userData }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({ url: `account/users/${id}/`, method: 'PUT', body: userData }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `account/users/${id}/`, method: 'DELETE' }),
    }),
    updatePassword: builder.mutation({
      query: ({ id, passwordData }) => ({
        url: `account/users/update-password/${id}/`,
        method: 'POST',
        body: passwordData,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({ url: 'account/password/change/', method: 'POST', body: passwordData }),
    }),
    getUserProfile: builder.query({
      query: () => 'account/profile/',
      providesTags: ['Profile'],
    }),
    logout: builder.mutation({
      query: () => ({ url: 'account/logout/', method: 'POST' }),
    }),

    getAllLeases: builder.query({
      query: (page = 1) => withQuery('api/leases/', { page }),
      keepUnusedDataFor: 0,
    }),
    uploadLease: builder.mutation({
      query: (leaseData: FormData) => ({ url: 'api/leases/upload/', method: 'POST', body: leaseData }),
    }),
    searchLeases: builder.query({
      query: ({ page, address, status, startDate, endDate }: LeaseSearchParams = {}) =>
        withQuery('api/leases/search/', { page, address, start_date: startDate, end_date: endDate, status }),
    }),
    getLeaseById: builder.query({
      query: (id) => `api/leases/${id}/`,
    }),
    reviseLease: builder.mutation({
      query: ({ id, revisedData }) => ({ url: `api/leases/${id}/revised/`, method: 'POST', body: revisedData }),
    }),
    updateLease: builder.mutation({
      query: ({ id, ...leaseData }) => ({ url: `api/leases/${id}/update/`, method: 'PUT', body: leaseData }),
    }),

    getDocumentNamesByLeaseId: builder.query({
      query: (leaseId) => `api/documents/lease/${leaseId}/documents/`,
    }),
    // The API returns JSON with a file URL rather than the file itself.
    previewDocument: builder.query<{ file_url: string }, { documentId: number }>({
      query: ({ documentId }) => `api/documents/preview/${documentId}/`,
    }),
    reviewDocuments: builder.mutation({
      query: ({ documentIds }) => ({
        url: 'api/documents/review/',
        method: 'POST',
        body: { document_ids: documentIds },
      }),
    }),
    chatWithGpt: builder.mutation({
      query: ({ documentId, message }) => ({
        url: `api/documents/${documentId}/chat/`,
        method: 'POST',
        body: { document_id: Number(documentId), message },
      }),
    }),
    getChatHistory: builder.query({
      query: (documentId) => `api/documents/${documentId}/get-chat-history/`,
    }),

    getRegulations: builder.query({
      query: (page = 1) => withQuery('api/regulations/', { page }),
      keepUnusedDataFor: 0,
    }),
    createRegulation: builder.mutation({
      query: (regulationData) => ({ url: 'api/regulations/', method: 'POST', body: regulationData }),
    }),
    getRegulationById: builder.query({
      query: (id) => `api/regulations/${id}/`,
    }),
    regulationChatWithGpt: builder.mutation({
      query: ({ regulationId, message }) => ({
        url: `api/regulations/${regulationId}/chat/`,
        method: 'POST',
        body: { regulation_id: regulationId, message },
      }),
    }),
    getRegulationChatHistory: builder.query({
      query: (regulationId) => `api/regulations/${regulationId}/get-chat-history/`,
    }),
    searchRegulations: builder.query({
      query: ({ page, query, status, startDate, endDate }: RegulationSearchParams = {}) =>
        withQuery('api/regulations/search/', { page, query, start_date: startDate, end_date: endDate, status }),
    }),

    uploadProperties: builder.mutation({
      query: (file: FormData) => ({ url: 'api/rental_properties/upload-properties/', method: 'POST', body: file }),
    }),
    // The filters travel in the POST body; pagination stays in the query string.
    filteredList: builder.query({
      query: ({ page = 1, pageSize = 10, ...filters }: RentalFilters & { page?: number; pageSize?: number } = {}) => ({
        url: withQuery('api/rental_properties/filtered-list/', { page, page_size: pageSize }),
        method: 'POST',
        body: Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined)),
      }),
      keepUnusedDataFor: 0,
    }),
    downloadCsv: builder.query<string, RentalFilters>({
      query: ({ min_profit, max_profit, status, batch_id, start_date, end_date }) => ({
        url: withQuery('api/rental_properties/download-csv/', {
          min_profit,
          max_profit,
          status,
          batch_id,
          start_date,
          end_date,
        }),
        responseHandler: (response) => response.text(),
      }),
      keepUnusedDataFor: 0,
    }),
    getTaskResult: builder.query({
      query: (taskId: string) => withQuery('api/rental_properties/task-result/', { task_id: taskId }),
      keepUnusedDataFor: 0,
    }),
    taskProgress: builder.query({
      query: (taskId: string) => withQuery('api/rental_properties/task-progress/', { task_id: taskId }),
      keepUnusedDataFor: 0,
    }),
  }),
})

export const {
  useLoginMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
  useGetAllLeasesQuery,
  useUploadLeaseMutation,
  useSearchLeasesQuery,
  useGetLeaseByIdQuery,
  useReviseLeaseMutation,
  useUpdateLeaseMutation,
  useGetDocumentNamesByLeaseIdQuery,
  usePreviewDocumentQuery,
  useReviewDocumentsMutation,
  useChatWithGptMutation,
  useGetChatHistoryQuery,
  useGetRegulationsQuery,
  useCreateRegulationMutation,
  useGetRegulationByIdQuery,
  useRegulationChatWithGptMutation,
  useGetRegulationChatHistoryQuery,
  useSearchRegulationsQuery,
  useUploadPropertiesMutation,
  useFilteredListQuery,
  useLazyDownloadCsvQuery,
  useGetTaskResultQuery,
  useTaskProgressQuery,
} = api
