import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle2, GraduationCap, Star, Users, BookMarked } from "lucide-react";
import zulfiplexLogo from "../assets/zulfiplex-logo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-[100%] blur-3xl -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              <span>Made by students, for students</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1]">
              Your quiet corner for <br />
              <span className="text-primary italic">AKUEB studies.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              A clean, dependable digital library of notes, past papers, and study materials for Classes 9–12 following the Aga Khan University Examination Board curriculum.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/classes">
                <Button size="lg" className="h-14 px-8 text-base rounded-full w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
                  Select Your Class
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/admission">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-semibold">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Book a Free Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Ad Slot */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div 
          id="ad-top" 
          className="w-full max-w-[728px] h-[90px] bg-muted border border-border/50 rounded-lg flex items-center justify-center text-muted-foreground/50 text-xs font-medium uppercase tracking-widest relative overflow-hidden"
        >
          <span className="relative z-10">Advertisement</span>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif">A community-driven study resource.</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We know the anxiety of opening your books the night before an exam. This platform was built to organize the chaos. No unnecessary distractions, just the materials you need to succeed.
              </p>
              
              <ul className="space-y-4 pt-4">
                {[
                  "100% free and non-profit",
                  "Specifically curated for AKUEB",
                  "Notes, past papers, and MCQs",
                  "Clean, distraction-free reading"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-muted rounded-2xl p-8 aspect-square flex items-center justify-center relative border border-border/50 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl"></div>
              <div className="w-48 h-64 bg-card rounded-xl shadow-lg border border-border/50 rotate-[-6deg] absolute left-12 flex flex-col p-4 z-10">
                <div className="w-1/2 h-2 bg-muted rounded-full mb-4"></div>
                <div className="w-full h-2 bg-muted rounded-full mb-2"></div>
                <div className="w-5/6 h-2 bg-muted rounded-full mb-2"></div>
                <div className="w-full h-2 bg-muted rounded-full mb-8"></div>
                <div className="mt-auto w-full h-24 bg-accent/50 rounded-lg"></div>
              </div>
              <div className="w-48 h-64 bg-card rounded-xl shadow-lg border border-border/50 rotate-[4deg] absolute right-12 flex flex-col p-4 z-20">
                <div className="w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="w-full h-2 bg-muted rounded-full mb-2"></div>
                <div className="w-4/5 h-2 bg-muted rounded-full mb-2"></div>
                <div className="w-full h-2 bg-muted rounded-full mb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academy / Admission Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 -z-10" />
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            {/* Zulfiplex Academy logo + name */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src={zulfiplexLogo}
                alt="Zulfiplex Academy"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/15 shadow-md"
              />
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Presented by</p>
                <p className="text-xl font-serif font-semibold text-foreground">Zulfiplex Academy</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <GraduationCap className="h-4 w-4" />
              <span>Now enrolling — limited spots</span>
            </div>
            <h2 className="text-4xl font-serif text-foreground mb-4">
              Learn directly from <span className="text-primary italic">specialized teachers.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Beyond the free study resources, we offer personalized academy classes for AKUEB students taught by experienced, subject-specialized instructors who know the exam inside out.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Star className="h-6 w-6 text-primary" />,
                title: "Subject Specialists",
                desc: "Each subject — Mathematics, Biology, Physics, Chemistry — is taught by a dedicated expert, not a general tutor.",
              },
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: "Small Batch Sizes",
                desc: "Limited students per batch so every student gets personal attention and their questions answered every session.",
              },
              {
                icon: <BookMarked className="h-6 w-6 text-primary" />,
                title: "AKUEB-Focused",
                desc: "All teaching is tailored to the AKUEB exam pattern — past papers, MCQs, and marking scheme strategies included.",
              },
            ].map((card, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="bg-primary/10 w-11 h-11 rounded-xl flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-foreground">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-primary/20 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Start with zero risk</p>
            <h3 className="text-2xl font-serif text-foreground mb-3">Your first demo class is completely free.</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Attend a full demo session with no payment or commitment required. Only continue if you feel it's the right fit for you.
            </p>
            <Link href="/admission">
              <Button size="lg" className="rounded-full px-10 shadow-md text-base font-semibold">
                <GraduationCap className="mr-2 h-5 w-5" />
                Book My Free Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center px-4 border-t border-border">
        <h2 className="text-3xl font-serif mb-6">Ready to start studying?</h2>
        <Link href="/classes">
          <Button size="lg" className="rounded-full shadow-md">
            Browse Materials
          </Button>
        </Link>
      </section>
    </div>
  );
}
