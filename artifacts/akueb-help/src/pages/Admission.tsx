import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitAdmission } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, CheckCircle2, ArrowLeft } from "lucide-react";
import zulfiplexLogo from "../assets/zulfiplex-logo.png";

const SUBJECTS = ["Mathematics", "Biology", "Physics", "Chemistry"] as const;
const GRADES = ["9th", "10th", "11th", "12th"] as const;

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.coerce.number().min(10, "Age must be at least 10").max(25, "Age must be 25 or under"),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  grade: z.enum(GRADES, { error: "Please select a class" }),
  whatsappNumber: z.string().min(7, "Please enter a valid WhatsApp number"),
  subjects: z.array(z.enum(SUBJECTS)).min(1, "Please select at least one subject"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Admission() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: undefined,
      schoolName: "",
      grade: undefined,
      whatsappNumber: "",
      subjects: [],
    },
  });

  const submitMutation = useSubmitAdmission({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (error) => {
        toast({
          title: "Submission failed",
          description: error.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  const onSubmit = (values: FormValues) => {
    submitMutation.mutate({ data: values });
  };

  const toggleSubject = (subject: (typeof SUBJECTS)[number], current: (typeof SUBJECTS)[number][]) => {
    if (current.includes(subject)) {
      return current.filter((s) => s !== subject);
    }
    return [...current, subject];
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 text-primary rounded-full p-5">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-foreground">Request Submitted!</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We've received your demo booking request. Our team will contact you on your WhatsApp number shortly to schedule your <span className="font-medium text-foreground">free demo session</span>.
          </p>
          <p className="text-sm text-muted-foreground">
            Remember — the demo is completely free. You decide afterwards whether to continue.
          </p>
          <Link href="/">
            <Button className="rounded-full px-8">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Academy branding */}
        <div className="flex items-center gap-4 mb-5 p-4 bg-card border border-border rounded-2xl shadow-sm">
          <img
            src={zulfiplexLogo}
            alt="Zulfiplex Academy"
            className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">Academy Admissions</p>
            <h2 className="text-lg font-serif font-semibold text-foreground leading-tight">Zulfiplex Academy</h2>
            <p className="text-xs text-muted-foreground">Subject-specialist tutoring for AKUEB Classes 9–12</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif text-foreground">Book a Free Demo</h1>
        </div>
        <p className="text-muted-foreground mb-2">
          Interested in joining Zulfiplex Academy? Fill in your details below and we'll reach out on WhatsApp to schedule your session.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <CheckCircle2 className="h-4 w-4" />
          The demo session is completely free — no commitment required.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ahmed Ali" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Aga Khan School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => field.onChange(g)}
                        className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          field.value === g
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +92 300 1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects (select all that apply)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBJECTS.map((subject) => {
                      const selected = field.value.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => field.onChange(toggleSubject(subject, field.value))}
                          className={`py-3 px-4 rounded-lg border text-sm font-medium text-left transition-all flex items-center gap-2 ${
                            selected
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            selected ? "bg-primary border-primary" : "border-border"
                          }`}>
                            {selected && (
                              <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 10 10">
                                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting..." : "Book My Free Demo"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
