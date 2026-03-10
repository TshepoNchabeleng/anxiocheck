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
  
  const [loginData, setLoginData] = useState({ usernameOrEmail: "", password: "" });
  
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const storedUsers = localStorage.getItem("users");
    
    if (!storedUsers) {
      setLoginError("No accounts found. Please sign up first.");
      return;
    }

    const users: Array<{
      name: string;
      email: string;
      username: string;
      password: string;
    }> = JSON.parse(storedUsers);

    const inputIdentifier = loginData.usernameOrEmail.toLowerCase().trim();
    const inputPassword = loginData.password;

    const foundUser = users.find((user) => {
      const usernameMatches = user.username.toLowerCase() === inputIdentifier;
      const emailMatches = user.email.toLowerCase() === inputIdentifier;
      return usernameMatches || emailMatches;
    });

    if (!foundUser) {
      setLoginError("Username or email not found. Please check your details and try again.");
      return;
    }

    if (foundUser.password !== inputPassword) {
      setLoginError("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", foundUser.name);
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    
    setLoginData({ usernameOrEmail: "", password: "" });
    navigate("/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters long.");
      return;
    }

    if (!signupData.name.trim() || !signupData.username.trim()) {
      setSignupError("Please fill in all fields.");
      return;
    }

    const storedUsers = localStorage.getItem("users");
    const users: Array<{
      name: string;
      email: string;
      username: string;
      password: string;
    }> = storedUsers ? JSON.parse(storedUsers) : [];

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === signupData.email.toLowerCase().trim()
    );
    
    if (emailExists) {
      setSignupError(`The email "${signupData.email}" is already registered. Please use a different email or log in instead.`);
      return;
    }

    const usernameExists = users.some(
      (user) => user.username.toLowerCase() === signupData.username.toLowerCase().trim()
    );
    
    if (usernameExists) {
      setSignupError(`The username "${signupData.username}" is already taken. Please choose a different username.`);
      return;
    }

    const newUser = {
      name: signupData.name.trim(),
      email: signupData.email.toLowerCase().trim(),
      username: signupData.username.toLowerCase().trim(),
      password: signupData.password,
    };

    users.push(newUser);
    
    localStorage.setItem("users", JSON.stringify(users));
    
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", newUser.name);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.removeItem("hasSeenTour"); // Ensure first-time signups see the tour
    
    setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    });
    
    navigate("/dashboard");
  };

  const handleGoogleAuth = () => {
    // Mock Google Sign-In
    const mockUser = {
      name: "Google User",
      email: "user@gmail.com",
      username: "google_user",
      password: "mock_password",
    };
    
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", mockUser.name);
    localStorage.setItem("currentUser", JSON.stringify(mockUser));
    localStorage.removeItem("hasSeenTour");
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-[#121212] p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 18C8 18 4 16 2 14C0.5 12.5 0 11 0.5 10C1 9 2 9 3 10C4.5 11.5 6 13.5 7 15C7.5 16 8 17 8 18Z" fill="white" />
              <path d="M7 20C7 20 3.5 19 1.5 17.5C0 16.5 -0.5 15.5 0 14.5C0.5 13.5 1.5 13.5 2.5 14.5C4 15.5 5.5 17 6.5 18.5C6.8 19 7 19.5 7 20Z" fill="white" />
              <path d="M7 22C7 22 4 21.5 2.5 20.5C1.5 19.8 1 19 1.5 18C2 17 3 17.5 4 18.5C5 19.5 6 20.5 6.5 21.5C6.8 21.8 7 22 7 22Z" fill="white" />
              
              <path d="M20 32C20 32 5 24 5 14C5 10 7.5 7.5 11 7.5C14 7.5 17 10 20 13C23 10 26 7.5 29 7.5C32.5 7.5 35 10 35 14C35 24 20 32 20 32Z" fill="white" />
              
              <path d="M32 18C32 18 36 16 38 14C39.5 12.5 40 11 39.5 10C39 9 38 9 37 10C35.5 11.5 34 13.5 33 15C32.5 16 32 17 32 18Z" fill="white" />
              <path d="M33 20C33 20 36.5 19 38.5 17.5C40 16.5 40.5 15.5 40 14.5C39.5 13.5 38.5 13.5 37.5 14.5C36 15.5 34.5 17 33.5 18.5C33.2 19 33 19.5 33 20Z" fill="white" />
              <path d="M33 22C33 22 36 21.5 37.5 20.5C38.5 19.8 39 19 38.5 18C38 17 37 17.5 36 18.5C35 19.5 34 20.5 33.5 21.5C33.2 21.8 33 22 33 22Z" fill="white" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">ANXIOCHECK</h1>
          
          <div className="mt-6 mb-6">
            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-5 max-w-sm mx-auto">
              Your personal health companion. We help you monitor vitals, track your mood, and provide a discreet emergency protocol when you need it most.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs rounded-full font-semibold">Track Vitals</span>
              <span className="px-3 py-1 bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 text-xs rounded-full font-semibold">Find Calm</span>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-xs rounded-full font-semibold">Stay Safe</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Access</CardTitle>
            <CardDescription>Choose an option to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">LOG IN</TabsTrigger>
                <TabsTrigger value="signup">SIGN UP</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
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
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                  {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                  
                  <Button type="submit" className="w-full">
                    SIGN IN
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleAuth}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  
                  <div className="text-center mt-4">
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

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 pt-4">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  
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
                  
                  {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
                  
                  <Button type="submit" className="w-full">
                    SIGN UP
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleAuth}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8 pb-6 space-y-1.5">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Product by Invero, Inc.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built by Tshepo Nchabeleng, Sbusiso Ndhlovu, & Ndabezihle Zwane
          </p>
        </div>
      </div>
    </div>
  );
}
