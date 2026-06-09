import { useListSubjects } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked, ChevronRight } from "lucide-react";

export default function Subjects() {
  const { classId } = useParams<{ classId: string }>();
  const parsedClassId = parseInt(classId, 10);
  
  const { data: subjects, isLoading } = useListSubjects(parsedClassId, {
    query: {
      enabled: !!parsedClassId
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-serif">Subjects</h1>
        <p className="text-muted-foreground text-lg">Pick a subject to explore its study resources.</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : subjects?.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border shadow-sm">
          <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No subjects available</h3>
          <p className="text-muted-foreground">Resources are still being compiled for this class.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subjects?.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.id}/materials`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group bg-card hover:bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-background rounded-full p-2 border border-border/50 group-hover:border-primary/30">
                      <BookMarked className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
