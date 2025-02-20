import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { toast } from "sonner";

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  medicalConditions: string;
  allergies: string;
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
}

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    medicalConditions: "",
    allergies: "",
    emergencyContacts: [{ name: "", relationship: "", phone: "" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Write to Realtime Database instead of Firestore
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        ...profile,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      toast.success("Profile created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const addEmergencyContact = () => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", relationship: "", phone: "" },
      ],
    }));
  };

  const updateEmergencyContact = (
    index: number,
    field: keyof typeof profile.emergencyContacts[0],
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Step {currentStep} of 3
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={profile.medicalConditions}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      medicalConditions: e.target.value,
                    }))
                  }
                  placeholder="List any medical conditions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      allergies: e.target.value,
                    }))
                  }
                  placeholder="List any allergies..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                {profile.emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium">
                      Emergency Contact {index + 1}
                    </h3>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) =>
                          updateEmergencyContact(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input
                        value={contact.relationship}
                        onChange={(e) =>
                          updateEmergencyContact(
                            index,
                            "relationship",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) =>
                          updateEmergencyContact(index, "phone", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addEmergencyContact}
              >
                Add Another Emergency Contact
              </Button>
            </div>
          )}

          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                type="button"
                className="flex-1"
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                Complete Profile
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;