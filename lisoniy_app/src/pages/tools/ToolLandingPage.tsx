import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  MessageSquare,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "motion/react";
import { AppLayout } from "@/app/components/layout/AppLayout";

interface ToolLandingPageProps {
  title: string;
  description: string;
  icon: any;
  features: {
    title: string;
    description: string;
    icon: any;
  }[];
  comingSoon?: boolean;
}

export function ToolLandingPage({ title, description, icon: IconComponent, features, comingSoon = true }: ToolLandingPageProps) {
  const navigate = useNavigate();

  return (
    <AppLayout pageTitle={title}>
      <div className="mx-auto max-w-6xl p-4 lg:p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                <IconComponent className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                {description}
              </p>
              {comingSoon && (
                <Badge variant="secondary" className="text-base px-4 py-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Tez orada
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-6">Imkoniyatlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-2">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                        <FeatureIcon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        {comingSoon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Yangilikdan xabardor bo'ling
                </h3>
                <p className="text-muted-foreground mb-6">
                  Bu asbob ustida ishlamoqdamiz. Yangiliklar uchun Telegram kanalimizga qo'shiling.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2" asChild>
                    <a href="https://t.me/lisoniy_uz" target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="h-5 w-5" />
                      Telegram Kanal
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate("/dashboard")}>
                    <ArrowRight className="h-5 w-5" />
                    Bosh sahifaga qaytish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
