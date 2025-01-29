import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const UpdatePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Call Supabase to update the user's password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });

      // Navigate to the dashboard after success
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="auth-container flex items-center justify-center min-h-screen">
        <div className="auth-card bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <div className="space-y-2 text-center">
            <h2 className="auth-title text-2xl font-semibold">
              Update Password
            </h2>
            <p className="auth-subtitle text-gray-600">
              Enter your new password below.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 w-full mt-4">
            {/* Input for new password */}
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-12 text-base border border-gray-300 rounded-lg p-3"
            />
            {/* Input for confirm password */}
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 text-base border border-gray-300 rounded-lg p-3"
            />
            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};
