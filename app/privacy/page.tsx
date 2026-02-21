import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MIDEEYE Privacy Policy — how we collect, use, and protect your data.",
};

const EFFECTIVE_DATE = "1 January 2025";
const CONTACT_EMAIL = "privacy@mideeye.com";
const COMPANY_NAME = "MIDEEYE";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-teal">
      <h1>Privacy Policy</h1>
      <p className="text-gray-400 text-sm">Effective date: {EFFECTIVE_DATE}</p>

      <p>
        {COMPANY_NAME} ("we", "our", or "us") is committed to protecting your
        personal data. This Privacy Policy explains how we collect, use, store,
        and share information about you when you use our platform at{" "}
        <strong>mideeye.com</strong>.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Account data:</strong> name, email address, profile photo, bio
        </li>
        <li>
          <strong>Content:</strong> questions, answers, comments, showcase posts
        </li>
        <li>
          <strong>Communications:</strong> direct messages between users
        </li>
        <li>
          <strong>Settings:</strong> notification preferences, theme
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>IP address and approximate location (country/city level)</li>
        <li>Device type, browser, operating system</li>
        <li>Pages visited, features used, time spent</li>
        <li>Cookies and local storage identifiers (see Cookie Policy)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide, maintain and improve the platform</li>
        <li>Authenticate your account and keep it secure</li>
        <li>Send transactional emails (password reset, verification)</li>
        <li>
          Send notifications about activity on your content (with your consent)
        </li>
        <li>Detect and prevent abuse, spam, and violations</li>
        <li>Comply with legal obligations</li>
        <li>Generate aggregated, anonymous analytics</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your personal data to third parties.
      </p>

      <h2>3. Legal Basis for Processing (GDPR)</h2>
      <ul>
        <li>
          <strong>Contract:</strong> processing necessary to provide the service
          you signed up for
        </li>
        <li>
          <strong>Legitimate interests:</strong> security monitoring, fraud
          prevention, analytics
        </li>
        <li>
          <strong>Consent:</strong> marketing emails, optional cookies, push
          notifications
        </li>
        <li>
          <strong>Legal obligation:</strong> compliance with applicable law
        </li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>We share data only with:</p>
      <ul>
        <li>
          <strong>Supabase Inc.</strong> — our database and authentication
          provider (EU data residency available)
        </li>
        <li>
          <strong>Vercel Inc.</strong> — our hosting provider
        </li>
        <li>
          <strong>Email provider</strong> — transactional email delivery only
        </li>
        <li>
          <strong>Law enforcement</strong> — when legally required with a valid
          request
        </li>
      </ul>
      <p>
        All processors are bound by data processing agreements and GDPR
        safeguards.
      </p>

      <h2>5. Data Retention</h2>
      <ul>
        <li>
          <strong>Active accounts:</strong> data retained while account is
          active
        </li>
        <li>
          <strong>Deleted accounts:</strong> personal data removed within 30
          days; anonymised content may remain
        </li>
        <li>
          <strong>Logs:</strong> server logs retained for 90 days
        </li>
        <li>
          <strong>Backups:</strong> purged within 60 days of deletion request
        </li>
      </ul>

      <h2>6. Your Rights (GDPR &amp; applicable law)</h2>
      <ul>
        <li>
          <strong>Access:</strong> request a copy of your personal data
        </li>
        <li>
          <strong>Rectification:</strong> correct inaccurate data
        </li>
        <li>
          <strong>Erasure:</strong> request deletion of your account and data
        </li>
        <li>
          <strong>Portability:</strong> receive your data in machine-readable
          format
        </li>
        <li>
          <strong>Restriction:</strong> limit how we process your data
        </li>
        <li>
          <strong>Objection:</strong> object to processing based on legitimate
          interests
        </li>
        <li>
          <strong>Withdraw consent:</strong> at any time for consent-based
          processing
        </li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond
        within 30 days.
      </p>

      <h2>7. Account Deletion</h2>
      <p>
        You can delete your account at any time from{" "}
        <strong>Settings → Account → Delete Account</strong>. All personal
        information will be permanently removed within 30 days. Public content
        (questions and answers) may be retained in anonymised form to preserve
        community knowledge.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use essential cookies for authentication and optional analytics
        cookies. See our <a href="/cookies">Cookie Policy</a> for full details.
      </p>

      <h2>9. Children</h2>
      <p>
        MIDEEYE is not directed at children under 13 (or 16 in the EU/EEA). We
        do not knowingly collect data from minors. If you believe a minor has
        created an account, contact us immediately.
      </p>

      <h2>10. International Transfers</h2>
      <p>
        Your data may be transferred to and processed in countries outside your
        own, including the United States. We ensure appropriate safeguards
        (Standard Contractual Clauses) are in place for all such transfers.
      </p>

      <h2>11. Security</h2>
      <p>
        We use industry-standard measures including HTTPS/TLS encryption, Row
        Level Security on our database, hashed passwords via Supabase Auth, and
        regular security reviews. No method of transmission is 100% secure; we
        cannot guarantee absolute security.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this policy. Material changes will be notified via email
        or in-app banner at least 7 days before taking effect.
      </p>

      <h2>13. Contact &amp; Jurisdiction</h2>
      <p>
        <strong>Data Controller:</strong> {COMPANY_NAME}
        <br />
        <strong>Email:</strong>{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <br />
        <strong>Governing Law:</strong> This policy is governed by applicable
        data protection law. EU/EEA residents may lodge complaints with their
        local supervisory authority.
      </p>
    </div>
  );
}
