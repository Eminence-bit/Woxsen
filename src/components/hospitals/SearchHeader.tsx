import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SearchHeaderProps {
  searchRadius: number;
  onRadiusChange: (value: number) => void;
  onFilterChange: (value: string[]) => void;
}

export const SearchHeader = ({ searchRadius, onRadiusChange, onFilterChange }: SearchHeaderProps) => {
  // Convert meters to kilometers for display
  const radiusInKm = searchRadius / 1000;

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
      <div className="flex items-center gap-2 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search hospitals, clinics..." />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Radius (kilometers)</label>
                <Slider
                  value={[searchRadius]}
                  onValueChange={(value) => onRadiusChange(value[0])}
                  max={10000}
                  step={500}
                />
                <span className="text-sm text-muted-foreground">{radiusInKm.toFixed(1)}km</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Facility Type</label>
                <ToggleGroup type="multiple" onValueChange={onFilterChange} className="flex flex-wrap gap-2">
                  <ToggleGroupItem value="hospital">Hospitals</ToggleGroupItem>
                  <ToggleGroupItem value="clinic">Clinics</ToggleGroupItem>
                  <ToggleGroupItem value="pharmacy">Pharmacy</ToggleGroupItem>
                  <ToggleGroupItem value="diagnostic">Diagnostics</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};