// Login/register UI postponed past v1; still used as a stub via AuthContext. See app/docs/v2_backlog.md
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

// User schema for validation
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  profileImage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// Login credentials schema
export const loginCredentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

// Registration data schema
export const registrationDataSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegistrationData = z.infer<typeof registrationDataSchema>;

// Mock user data for development
const mockUsers: User[] = [
  {
    id: "1",
    name: "Max M",
    email: "max@m.com",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Authentication service
class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  // Initialize the service
  async init(): Promise<void> {
    try {
      const storedToken = await AsyncStorage.getItem("auth_token");
      const storedUser = await AsyncStorage.getItem("current_user");

      if (storedToken && storedUser) {
        this.token = storedToken;
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to initialize auth service:", error);
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Validate credentials
      loginCredentialsSchema.parse(credentials);

      // In a real app, this would be an API call
      // For now, we'll use mock data
      const user = mockUsers.find((u) => u.email === credentials.email);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // In a real app, we would verify the password
      // For now, we'll just check if the email exists

      // Generate a mock token
      this.token = `mock_token_${Date.now()}`;
      this.currentUser = user;

      // Store in AsyncStorage
      await AsyncStorage.setItem("auth_token", this.token);
      await AsyncStorage.setItem("current_user", JSON.stringify(user));

      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Register
  async register(data: RegistrationData): Promise<User> {
    try {
      // Validate registration data
      registrationDataSchema.parse(data);

      // In a real app, this would be an API call
      // For now, we'll use mock data

      // Check if user already exists
      if (mockUsers.some((u) => u.email === data.email)) {
        throw new Error("User with this email already exists");
      }

      // Create a new user
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name: data.name,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to mock users
      mockUsers.push(newUser);

      // Generate a mock token
      this.token = `mock_token_${Date.now()}`;
      this.currentUser = newUser;

      // Store in AsyncStorage
      await AsyncStorage.setItem("auth_token", this.token);
      await AsyncStorage.setItem("current_user", JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Clear token and user
      this.token = null;
      this.currentUser = null;

      // Remove from AsyncStorage
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("current_user");
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  // Get token
  getToken(): string | null {
    return this.token;
  }
}

// Export a singleton instance
export const authService = new AuthService();
