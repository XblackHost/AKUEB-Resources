import { useListClasses } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Classes() {
  const { data: classes, isLoading } = useListClasses();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-serif">Select your Class</h1>
        <p className="text-muted-foreground text-lg">Choose your grade to find relevant study materials, notes, and past papers.</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : classes?.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border shadow-sm">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No classes found</h3>
          <p className="text-muted-foreground">Check back later for updates.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes?.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.id}/subjects`}>
              <Card className="h-full hover-elevate transition-all duration-300 cursor-pointer border-border group overflow-hidden bg-card">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <GraduationCap className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <CardTitle className="text-2xl font-serif">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {cls.description || `Study materials for Grade ${cls.grade}`}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
