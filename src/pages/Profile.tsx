import { useState, useEffect } from "react";
import { User, Edit, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { database } from "@/lib/firebase";
import { ref, get, update } from "firebase/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  medicalConditions: string;
  allergies: string;
  email: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setProfile(snapshot.val());
          setEditForm(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user || !editForm) return;

    try {
      const userRef = ref(database, `users/${user.uid}`);
      await update(userRef, editForm);
      setProfile(editForm);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-md mx-auto pt-6 px-4">
        <Card className="mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback>{profile.fullName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0"> {/* Added min-w-0 for proper truncation */}
              <h2 className="text-xl font-semibold truncate">{profile.fullName}</h2>
              <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={editForm?.fullName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev!,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={editForm?.phoneNumber}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev!,
                            phoneNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={editForm?.dateOfBirth}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev!,
                            dateOfBirth: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={editForm?.address}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev!,
                            address: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medical Conditions</Label>
                      <Textarea
                        value={editForm?.medicalConditions}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev!,
                            medicalConditions: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Allergies</Label>
                      <Textarea
                        value={editForm?.allergies}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev!,
                            allergies: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button className="w-full" onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Phone Number</h3>
              <p>{profile.phoneNumber}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Date of Birth</h3>
              <p>{profile.dateOfBirth}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Address</h3>
              <p>{profile.address}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Medical Conditions</h3>
              <p>{profile.medicalConditions || "None listed"}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Allergies</h3>
              <p>{profile.allergies || "None listed"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Menu */}
        <div className="space-y-2">
          {[
            { icon: Bell, label: "Notifications", badge: "3" },
            { icon: Shield, label: "Privacy & Security" },
            { icon: HelpCircle, label: "Help & Support" },
            { icon: LogOut, label: "Logout", variant: "destructive" as const, onClick: handleLogout },
          ].map((item) => (
            <Button
              key={item.label}
              variant={item.variant || "ghost"}
              className="w-full justify-start h-14 px-4 relative animate-fade-in"
              onClick={item.onClick}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
              {item.badge && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
