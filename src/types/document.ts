export interface Document {
  id: string;
  name: string;
  type: "pdf" | "txt";
  size: number;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
}

export interface UploadDocumentResponse {
  id: string;
  name: string;
  message: string;
}
