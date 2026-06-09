import { useListMaterials, useDeleteMaterial, useCreateMaterial, useRequestUploadUrl, getListMaterialsQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileQuestion, BookOpen, Layers, ChevronLeft, Trash2, Plus, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Materials() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const parsedSubjectId = parseInt(subjectId, 10);
  const [, setLocation] = useLocation();
  const { isAdmin, adminToken } = useAdmin();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: materials, isLoading } = useListMaterials(parsedSubjectId, {
    query: {
      enabled: !!parsedSubjectId
    }
  });

  const deleteMaterial = useDeleteMaterial({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMaterialsQueryKey(parsedSubjectId) });
        toast({ title: "Material deleted" });
      },
      onError: (err) => {
        toast({ title: "Failed to delete material", description: err.error, variant: "destructive" });
      }
    },
    request: { headers: { Authorization: `Bearer ${adminToken}` } }
  });

  const requestUploadUrl = useRequestUploadUrl({
    request: { headers: { Authorization: `Bearer ${adminToken}` } }
  });

  const createMaterial = useCreateMaterial({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMaterialsQueryKey(parsedSubjectId) });
        toast({ title: "Material added successfully" });
        setNewMaterial({ title: "", type: "Notes", description: "", url: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSelectedFile(null);
        setIsUploading(false);
      },
      onError: (err) => {
        toast({ title: "Failed to add material", description: err.error, variant: "destructive" });
        setIsUploading(false);
      }
    },
    request: { headers: { Authorization: `Bearer ${adminToken}` } }
  });

  const [newMaterial, setNewMaterial] = useState({ title: "", type: "Notes", description: "", url: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTab, setUploadTab] = useState("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadTab === "file" && selectedFile) {
      setIsUploading(true);
      try {
        const uploadRes = await requestUploadUrl.mutateAsync({
          data: {
            name: selectedFile.name,
            size: selectedFile.size,
            contentType: selectedFile.type || "application/octet-stream"
          }
        });

        await fetch(uploadRes.uploadURL, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type || "application/octet-stream"
          }
        });

        await createMaterial.mutateAsync({
          subjectId: parsedSubjectId,
          data: {
            title: newMaterial.title,
            type: newMaterial.type,
            description: newMaterial.description,
            objectPath: uploadRes.objectPath
          }
        });
      } catch (error: any) {
        toast({ title: "Upload failed", description: error.message || "An error occurred", variant: "destructive" });
        setIsUploading(false);
      }
    } else {
      createMaterial.mutate({
        subjectId: parsedSubjectId,
        data: {
          title: newMaterial.title,
          type: newMaterial.type,
          description: newMaterial.description,
          url: newMaterial.url || undefined
        }
      });
    }
  };

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
      <Button 
        variant="ghost" 
        className="mb-8 pl-0 text-muted-foreground hover:text-foreground"
        onClick={() => {
          window.history.back();
        }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-4 mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-serif">Study Materials</h1>
        <p className="text-muted-foreground text-lg">Read notes, practice MCQs, and review past papers.</p>
      </div>

      {isAdmin && (
        <Card className="mb-10 bg-accent/20 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Material
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={newMaterial.type} 
                    onValueChange={(val) => setNewMaterial({ ...newMaterial, type: val })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Notes">Notes</SelectItem>
                      <SelectItem value="Past Papers">Past Papers</SelectItem>
                      <SelectItem value="MCQs">MCQs</SelectItem>
                      <SelectItem value="Solved Examples">Solved Examples</SelectItem>
                      <SelectItem value="Summary">Summary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  className="h-20"
                />
              </div>
              
              <Tabs value={uploadTab} onValueChange={setUploadTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-sm">
                  <TabsTrigger value="file">
                    <Upload className="h-4 w-4 mr-2" /> File
                  </TabsTrigger>
                  <TabsTrigger value="link">
                    <LinkIcon className="h-4 w-4 mr-2" /> External Link
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-2 pt-4">
                  <Label htmlFor="file">Upload File *</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                    required={uploadTab === "file"}
                  />
                </TabsContent>
                <TabsContent value="link" className="space-y-2 pt-4">
                  <Label htmlFor="url">URL *</Label>
                  <Input 
                    id="url" 
                    type="url" 
                    placeholder="https://..."
                    value={newMaterial.url}
                    onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                    required={uploadTab === "link"}
                  />
                </TabsContent>
              </Tabs>

              <Button type="submit" className="mt-4" disabled={isUploading || createMaterial.isPending}>
                {isUploading ? "Uploading..." : createMaterial.isPending ? "Adding..." : "Add Material"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

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
            <div key={material.id} className="space-y-8 relative group">
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
                    variant={material.url || material.objectPath ? "default" : "secondary"}
                    disabled={!material.url && !material.objectPath}
                    onClick={() => {
                      if (material.objectPath) {
                        window.open(`/api/storage/objects/${material.objectPath.replace('/objects/', '')}`, '_blank');
                      } else if (material.url) {
                        window.open(material.url, '_blank');
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {material.url || material.objectPath ? "View Material" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
              
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this material?")) {
                      deleteMaterial.mutate({ materialId: material.id });
                    }
                  }}
                  disabled={deleteMaterial.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

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
