import { useListMaterials } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileQuestion, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Materials() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const parsedSubjectId = parseInt(subjectId, 10);
  
  const { data: materials, isLoading } = useListMaterials(parsedSubjectId, {
    query: {
      enabled: !!parsedSubjectId
    }
  });

  const getIconForType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'notes': return <BookOpen className="h-5 w-5" />;
      case 'past papers': return <Layers className="h-5 w-5" />;
      case 'mcqs': return <FileQuestion className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch(type.toLowerCase()) {
      case 'notes': return "default";
      case 'past papers': return "secondary";
      case 'mcqs': return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-4 mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-serif">Study Materials</h1>
        <p className="text-muted-foreground text-lg">Read notes, practice MCQs, and review past papers.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : materials?.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border shadow-sm">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No materials found</h3>
          <p className="text-muted-foreground">Check back later for new study resources.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {materials?.map((material, index) => (
            <div key={material.id} className="space-y-8">
              <Card className="hover:border-primary/30 transition-colors bg-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="space-y-2">
                    <Badge variant={getBadgeVariant(material.type) as any} className="mb-2">
                      {material.type}
                    </Badge>
                    <CardTitle className="text-xl leading-tight">{material.title}</CardTitle>
                    {material.description && (
                      <CardDescription className="text-base mt-2">
                        {material.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="bg-primary/5 p-3 rounded-full hidden sm:block">
                    {getIconForType(material.type)}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full sm:w-auto" 
                    variant={material.url ? "default" : "secondary"}
                    disabled={!material.url}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {material.url ? "View Material" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>

              {/* Show an ad slot after every 3 materials */}
              {(index + 1) % 3 === 0 && index !== materials.length - 1 && (
                <div 
                  id={`ad-inline-${index}`} 
                  className="w-full h-[90px] bg-muted border border-border/50 rounded-lg flex items-center justify-center text-muted-foreground/50 text-xs font-medium uppercase tracking-widest relative overflow-hidden my-8"
                >
                  <span className="relative z-10">Advertisement</span>
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
