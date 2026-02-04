import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { authApi, type ApiError } from "@/api/authApi";

export function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/auth/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp.slice(0, 6));

    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    setError("");

    if (otpCode.length !== 6) {
      setError("Iltimos, 6 raqamli kodni kiriting");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.verifyEmail({
        email: email,
        otp: otpCode
      });

      // Success - navigate to login
      navigate("/auth/login", {
        state: {
          message: "Emailingiz muvaffaqiyatli tasdiqlandi. Endi tizimga kirishingiz mumkin."
        }
      });
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 400 || apiError.status === 404) {
        setError("Tasdiqlash kodi noto'g'ri yoki eskirdi");
      } else {
        setError("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    // Backend currently doesn't support explicit resend endpoint
    // This is a placeholder for future implementation
    alert("Hozircha qayta yuborish imkoniyati mavjud emas. Iltimos, ro'yxatdan o'tishni qaytadan urinib ko'ring yoki supportga murojaat qiling.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 px-4">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:20px_20px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Email Tasdiqlash</CardTitle>
            <CardDescription>
              <strong>{email}</strong> manziliga yuborilgan 6 raqamli kodni kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-14 w-12 text-center text-xl font-semibold"
                  />
                ))}
              </div>

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
                {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Kod kelmadimi? </span>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 font-semibold"
                  onClick={handleResend}
                >
                  Qayta yuborish
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative orbs */}
      <div className="absolute -top-24 left-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
    </div>
  );
}