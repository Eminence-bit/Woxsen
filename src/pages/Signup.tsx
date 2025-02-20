import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUpWithEmail(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 nothing-dots bg-background">
      <div className="w-full max-w-[380px] mb-8 text-center">
        <h1 className="text-4xl font-nothing mb-2 tracking-tight">
          <span className="inline-block">
            <span className="flex gap-1">
              {Array.from("CREATE ACCOUNT").map((letter, i) => (
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
        <p className="text-sm text-muted-foreground font-nothing">
          SYSTEM TIME: {new Date().toLocaleTimeString()}
        </p>
      </div>

      <Card className="w-full max-w-[380px] card-nothing border-none shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-center font-nothing">NEW USER REGISTRATION</CardTitle>
          <CardDescription className="text-center font-nothing text-xs">
            CHOOSE YOUR PREFERRED SIGN UP METHOD
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full button-nothing"
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
          <form onSubmit={handleSubmit} className="grid gap-4">
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
                className="input-nothing"
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
                autoComplete="new-password"
                disabled={isLoading}
                required
                className="input-nothing"
              />
            </div>
            <Button 
              disabled={isLoading} 
              className="w-full button-nothing" 
              type="submit"
            >
              {isLoading ? (
                <>
                  <Mail className="mr-2 h-4 w-4 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground text-center w-full font-nothing text-xs">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link
              to="/login"
              className="hover:text-primary underline underline-offset-4"
            >
              SIGN IN
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default Signup;