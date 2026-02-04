import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Award, Star } from "lucide-react";

interface AchievementsCardProps {
    ball: number;
}

const LEVELS = [
    { name: "Ishtirokchi", min: 0, max: 1000, desc: "Platformaning yangi a'zosi, ilk qadamlarini qo‘yayotgan contributor." },
    { name: "Tadqiqotchi", min: 1001, max: 5000, desc: "Faol izlanishdagi foydalanuvchi, datasetlar ustida muntazam ishlovchi a’zo." },
    { name: "Ekspert", min: 5001, max: 15000, desc: "Tajribali foydalanuvchi, hamjamiyatda o‘z o‘rniga ega bo‘lgan mutaxassis." },
    { name: "Akademik", min: 15001, max: 50000, desc: "Minglab ma'lumotlarni saralagan va tizimni mazmunan boyitgan yirik hissa qo‘shuvchi." },
    { name: "Navoiy izdoshi", min: 50000, max: Infinity, desc: "Eng yuqori cho‘qqi. O‘zbek tili va raqamli merosimizni kelajak avlodga yetkazishda beqiyos xizmat qilgan shaxs." },
];

export function AchievementsCard({ ball }: AchievementsCardProps) {
    const currentLevelIndex = LEVELS.findIndex((level, index) => {
        const nextLevel = LEVELS[index + 1];
        return ball >= level.min && (nextLevel ? ball < nextLevel.min : true);
    });

    const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];
    const nextLevel = LEVELS[currentLevelIndex + 1];

    let progress = 0;
    if (nextLevel) {
        const range = nextLevel.min - currentLevel.min;
        const current = ball - currentLevel.min;
        progress = Math.min(100, Math.max(0, (current / range) * 100));
    } else {
        progress = 100; // Max level reached
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Mening darajam
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Level Badge */}
                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-center mb-3 shadow-lg">
                        <Star className="h-8 w-8 text-white fill-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">{currentLevel.name}</h3>
                    <p className="text-sm text-center text-muted-foreground mt-1 max-w-xs">
                        {currentLevel.desc}
                    </p>
                </div>

                {/* Progress to Next Level */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Joriy ball: <span className="text-foreground">{ball}</span></span>
                        {nextLevel ? (
                            <span className="text-muted-foreground">Keyingi daraja: <span className="text-primary font-bold text-sm ml-1">{nextLevel.min}</span></span>
                        ) : (
                            <span className="text-green-600 font-bold">Max level!</span>
                        )}
                    </div>
                    <Progress value={progress} className="h-2" />
                    {nextLevel && (
                        <p className="text-xs text-center text-muted-foreground pt-1">
                            Keyingi daraja "{nextLevel.name}" ga yetish uchun yana <strong>{nextLevel.min - ball}</strong> ball kerak.
                        </p>
                    )}
                </div>

                {/* All Levels List */}
                <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-sm">Barcha darajalar</h4>
                    <div className="space-y-3">
                        {LEVELS.map((level, idx) => {
                            const isPassed = ball >= level.max || (idx < currentLevelIndex);
                            const isCurrent = idx === currentLevelIndex;

                            return (
                                <div key={level.name} className={`flex items-start gap-3 p-3 rounded-lg border ${isCurrent ? 'bg-accent border-accent-foreground/20' : 'bg-card'}`}>
                                    <div className={`mt-1 h-2 w-2 rounded-full ${isCurrent ? 'bg-green-500 animate-pulse' : (isPassed ? 'bg-primary' : 'bg-muted-foreground/30')}`} />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${isCurrent ? 'text-primary' : ''}`}>{level.name}</span>
                                            <span className="text-sm font-bold text-primary">{level.min.toLocaleString()} - {level.max === Infinity ? '∞' : level.max.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{level.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
