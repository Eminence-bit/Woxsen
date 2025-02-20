import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 nothing-dots bg-background">
      <div className="w-full max-w-[350px] sm:max-w-[380px] mb-6 sm:mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/26407d83-9dec-4656-81b5-1e8b9a964a81.png" 
            alt="MedTrack Logo" 
            className="h-12 w-12 sm:h-16 sm:w-16 invert dark:invert-0 border-2 border-foreground rounded-md p-1"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-nothing mb-2 tracking-tight">
          <span className="inline-block">
            <span className="flex gap-1 justify-center">
              {Array.from("MEDTRACK").map((letter, i) => (
                <span 
                  key={i}
                  className="inline-block animate-fade-in"
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-nothing">
          CURRENT TIME IS {new Date().toLocaleTimeString()} ON {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className="w-full max-w-[350px] sm:max-w-[380px] card-nothing border-none shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg sm:text-xl text-center font-nothing">ACCESS PORTAL</CardTitle>
          <CardDescription className="text-center font-nothing text-xs">
            CHOOSE YOUR PREFERRED SIGN IN METHOD
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full button-nothing cursor-pointer"
            onClick={() => signInWithGoogle()}
          >
            <Mail className="mr-2 h-4 w-4" />
            CONTINUE WITH GOOGLE
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-nothing">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-nothing text-xs">EMAIL</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
                className="input-nothing cursor-text"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-nothing text-xs">PASSWORD</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={isLoading}
                required
                className="input-nothing cursor-text"
              />
            </div>
            <Button 
              disabled={isLoading} 
              className="w-full button-nothing cursor-pointer mt-2" 
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-2">
          <div className="text-sm text-muted-foreground text-center">
            <Link
              to="/reset-password"
              className="hover:text-primary underline underline-offset-4 font-nothing text-xs cursor-pointer"
            >
              FORGOT YOUR PASSWORD?
            </Link>
          </div>
          <div className="text-sm text-muted-foreground text-center font-nothing text-xs">
            DON'T HAVE AN ACCOUNT?{" "}
            <Link
              to="/signup"
              className="hover:text-primary underline underline-offset-4 cursor-pointer"
            >
              SIGN UP
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;