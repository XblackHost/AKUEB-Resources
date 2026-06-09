import { useListSubjects, useCreateSubject, useDeleteSubject, getListSubjectsQueryKey } from "@workspace/api-client-react";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Subjects() {
  const { classId } = useParams<{ classId: string }>();
  const parsedClassId = parseInt(classId, 10);
  const [, setLocation] = useLocation();
  const { isAdmin, adminToken } = useAdmin();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: subjects, isLoading } = useListSubjects(parsedClassId, {
    query: {
      enabled: !!parsedClassId
    }
  });

  const createSubject = useCreateSubject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSubjectsQueryKey(parsedClassId) });
        setCreateDialogOpen(false);
        setNewSubject({ name: "", icon: "", description: "" });
        toast({ title: "Subject created" });
      },
      onError: (err) => {
        toast({ title: "Failed to create subject", description: err.error, variant: "destructive" });
      }
    },
    request: { headers: { Authorization: `Bearer ${adminToken}` } }
  });

  const deleteSubject = useDeleteSubject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSubjectsQueryKey(parsedClassId) });
        toast({ title: "Subject deleted" });
      },
      onError: (err) => {
        toast({ title: "Failed to delete subject", description: err.error, variant: "destructive" });
      }
    },
    request: { headers: { Authorization: `Bearer ${adminToken}` } }
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", icon: "", description: "" });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    createSubject.mutate({
      classId: parsedClassId,
      data: newSubject
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-8 pl-0 text-muted-foreground hover:text-foreground"
        onClick={() => setLocation("/classes")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Classes
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif">Subjects</h1>
          <p className="text-muted-foreground text-lg">Pick a subject to explore its study resources.</p>
        </div>
        
        {isAdmin && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Subject</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubject} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon Name (lucide-react, optional)</Label>
                  <Input 
                    id="icon" 
                    value={newSubject.icon}
                    onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea 
                    id="description" 
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createSubject.isPending}>
                  {createSubject.isPending ? "Adding..." : "Add Subject"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
            <div key={subject.id} className="relative group">
              <Link href={`/subjects/${subject.id}/materials`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer bg-card hover:bg-primary/5">
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
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm("Are you sure you want to delete this subject?")) {
                      deleteSubject.mutate({ subjectId: subject.id });
                    }
                  }}
                  disabled={deleteSubject.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
