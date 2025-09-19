const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5173/";

export async function login(email, password, rememberMe) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao fazer login",
      };
    }

    const { accessToken } = await response.json();

    // Armazenar no localStorage ou sessionStorage
    if (rememberMe) {
      localStorage.setItem("auth-token", accessToken);
    } else {
      sessionStorage.setItem("auth-token", accessToken);
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

export async function register(fullName, userName, email, password) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fullName, userName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao fazer registro",
      };
    }

    const { accessToken } = await response.json();

    localStorage.setItem("auth-token", accessToken);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

export async function forgotPassword(email) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/forgot-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao solicitar redefinição de senha",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

export function logout() {
  localStorage.removeItem("auth-token");
  sessionStorage.removeItem("auth-token");
  window.location.href = "/auth/login"; // ou use navigate()
}

export function isAuthenticated() {
  const token =
    localStorage.getItem("auth-token") || sessionStorage.getItem("auth-token");
  return !!token;
}
