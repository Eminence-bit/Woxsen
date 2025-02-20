import { Card, CardContent } from "@/components/ui/card";

export const WeeklyOverview = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="card-nothing">
      <CardContent className="p-4">
        <h3 className="font-nothing mb-3">WEEKLY OVERVIEW</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div key={day} className="text-center">
              <div className="text-xs text-muted-foreground font-nothing mb-1">{day}</div>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center mx-auto nothing-glow">
                <span className="text-sm font-nothing">2</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};