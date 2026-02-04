import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { motion } from "motion/react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-6xl font-bold text-foreground mb-4"
            >
              404
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-semibold text-foreground mb-4"
            >
              Sahifa topilmadi
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-muted-foreground mb-8 max-w-md mx-auto"
            >
              Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Orqaga qaytish
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Bosh sahifa
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
