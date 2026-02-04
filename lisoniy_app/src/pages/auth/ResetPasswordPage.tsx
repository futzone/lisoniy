import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { KeyRound, ArrowLeft, Mail, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authApi, type ApiError } from "@/api/authApi";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Request Mode State
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  // Confirm Mode State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();

  // Mode 1: Request Password Reset
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authApi.requestPasswordReset(email);
      setEmailSent(true);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 429) {
        setError("Juda ko'p urinish. Iltimos, keyinroq qayta urinib ko'ring.");
      } else {
        // For security, checking email existence is often silent, but here we can show error if needed
        // or just pretend it worked to avoid enumeration. 
        // Backend returns success message even if email not found (usually).
        setError(apiError.detail || "Xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mode 2: Confirm Password Reset
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parollar mos kelmadi");
      return;
    }

    if (!token) return;

    setIsLoading(true);

    try {
      await authApi.resetPassword(token, password);
      setResetComplete(true);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 400) {
        setError("Havola eskirgan yoki noto'g'ri");
      } else {
        setError(apiError.detail || "Xatolik yuz berdi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render: Email Sent Success View
  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 px-4">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <Card className="border-2 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                <Mail className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Email Yuborildi</CardTitle>
              <CardDescription>
                Parolni tiklash bo'yicha ko'rsatmalar <strong>{email}</strong> manziliga yuborildi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Agar xat ko'rinmasa, spam papkasini tekshiring.
              </p>
              <Link to="/auth/login">
                <Button className="w-full">
                  Kirish sahifasiga qaytish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render: Password Reset Complete View
  if (resetComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 px-4">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <Card className="border-2 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                <CheckCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Parol O'zgartirildi</CardTitle>
              <CardDescription>
                Sizning parolingiz muvaffaqiyatli yangilandi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Kirish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render: Main Form (either Request or Confirm)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 px-4">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link to="/auth/login">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kirish sahifasiga
          </Button>
        </Link>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
              <KeyRound className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">
              {token ? "Yangi Parol O'rnatish" : "Parolni Tiklash"}
            </CardTitle>
            <CardDescription>
              {token
                ? "Yangi parolingizni kiriting"
                : "Elektron pochta manzilingizni kiriting"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {token ? (
              // Confirm Password Form
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Yangi Parol</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Parolni Tasdiqlash</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saqlanmoqda..." : "Parolni Yangilash"}
                </Button>
              </form>
            ) : (
              // Request Reset Form
              <form onSubmit={handleRequestSubmit} className="space-y-4">
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
                  <p className="text-xs text-muted-foreground">
                    Parolni tiklash uchun havola yuboramiz
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Yuborilmoqda..." : "Havola Yuborish"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <Link to="/auth/login" className="text-primary hover:underline">
                Kirish sahifasiga qaytish
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative orbs */}
      <div className="absolute -top-24 left-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
    </div>
  );
}