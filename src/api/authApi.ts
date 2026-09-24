export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

const API_URL = "http://localhost:8081/api/auth";

export async function login(
  request: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = "Invalid email or password.";

    try {
      const errorData = await response.json();

      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json();
}