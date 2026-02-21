import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "MIDEEYE Terms of Service — rules and guidelines for using the platform.",
};

const EFFECTIVE_DATE = "1 January 2025";
const CONTACT_EMAIL = "legal@mideeye.com";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-teal">
      <h1>Terms of Service</h1>
      <p className="text-gray-400 text-sm">Effective date: {EFFECTIVE_DATE}</p>

      <p>
        Welcome to MIDEEYE. By creating an account or using our platform, you
        agree to these Terms of Service. Please read them carefully.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using MIDEEYE you confirm that you are at least 13 years
        old (or 16 in the EU/EEA), have legal capacity to enter this agreement,
        and agree to comply with these terms and all applicable laws.
      </p>

      <h2>2. Your Account</h2>
      <ul>
        <li>
          You are responsible for maintaining the confidentiality of your login
          credentials.
        </li>
        <li>
          You are responsible for all activity that occurs under your account.
        </li>
        <li>
          You must provide accurate, current, and complete information during
          registration.
        </li>
        <li>
          You may not create an account on behalf of someone else without
          authorisation.
        </li>
        <li>One account per person. Duplicate accounts may be suspended.</li>
      </ul>

      <h2>3. Content You Post</h2>
      <p>
        You retain ownership of the content you create. By posting content, you
        grant MIDEEYE a worldwide, non-exclusive, royalty-free licence to store,
        display, distribute, and promote your content on the platform.
      </p>
      <p>You must not post content that:</p>
      <ul>
        <li>Is false, misleading, or deliberately deceptive</li>
        <li>Infringes any copyright, trademark, or third-party rights</li>
        <li>Is abusive, threatening, hateful, or discriminatory</li>
        <li>Contains spam, malware, or phishing material</li>
        <li>Violates any applicable law</li>
        <li>Shares private information of others without consent</li>
      </ul>
      <p>
        See our <a href="/guidelines">Community Guidelines</a> for the full
        conduct policy.
      </p>

      <h2>4. Platform Rules</h2>
      <ul>
        <li>
          Do not attempt to scrape, reverse engineer, or overload our systems.
        </li>
        <li>Do not use automated bots to post, vote, or follow.</li>
        <li>Do not impersonate other users or public figures.</li>
        <li>
          Do not use the platform for commercial advertising without our written
          consent.
        </li>
      </ul>

      <h2>5. Moderation & Enforcement</h2>
      <p>
        We reserve the right to remove content, suspend, or permanently ban
        accounts that violate these terms, at our sole discretion. We may act
        without prior notice where required for safety or legal compliance. You
        may appeal moderation decisions by emailing{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The MIDEEYE name, logo, design, and platform code are proprietary to
        MIDEEYE. You may not use them without our written permission.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        MIDEEYE is provided "as is". We make no warranties regarding
        availability, accuracy, or fitness for a particular purpose. Content
        posted by users does not represent our views. We are not responsible for
        the accuracy of user-generated content.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, MIDEEYE shall not be liable for
        indirect, incidental, special, or consequential damages arising from
        your use of the platform. Our maximum liability for any claim shall not
        exceed the greater of $100 or the amount you paid us in the 12 months
        preceding the claim.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may delete your account at any time via Settings. We may suspend or
        terminate your access for violations of these terms. Upon termination,
        your licence to use the platform ends immediately.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these terms. We will give at least 14 days notice for
        material changes via email or in-app notification. Continued use after
        the effective date constitutes acceptance.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These terms are governed by applicable law. Disputes shall be resolved
        through good-faith negotiation first, and thereafter through binding
        arbitration or courts of competent jurisdiction.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
