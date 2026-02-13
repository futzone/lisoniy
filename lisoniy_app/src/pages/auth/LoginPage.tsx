import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authApi, type ApiError } from "@/api/authApi";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Login to get tokens
      const tokenResponse = await authApi.login({ email, password });

      // 2. Fetch user profile using the new access token
      // Note: apiClient automatically uses the token from store, but we haven't stored it yet.
      // Wait! getMe() uses apiClient which reads from store.
      // WE MUST STORE TOKENS FIRST before calling getMe() if getMe() uses apiClient.
      // OR we can pass it manually if we supported it, but we removed support.
      // FIX: Store tokens first, then call getMe().

      // 3. Store tokens in auth store (without user info first, or partial)
      // Actually login() expects User object.
      // We have a chicken-and-egg problem:
      // login() sets tokens AND user.
      // getMe() needs tokens.
      // We can use setTokens() first?
      // authStore has setTokens().

      const setTokens = useAuthStore.getState().setTokens;
      setTokens(tokenResponse.access_token, tokenResponse.refresh_token);

      const userProfile = await authApi.getMe();

      // 3. Store tokens and user in auth store
      login(
        {
          id: userProfile.id,
          email: userProfile.email,
          fullName: userProfile.full_name,
          phone: userProfile.phone || "",
          isVerified: userProfile.is_verified
        },
        tokenResponse.access_token,
        tokenResponse.refresh_token
      );

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;

      // Handle different error scenarios
      if (apiError.status === 401) {
        setError("Elektron pochta yoki parol noto'g'ri");
      } else if (apiError.status === 403) {
        setError("Elektron pochtangizni tasdiqlang. Emailingizni tekshiring.");
      } else if (apiError.status === 429) {
        setError("Juda ko'p urinish. Iltimos, keyinroq qayta urinib ko'ring.");
      } else {
        setError(apiError.detail || "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 px-4">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bosh sahifaga
          </Button>
        </Link>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
              <LogIn className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Tizimga Kirish</CardTitle>
            <CardDescription>
              Lisoniy platformasiga xush kelibsiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Elektron pochta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Parol</Label>
                  <Link to="/auth/reset-password" className="text-sm text-primary hover:underline">
                    Unutdingizmi?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Kuting..." : "Kirish"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Akkauntingiz yo'qmi? </span>
              <Link to="/auth/register" className="font-semibold text-primary hover:underline">
                Ro'yxatdan o'tish
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative orbs */}
      <div className="absolute -top-24 left-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
    </div>
  );
}