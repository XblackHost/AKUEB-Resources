import { useListAdmissions, useUpdateAdmissionStatus, useDeleteAdmission } from "@workspace/api-client-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, GraduationCap, Phone, School, BookOpen, Calendar } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  enrolled:  { label: "Enrolled",  color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  rejected:  { label: "Rejected",  color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

const NEXT_STATUS: Record<string, string> = {
  pending:   "contacted",
  contacted: "enrolled",
  enrolled:  "enrolled",
  rejected:  "rejected",
};

export default function AdminAdmissions() {
  const { isAdmin, adminToken } = useAdmin();
  const { toast } = useToast();

  const { data: admissions, isLoading, refetch } = useListAdmissions({
    query: { enabled: isAdmin },
    request: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  const updateStatus = useUpdateAdmissionStatus({
    mutation: {
      onSuccess: () => {
        refetch();
        toast({ title: "Status updated" });
      },
    },
    request: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  const deleteRequest = useDeleteAdmission({
    mutation: {
      onSuccess: () => {
        refetch();
        toast({ title: "Request deleted" });
      },
    },
    request: { headers: { Authorization: `Bearer ${adminToken}` } },
  });

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-muted-foreground">Access restricted to operators.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Admission Requests</h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${admissions?.length ?? 0} total request${(admissions?.length ?? 0) !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : !admissions?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            <GraduationCap className="h-10 w-10 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No admission requests yet</p>
            <p className="text-sm mt-1">They'll appear here once students submit the form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {admissions.map((req) => {
              const statusInfo = STATUS_LABELS[req.status] ?? STATUS_LABELS.pending;
              return (
                <div key={req.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-semibold text-foreground">{req.fullName}</h2>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground">Age {req.age}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 flex-shrink-0" />
                          <span>{req.schoolName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 flex-shrink-0" />
                          <span>Class {req.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <a
                            href={`https://wa.me/${req.whatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {req.whatsappNumber}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{new Date(req.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {req.subjects.map((s) => (
                          <span key={s} className="inline-flex px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2">
                      {req.status !== "enrolled" && req.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              admissionId: req.id,
                              data: { status: NEXT_STATUS[req.status] },
                            })
                          }
                        >
                          Mark as {STATUS_LABELS[NEXT_STATUS[req.status]]?.label}
                        </Button>
                      )}
                      {req.status !== "rejected" && req.status !== "enrolled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({ admissionId: req.id, data: { status: "rejected" } })
                          }
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={deleteRequest.isPending}
                        onClick={() => deleteRequest.mutate({ admissionId: req.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
