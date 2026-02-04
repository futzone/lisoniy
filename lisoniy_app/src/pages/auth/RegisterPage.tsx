import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Eye, EyeOff, UserPlus, ArrowLeft, AlertCircle } from "lucide-react";
import { authApi, type ApiError } from "@/api/authApi";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Parollar mos kelmadi!");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone || undefined
      });

      // Navigate to email verification page with email
      navigate("/auth/verify-email", { state: { email: formData.email } });
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.status === 409) {
        setError("Bu email allaqachon ro'yxatdan o'tgan");
      } else if (apiError.status === 429) {
        setError("Juda ko'p urinish. Iltimos, keyinroq qayta urinib ko'ring.");
      } else if (apiError.status === 422) {
        setError("Ma'lumotlar noto'g'ri. Iltimos, qaytadan tekshiring.");
      } else {
        setError(apiError.detail || "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 px-4 py-8 overflow-y-auto">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bosh sahifaga
          </Button>
        </Link>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
              <UserPlus className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Ro'yxatdan O'tish</CardTitle>
            <CardDescription>
              Lisoniy jamoasiga qo'shiling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">To'liq ism</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ism Familiya"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Elektron pochta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqam</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Parolni tasdiqlash</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? "Kuting..." : "Ro'yxatdan O'tish"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Akkauntingiz bormi? </span>
              <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                Kirish
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative orbs */}
      <div className="absolute -top-24 left-0 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
    </div>
  );
}