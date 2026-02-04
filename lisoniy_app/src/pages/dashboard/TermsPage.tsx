import { useState } from "react";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { BookA, Tags, Plus } from "lucide-react";
// We will create these sub-components next
import { CategoriesManager } from "./components/CategoriesManager";
import { TermsManager } from "./components/TermsManager";

export function TermsPage() {
    const [activeTab, setActiveTab] = useState("terms");

    return (
        <AppLayout pageTitle="Atamalar Bazasi">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Atamalar va Kategoriyalar</h2>
                        <p className="text-muted-foreground">
                            Tizimdagi barcha atamalar va ularning toifalarini boshqarish
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="terms" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="terms" className="gap-2">
                            <BookA className="h-4 w-4" />
                            Atamalar
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="gap-2">
                            <Tags className="h-4 w-4" />
                            Kategoriyalar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="terms" className="space-y-4">
                        <TermsManager />
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-4">
                        <CategoriesManager />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
