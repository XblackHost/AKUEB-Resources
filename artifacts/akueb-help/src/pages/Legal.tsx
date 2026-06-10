import { Link } from "wouter";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Legal() {
  const lastUpdated = "June 10, 2026";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-serif text-foreground">Legal Notices, Privacy Policy & Terms of Use</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {lastUpdated}</p>

        <div className="space-y-10 text-foreground">

          {/* Disclaimer of Affiliation */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Disclaimer of Affiliation</h2>
            <p className="text-muted-foreground leading-relaxed">
              This website, <span className="font-medium text-foreground">AKUEB Resources</span>, is an independent, student-run educational platform. It is <span className="font-semibold text-foreground">not affiliated with, endorsed by, sponsored by, or officially connected to</span> the Aga Khan University Examination Board (AKUEB), the Aga Khan University, the Aga Khan Development Network, or any of their subsidiaries, departments, or affiliated institutions in any way.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              All references to "AKUEB" on this platform are used solely for descriptive and informational purposes — to identify the examination board whose curriculum this platform's study materials relate to. No sponsorship or official relationship is implied or should be inferred.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Content Ownership & Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All study materials, notes, past papers, documents, and other content available on this platform — whether uploaded by operators or contributed by users — remain the intellectual property of their <span className="font-medium text-foreground">respective original authors and rights holders</span>. This website does not claim ownership over any third-party content.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Materials shared on this platform are provided in good faith for <span className="font-medium text-foreground">non-commercial, educational purposes only</span>, under the principle of fair use for academic assistance. We do not sell, monetize, or commercially exploit any third-party content hosted here.
            </p>
          </section>

          {/* DMCA / Takedown Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Copyright Complaints & Content Removal</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are the rightful owner of any content hosted on this platform and believe it infringes upon your copyright or intellectual property rights, you may request its removal by contacting the site operators directly. We take such requests seriously and will act promptly to remove any infringing material upon receiving a valid, good-faith notice that includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-1 ml-2">
              <li>Identification of the copyrighted work you claim has been infringed</li>
              <li>A direct link or description of the material on this site</li>
              <li>Your contact information (name and email)</li>
              <li>A statement that you are the rights holder or are authorised to act on their behalf</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We reserve the right to remove content at our sole discretion at any time without prior notice.
            </p>
          </section>

          {/* No Warranties */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Accuracy of Content & No Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we make every reasonable effort to ensure the accuracy and relevance of the materials shared on this platform, we do not guarantee that any content is error-free, up to date, or officially verified. Study materials are provided <span className="font-medium text-foreground">"as is"</span>, without any warranty of completeness, accuracy, fitness for a particular purpose, or academic adequacy.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Students are advised to cross-check materials against official AKUEB publications and to use this platform as a supplementary resource, not as a replacement for official textbooks or guidance from their teachers.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. User Accounts & Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account on this platform, you agree to provide accurate registration information and to use the platform solely for personal, non-commercial, educational purposes. You must not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-1 ml-2">
              <li>Upload unlawful, harmful, or intentionally misleading content</li>
              <li>Attempt to gain unauthorised access to any part of the platform</li>
              <li>Use the platform to distribute spam or malicious materials</li>
              <li>Reproduce or redistribute content from this platform for commercial purposes</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We reserve the right to suspend or terminate any account that violates these terms without prior notice.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Privacy & Data Collection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect minimal personal information — specifically your name and email address when you register — solely for the purpose of managing your account and enabling access to the platform. We do not sell, trade, or share your personal data with third parties.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Your display preferences (such as dark mode) are stored locally in your browser and never transmitted to our servers. You may request deletion of your account and associated data at any time by contacting the site operators.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by applicable law, the operators of AKUEB Resources shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or inability to use this platform or its contents, including but not limited to academic performance outcomes, data loss, or reliance on any material found here.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update or modify these legal notices at any time. Changes will be reflected by updating the "Last updated" date at the top of this page. Continued use of the platform after any changes constitutes your acceptance of the revised terms.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>AKUEB Resources — an independent student resource platform.</p>
          <p className="mt-1">Not affiliated with AKUEB or any of its related organisations.</p>
        </div>
      </div>
    </div>
  );
}
