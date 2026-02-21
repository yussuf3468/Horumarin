import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "MIDEEYE Cookie Policy — how and why we use cookies.",
};

const EFFECTIVE_DATE = "1 January 2025";
const CONTACT_EMAIL  = "privacy@mideeye.com";

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-teal">
      <h1>Cookie Policy</h1>
      <p className="text-gray-400 text-sm">Effective date: {EFFECTIVE_DATE}</p>

      <p>
        This Cookie Policy explains what cookies are, which ones we use on MIDEEYE, and how
        you can control them.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored in your browser when you visit a website.
        They help websites remember information about your visit — such as your login session
        or preferences — so you don't have to re-enter them each time.
      </p>

      <h2>2. Cookies We Use</h2>

      <h3>Essential Cookies (always active)</h3>
      <p>
        These are required for the platform to work. Without them, features like login,
        security, and account settings cannot function.
      </p>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>sb-access-token</code></td>
            <td>Supabase authentication session token</td>
            <td>Session / 1 hour</td>
          </tr>
          <tr>
            <td><code>sb-refresh-token</code></td>
            <td>Keeps you logged in across browser sessions</td>
            <td>60 days</td>
          </tr>
          <tr>
            <td><code>mideeye-theme</code></td>
            <td>Remembers your dark/light mode preference</td>
            <td>1 year</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytics Cookies (optional, with consent)</h3>
      <p>
        If you consent, we collect anonymous data on how users navigate the platform to
        improve the experience. No personally identifiable information is linked to these.
      </p>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_mid_analytics</code></td>
            <td>Anonymous page view and feature usage tracking</td>
            <td>90 days</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Local Storage &amp; Service Worker</h2>
      <p>
        We also use <strong>localStorage</strong> to store your session and UI state, and a
        <strong> service worker</strong> that caches app shell files for offline use. These
        are technically not cookies but serve similar purposes. They are essential for app
        performance and cannot be disabled without breaking core functionality.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>
        We use <strong>Supabase</strong> for authentication. Their cookies are set on our
        domain and governed by our data processing agreement with them. We do not embed
        third-party advertising cookies.
      </p>

      <h2>5. Your Choices</h2>
      <ul>
        <li>
          <strong>Browser settings:</strong> You can block or delete cookies via your browser
          settings. Note that blocking essential cookies will prevent login.
        </li>
        <li>
          <strong>Opt-out of analytics:</strong> Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to opt out of any
          analytics tracking.
        </li>
        <li>
          <strong>Clear service worker cache:</strong> In your browser DevTools → Application
          → Storage → Clear storage.
        </li>
      </ul>

      <h2>6. Changes</h2>
      <p>
        We may update this policy as our technology changes. Check back periodically or watch
        for in-app notifications about material updates.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
