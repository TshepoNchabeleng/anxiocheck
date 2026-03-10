import { useState } from "react";
import { useNavigate } from "react-router";
import { Baby, Smile } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function Auth() {
  const navigate = useNavigate();
  
  // ========================================
  // LOGIN FORM STATE
  // ========================================
  // Stores username/email and password for login attempt
  const [loginData, setLoginData] = useState({ usernameOrEmail: "", password: "" });
  
  // ========================================
  // SIGNUP FORM STATE
  // ========================================
  // Stores all registration fields: name, email, password, confirmPassword, username
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  
  // Error message states for displaying validation feedback
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  // ========================================
  // LOGIN HANDLER WITH MULTI-USER SUPPORT
  // ========================================
  // Validates credentials against ALL stored user accounts
  // Supports login with either username OR email
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setLoginError(""); // Clear any previous errors

    // ========================================
    // RETRIEVE ALL REGISTERED USERS
    // ========================================
    // Users are stored as an array in localStorage under "users" key
    // Format: [{ name, email, username, password }, { ... }, ...]
    const storedUsers = localStorage.getItem("users");
    
    // Check if any users exist in the system
    if (!storedUsers) {
      setLoginError("No accounts found. Please sign up first.");
      return;
    }

    // Parse the JSON string into an array of user objects
    const users: Array<{
      name: string;
      email: string;
      username: string;
      password: string;
    }> = JSON.parse(storedUsers);

    // Normalize input for case-insensitive matching
    const inputIdentifier = loginData.usernameOrEmail.toLowerCase().trim();
    const inputPassword = loginData.password;

    // ========================================
    // SEARCH FOR MATCHING USER
    // ========================================
    // Look through all registered users to find one with matching credentials
    // Checks BOTH username and email fields
    const foundUser = users.find((user) => {
      const usernameMatches = user.username.toLowerCase() === inputIdentifier;
      const emailMatches = user.email.toLowerCase() === inputIdentifier;
      return usernameMatches || emailMatches; // Match either field
    });

    // If no user found with this username/email
    if (!foundUser) {
      setLoginError("Username or email not found. Please check your details and try again.");
      return;
    }

    // ========================================
    // VALIDATE PASSWORD
    // ========================================
    // Check if entered password matches the stored password
    // NOTE: In production, passwords should be hashed, not stored as plain text
    if (foundUser.password !== inputPassword) {
      setLoginError("Incorrect password. Please try again.");
      return;
    }

    // ========================================
    // SUCCESSFUL LOGIN
    // ========================================
    // Set authentication flags and user data in localStorage
    localStorage.setItem("isAuthenticated", "true"); // Flag used by route protection
    localStorage.setItem("userName", foundUser.name); // Display name used in dashboard
    localStorage.setItem("currentUser", JSON.stringify(foundUser)); // Full user data for reference
    
    // ========================================
    // MOCK LOGIN SUCCESS EMAIL NOTIFICATION
    // ========================================
    // In production, this would trigger a backend API call to send a confirmation email
    // Example implementation:
    /*
    await fetch('/api/send-login-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: foundUser.email,
        name: foundUser.name,
        timestamp: new Date().toISOString(),
        ipAddress: '(would be captured server-side)'
      })
    });
    */
    
    // Mock email notification log (visible in browser console)
    console.log("===== MOCK LOGIN SUCCESS EMAIL =====");
    console.log("To:", foundUser.email);
    console.log("Subject: Successful Login to ANXIOCHECK");
    console.log("Content:");
    console.log(`Hi ${foundUser.name},`);
    console.log("");
    console.log("You've successfully logged into your ANXIOCHECK account.");
    console.log(`Login Time: ${new Date().toLocaleString()}`);
    console.log(`Account: ${foundUser.email}`);
    console.log("");
    console.log("If this wasn't you, please reset your password immediately.");
    console.log("");
    console.log("Stay healthy,");
    console.log("The ANXIOCHECK Team");
    console.log("====================================");
    
    // Clear the login form
    setLoginData({ usernameOrEmail: "", password: "" });
    
    // Navigate to dashboard - health simulation will begin
    navigate("/dashboard");
  };

  // ========================================
  // SIGNUP HANDLER WITH MULTI-USER SUPPORT
  // ========================================
  // Creates new user account and adds to users array
  // Validates uniqueness of email and username across ALL existing users
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setSignupError(""); // Clear any previous errors

    // ========================================
    // VALIDATION: PASSWORDS MATCH
    // ========================================
    // Ensure user typed the same password twice
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match. Please re-enter your password.");
      return;
    }

    // ========================================
    // VALIDATION: PASSWORD LENGTH
    // ========================================
    // Enforce minimum password security requirement
    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters long.");
      return;
    }

    // ========================================
    // VALIDATION: REQUIRED FIELDS
    // ========================================
    // Ensure all fields have content
    if (!signupData.name.trim() || !signupData.username.trim()) {
      setSignupError("Please fill in all fields.");
      return;
    }

    // ========================================
    // RETRIEVE EXISTING USERS
    // ========================================
    // Get current list of users (empty array if none exist yet)
    const storedUsers = localStorage.getItem("users");
    const users: Array<{
      name: string;
      email: string;
      username: string;
      password: string;
    }> = storedUsers ? JSON.parse(storedUsers) : [];

    // ========================================
    // VALIDATION: CHECK FOR DUPLICATE EMAIL
    // ========================================
    // Ensure email is unique across all registered users
    // Case-insensitive comparison to prevent "user@email.com" and "USER@email.com"
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === signupData.email.toLowerCase().trim()
    );
    
    if (emailExists) {
      // Show specific error message with the exact email that's already taken
      setSignupError(`The email "${signupData.email}" is already registered. Please use a different email or log in instead.`);
      return;
    }

    // ========================================
    // VALIDATION: CHECK FOR DUPLICATE USERNAME
    // ========================================
    // Ensure username is unique across all registered users
    const usernameExists = users.some(
      (user) => user.username.toLowerCase() === signupData.username.toLowerCase().trim()
    );
    
    if (usernameExists) {
      // Show specific error message with the exact username that's already taken
      setSignupError(`The username "${signupData.username}" is already taken. Please choose a different username.`);
      return;
    }

    // ========================================
    // CREATE NEW USER OBJECT
    // ========================================
    // Store normalized data (trimmed, lowercase where appropriate)
    const newUser = {
      name: signupData.name.trim(), // Display name (preserves capitalization)
      email: signupData.email.toLowerCase().trim(), // Email (normalized to lowercase)
      username: signupData.username.toLowerCase().trim(), // Username (normalized to lowercase)
      password: signupData.password, // Password (stored as-is; should be hashed in production)
    };

    // ========================================
    // ADD USER TO USERS ARRAY
    // ========================================
    // Append new user to existing users array
    users.push(newUser);
    
    // Save updated users array back to localStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    // ========================================
    // AUTO-LOGIN AFTER SIGNUP
    // ========================================
    // Set authentication flags so user doesn't need to login again
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", newUser.name);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    // ========================================
    // CLEAR SIGNUP FORM
    // ========================================
    // Reset all fields to empty for next potential signup
    setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    });
    
    // Navigate to dashboard - health simulation will begin
    navigate("/dashboard");
  };

  return (
    // Full screen centered layout with gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        
        {/* ========================================
            ANXIOCHECK LOGO AND BRANDING
            ======================================== */}
        <div className="text-center mb-8">
          {/* Circular gradient background for logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
            {/* Custom SVG: White heart with angel wings */}
            <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left Angel Wing - Three feather layers */}
              <path
                d="M8 18C8 18 4 16 2 14C0.5 12.5 0 11 0.5 10C1 9 2 9 3 10C4.5 11.5 6 13.5 7 15C7.5 16 8 17 8 18Z"
                fill="white"
              />
              <path
                d="M7 20C7 20 3.5 19 1.5 17.5C0 16.5 -0.5 15.5 0 14.5C0.5 13.5 1.5 13.5 2.5 14.5C4 15.5 5.5 17 6.5 18.5C6.8 19 7 19.5 7 20Z"
                fill="white"
              />
              <path
                d="M7 22C7 22 4 21.5 2.5 20.5C1.5 19.8 1 19 1.5 18C2 17 3 17.5 4 18.5C5 19.5 6 20.5 6.5 21.5C6.8 21.8 7 22 7 22Z"
                fill="white"
              />
              
              {/* Heart - Central element */}
              <path
                d="M20 32C20 32 5 24 5 14C5 10 7.5 7.5 11 7.5C14 7.5 17 10 20 13C23 10 26 7.5 29 7.5C32.5 7.5 35 10 35 14C35 24 20 32 20 32Z"
                fill="white"
              />
              
              {/* Right Angel Wing - Three feather layers (mirrored) */}
              <path
                d="M32 18C32 18 36 16 38 14C39.5 12.5 40 11 39.5 10C39 9 38 9 37 10C35.5 11.5 34 13.5 33 15C32.5 16 32 17 32 18Z"
                fill="white"
              />
              <path
                d="M33 20C33 20 36.5 19 38.5 17.5C40 16.5 40.5 15.5 40 14.5C39.5 13.5 38.5 13.5 37.5 14.5C36 15.5 34.5 17 33.5 18.5C33.2 19 33 19.5 33 20Z"
                fill="white"
              />
              <path
                d="M33 22C33 22 36 21.5 37.5 20.5C38.5 19.8 39 19 38.5 18C38 17 37 17.5 36 18.5C35 19.5 34 20.5 33.5 21.5C33.2 21.8 33 22 33 22Z"
                fill="white"
              />
            </svg>
          </div>
          
          {/* App name */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ANXIOCHECK</h1>
          
          {/* Welcome message */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">WELCOME</h2>
            <p className="text-gray-600">
              Before we get started, please sign up or log in to continue
            </p>
          </div>
        </div>

        {/* ========================================
            AUTHENTICATION CARD WITH TABS
            ======================================== */}
        <Card>
          <CardHeader>
            <CardTitle>Account Access</CardTitle>
            <CardDescription>Choose an option to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tab component switches between Login and Signup forms */}
            <Tabs defaultValue="login" className="w-full">
              {/* Tab navigation buttons */}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">LOG IN</TabsTrigger>
                <TabsTrigger value="signup">SIGN UP</TabsTrigger>
              </TabsList>

              {/* ========================================
                  LOGIN FORM TAB
                  ======================================== */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  
                  {/* Username or Email input field */}
                  {/* Accepts EITHER username OR email for flexibility */}
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username or Email</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter username or email"
                      value={loginData.usernameOrEmail}
                      onChange={(e) =>
                        setLoginData({ ...loginData, usernameOrEmail: e.target.value })
                      }
                      required // HTML5 validation
                    />
                  </div>
                  
                  {/* Password input field */}
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password" // Hides password characters
                      placeholder="Enter password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {/* Error message display (only shows when loginError has content) */}
                  {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                  
                  {/* Submit button */}
                  <Button type="submit" className="w-full">
                    SIGN IN
                  </Button>
                  
                  {/* Forgot Password Link */}
                  {/* Links to password reset page where user can request reset email */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* ========================================
                  SIGNUP FORM TAB
                  ======================================== */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 pt-4">
                  
                  {/* Full name input */}
                  {/* Used for personalization throughout the app */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {/* Email input */}
                  {/* Must be unique across all users */}
                  {/* Can be used for login instead of username */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email" // HTML5 email validation
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {/* Password input */}
                  {/* Must be at least 6 characters */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Enter password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {/* Confirm password input */}
                  {/* Must match the password field exactly */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {/* Username input */}
                  {/* Must be unique across all users */}
                  {/* Can be used for login instead of email */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={signupData.username}
                      onChange={(e) =>
                        setSignupData({ ...signupData, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {/* Error message display (only shows when signupError has content) */}
                  {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
                  
                  {/* Submit button */}
                  <Button type="submit" className="w-full">
                    SIGN UP
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Copyright footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          © ANXIOCHECK
        </p>
      </div>
    </div>
  );
}

/* ========================================
   AUTHENTICATION SYSTEM SUMMARY
   ======================================== 
   
   STORAGE STRUCTURE IN LOCALSTORAGE:
   
   1. "users" - Array of all registered user accounts
      Format: [
        {
          name: "John Doe",
          email: "john@example.com",
          username: "johndoe",
          password: "password123"
        },
        {
          name: "Jane Smith",
          email: "jane@example.com", 
          username: "janesmith",
          password: "securepass"
        },
        ... more users ...
      ]
   
   2. "isAuthenticated" - String "true" when user is logged in
      Used by: Route protection to redirect unauthorized users
   
   3. "userName" - String with user's display name
      Used by: Dashboard welcome message, personalization
   
   4. "currentUser" - JSON object with full user data
      Used by: Reference for current logged-in user
   
   FEATURES:
   
   ✓ Multiple Users - Supports unlimited user accounts
   ✓ Unique Validation - Enforces unique emails and usernames
   ✓ Flexible Login - Accept either username OR email
   ✓ Password Confirmation - Ensures user typed password correctly
   ✓ Password Requirements - Minimum 6 characters
   ✓ Case-Insensitive - username/email matching ignores case
   ✓ Auto-Login After Signup - User goes straight to dashboard
   ✓ Persistent Storage - Credentials saved across sessions
   ✓ Error Feedback - Clear validation messages
   ✓ Form Clearing - Resets fields after successful submission
   
   SECURITY NOTE:
   This is a DEMO implementation suitable for client-side apps.
   For production with sensitive data:
   - Use backend authentication server
   - Hash passwords (bcrypt, argon2)
   - Implement JWT tokens
   - Add rate limiting
   - Use HTTPS
   - Add account recovery
   - Implement session expiration
   
   EDITING TIPS:
   
   To change password requirements:
   - Modify line checking password length
   - Add additional validation (special chars, numbers, etc.)
   
   To add more user fields:
   - Add to signupData state
   - Add input field in signup form
   - Include in newUser object
   - Update user type definition
   
   To implement "Remember Me":
   - Add checkbox in login form
   - Store flag in localStorage
   - Check on app load and auto-authenticate
   
   To add profile pictures:
   - Add avatarUrl field to user object
   - Store image as base64 or URL
   - Display in dashboard header
*/