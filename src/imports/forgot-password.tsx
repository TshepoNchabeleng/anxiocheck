import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

// ========================================
// FORGOT PASSWORD PAGE
// ========================================
// This page allows users to reset their password by entering their email or username
// In a production app, this would send an actual email with a reset link
// This demo shows the UI flow and mock email sending

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // State for the email/username input field
  const [identifier, setIdentifier] = useState("");
  
  // State for error messages
  const [error, setError] = useState("");
  
  // State to track if email was "sent" successfully
  const [emailSent, setEmailSent] = useState(false);
  
  // State for loading/sending status
  const [isSending, setIsSending] = useState(false);

  // ========================================
  // HANDLE PASSWORD RESET REQUEST
  // ========================================
  // Validates that the email/username exists and "sends" a reset email
  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSending(true);

    // Simulate network delay (remove in production with real API)
    setTimeout(() => {
      // ========================================
      // RETRIEVE ALL REGISTERED USERS
      // ========================================
      const storedUsers = localStorage.getItem("users");
      
      if (!storedUsers) {
        setError("No accounts found in the system. Please sign up first.");
        setIsSending(false);
        return;
      }

      // Parse users array
      const users: Array<{
        name: string;
        email: string;
        username: string;
        password: string;
      }> = JSON.parse(storedUsers);

      // Normalize input for case-insensitive matching
      const inputIdentifier = identifier.toLowerCase().trim();

      // ========================================
      // FIND USER BY EMAIL OR USERNAME
      // ========================================
      const foundUser = users.find((user) => {
        const usernameMatches = user.username.toLowerCase() === inputIdentifier;
        const emailMatches = user.email.toLowerCase() === inputIdentifier;
        return usernameMatches || emailMatches;
      });

      // If user not found, show error
      if (!foundUser) {
        setError(`No account found with "${identifier}". Please check your details and try again.`);
        setIsSending(false);
        return;
      }

      // ========================================
      // MOCK EMAIL SENDING
      // ========================================
      // In production, you would call an API endpoint here that:
      // 1. Generates a unique password reset token
      // 2. Stores the token in database with expiration time
      // 3. Sends email with reset link containing the token
      // 4. Returns success/failure response
      //
      // Example with a real backend:
      /*
      try {
        await fetch('/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: foundUser.email })
        });
      } catch (error) {
        setError("Failed to send reset email. Please try again.");
        return;
      }
      */
      
      // For this demo, we'll just show a success message
      console.log("===== MOCK EMAIL SENT =====");
      console.log("To:", foundUser.email);
      console.log("Subject: Reset Your ANXIOCHECK Password");
      console.log("Content: Click the link below to reset your password:");
      console.log("https://anxiocheck.com/reset-password?token=mock-token-12345");
      console.log("This link expires in 1 hour.");
      console.log("===========================");

      // Show success state
      setEmailSent(true);
      setIsSending(false);
    }, 1500); // Simulate 1.5 second network delay
  };

  // ========================================
  // SUCCESS STATE - EMAIL SENT
  // ========================================
  // Show confirmation message after "email" is sent
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
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
            <h1 className="text-2xl font-bold text-gray-900">ANXIOCHECK</h1>
          </div>

          {/* Success card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                Password reset instructions have been sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  We've sent password reset instructions to the email address associated with your account.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Please check your inbox and follow the link to reset your password.
                </p>
                <p className="text-sm text-gray-500 mt-2 italic">
                  Note: The link will expire in 1 hour for security reasons.
                </p>
              </div>

              {/* Demo note - remove in production */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-800 font-semibold mb-1">
                  🎬 DEMO MODE
                </p>
                <p className="text-xs text-yellow-700">
                  This is a client-side demo. In production, a real email would be sent using services like SendGrid, AWS SES, or Supabase Auth. Check the browser console to see the mock email content.
                </p>
              </div>

              <Button 
                onClick={() => navigate("/")} 
                className="w-full"
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ========================================
  // REQUEST STATE - ENTER EMAIL/USERNAME
  // ========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
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
          <h1 className="text-2xl font-bold text-gray-900">ANXIOCHECK</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Forgot Password?
            </CardTitle>
            <CardDescription>
              Enter your email or username and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetRequest} className="space-y-4">
              {/* Email or Username input */}
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={isSending}
                />
              </div>

              {/* Error message display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Reset Instructions"}
              </Button>

              {/* Back to login link */}
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </form>
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
   FORGOT PASSWORD IMPLEMENTATION GUIDE
   ========================================
   
   CURRENT STATE (Demo):
   This is a client-side demo that validates the user exists
   and shows a mock email flow. No actual email is sent.
   
   TO IMPLEMENT REAL EMAIL FUNCTIONALITY:
   
   OPTION 1: Using Supabase Auth (Recommended for this app)
   --------------------------------------------------------
   1. Set up Supabase project (if not already done)
   2. Enable Email Auth in Supabase Dashboard
   3. Configure email templates for password reset
   4. Replace mock logic with Supabase call:
   
   import { supabase } from '../lib/supabase';
   
   const handleResetRequest = async (e) => {
     e.preventDefault();
     setIsSending(true);
     
     const { error } = await supabase.auth.resetPasswordForEmail(
       foundUser.email,
       {
         redirectTo: 'https://yourapp.com/reset-password',
       }
     );
     
     if (error) {
       setError(error.message);
     } else {
       setEmailSent(true);
     }
     setIsSending(false);
   };
   
   OPTION 2: Using SendGrid API
   -----------------------------
   1. Sign up for SendGrid account
   2. Create API key
   3. Set up backend API endpoint (cannot send from client)
   4. Call your backend:
   
   const handleResetRequest = async (e) => {
     e.preventDefault();
     setIsSending(true);
     
     try {
       const response = await fetch('/api/forgot-password', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: foundUser.email })
       });
       
       if (response.ok) {
         setEmailSent(true);
       } else {
         setError("Failed to send reset email");
       }
     } catch (error) {
       setError("Network error. Please try again.");
     }
     
     setIsSending(false);
   };
   
   OPTION 3: Using AWS SES
   -----------------------
   Similar to SendGrid, requires backend endpoint
   
   BACKEND IMPLEMENTATION (Node.js example):
   
   app.post('/api/forgot-password', async (req, res) => {
     const { email } = req.body;
     
     // 1. Find user in database
     const user = await db.users.findOne({ email });
     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }
     
     // 2. Generate unique reset token
     const resetToken = crypto.randomBytes(32).toString('hex');
     const resetTokenExpiry = Date.now() + 3600000; // 1 hour
     
     // 3. Save token to database
     await db.users.updateOne(
       { email },
       { resetToken, resetTokenExpiry }
     );
     
     // 4. Send email with SendGrid
     await sendGrid.send({
       to: email,
       from: 'noreply@anxiocheck.com',
       subject: 'Reset Your Password',
       html: `
         <p>You requested a password reset.</p>
         <p>Click here to reset: 
           <a href="https://anxiocheck.com/reset-password?token=${resetToken}">
             Reset Password
           </a>
         </p>
         <p>This link expires in 1 hour.</p>
       `
     });
     
     res.json({ success: true });
   });
   
   SECURITY BEST PRACTICES:
   ------------------------
   ✓ Always use HTTPS
   ✓ Token should expire (1 hour recommended)
   ✓ Token should be single-use only
   ✓ Rate limit reset requests (prevent spam)
   ✓ Don't reveal if email exists (security through obscurity)
   ✓ Hash tokens before storing in database
   ✓ Log all reset attempts for security monitoring
   
   PASSWORD RESET PAGE:
   --------------------
   You'll also need to create a /reset-password page that:
   1. Accepts token from URL query parameter
   2. Validates token hasn't expired
   3. Shows form for new password
   4. Updates user's password in database
   5. Invalidates the reset token
   6. Redirects to login page
*/
