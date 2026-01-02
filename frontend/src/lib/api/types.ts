export interface User {
  id: string;
  email: string;
  username: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
}

export interface CreateUserResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  };
}

export interface SourceInfo {
  text: string;
  fileName: string;
  uploadedAt: string;
  chunkIndex: number;
}

export interface QueryResult {
  answer: string;
  sources: SourceInfo[];
}

export interface QueryResponse {
  success: boolean;
  data: QueryResult;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp?: string;
  path?: string;
}
