import { Link } from "react-router-dom";
import { Calendar, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMedications } from "@/hooks/useMedications";

const Index = () => {
  const { data: medications, isLoading } = useMedications();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <Card className="card-nothing">
        <CardContent className="p-6">
          <h2 className="text-xl font-nothing mb-2">WELCOME TO MEDTRACK</h2>
          <p className="text-muted-foreground font-nothing text-xs">YOUR PERSONAL HEALTHCARE COMPANION</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/health-records" className="block">
          <Card className="card-nothing h-full hover:bg-accent/5">
            <CardContent className="p-4 text-center">
              <div className="w-full h-full flex flex-col items-center gap-3">
                <div className="bg-background/80 rounded-full w-12 h-12 flex items-center justify-center nothing-glow">
                  <FileText className="h-6 w-6" />
                </div>
                <span className="font-nothing text-xs">HEALTH RECORDS</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/reminders" className="block">
          <Card className="card-nothing h-full hover:bg-accent/5">
            <CardContent className="p-4 text-center">
              <div className="w-full h-full flex flex-col items-center gap-3">
                <div className="bg-background/80 rounded-full w-12 h-12 flex items-center justify-center nothing-glow">
                  <Calendar className="h-6 w-6" />
                </div>
                <span className="font-nothing text-xs">REMINDERS</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming Reminders */}
      <Card className="card-nothing">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-nothing text-xs">UPCOMING REMINDERS</h3>
            <Link to="/reminders">
              <Button variant="ghost" size="sm" className="button-nothing">
                VIEW ALL
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading reminders...</p>
            ) : medications && medications.length > 0 ? (
              medications.slice(0, 2).map((medication) => (
                <div key={medication.id} className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg nothing-glow">
                  <div className="bg-background/80 rounded-lg p-2 nothing-glow">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-nothing text-xs">{medication.name}</p>
                    <p className="text-xs text-muted-foreground font-nothing">
                      {medication.timings[0]}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming reminders</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default Index;