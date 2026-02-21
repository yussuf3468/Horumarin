import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with MIDEEYE — FAQs, bug reports, and contact options.",
};

const faqs = [
  {
    q: "How do I create an account?",
    a: 'Click "Sign Up" on the home page. Enter your name, email, and a secure password. Verify your email, then you\'re ready.',
  },
  {
    q: "How do I reset my password?",
    a: 'Go to the login page and click "Forgot password?". Enter your email and we\'ll send a reset link within a few minutes.',
  },
  {
    q: "How do I ask a question?",
    a: 'Tap the + button in the navigation bar or visit /ask. Write your question clearly, choose a relevant topic, and post.',
  },
  {
    q: "Why was my content removed?",
    a: "Content may be removed for violating our Community Guidelines. You would have received a notification. You can appeal by emailing appeals@mideeye.com.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings → Account → Delete Account. This is permanent and will remove all your personal data within 30 days.",
  },
  {
    q: "How do I report a user or post?",
    a: "Use the flag icon (⚑) on any post, answer, or profile. Our moderation team reviews all reports.",
  },
  {
    q: "The app isn't loading — what do I do?",
    a: "Try refreshing the page. If the issue persists, clear your browser cache or try a different browser. You can also check our status page.",
  },
  {
    q: "How do I add MIDEEYE to my phone's home screen?",
    a: 'On iOS: open Safari, tap the Share button (□↑), then "Add to Home Screen". On Android: tap the browser menu (⋮) and select "Add to Home Screen" or "Install App".',
  },
  {
    q: "Is MIDEEYE free to use?",
    a: "Yes. MIDEEYE is free for all users. We may introduce optional premium features in the future.",
  },
  {
    q: "How do I change my profile photo?",
    a: "Go to Settings → Profile, then tap your current photo to upload a new one.",
  },
];

const helpCategories = [
  {
    icon: "👤",
    title: "Account & Profile",
    items: ["Sign up & login", "Password reset", "Profile settings", "Account deletion"],
  },
  {
    icon: "✍️",
    title: "Content & Questions",
    items: ["Asking questions", "Writing answers", "Uploading images", "Editing posts"],
  },
  {
    icon: "🔔",
    title: "Notifications",
    items: ["Email notifications", "Push notifications", "Notification settings", "Unsubscribe"],
  },
  {
    icon: "🛡️",
    title: "Safety & Reporting",
    items: ["Reporting content", "Blocking users", "Privacy controls", "Appeals process"],
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-3">How can we help?</h1>
        <p className="text-gray-400">
          Find answers below or reach out to our team.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <a
          href="mailto:support@mideeye.com"
          className="block p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-teal-500 transition-colors"
        >
          <div className="text-2xl mb-2">✉️</div>
          <h3 className="font-semibold text-white mb-1">Email Support</h3>
          <p className="text-sm text-gray-400">support@mideeye.com</p>
          <p className="text-xs text-gray-500 mt-1">Response within 48 hours</p>
        </a>
        <a
          href="mailto:appeals@mideeye.com"
          className="block p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-teal-500 transition-colors"
        >
          <div className="text-2xl mb-2">⚖️</div>
          <h3 className="font-semibold text-white mb-1">Moderation Appeals</h3>
          <p className="text-sm text-gray-400">appeals@mideeye.com</p>
          <p className="text-xs text-gray-500 mt-1">Response within 7 business days</p>
        </a>
        <a
          href="mailto:legal@mideeye.com"
          className="block p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-teal-500 transition-colors"
        >
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-white mb-1">Legal & Privacy</h3>
          <p className="text-sm text-gray-400">legal@mideeye.com</p>
          <p className="text-xs text-gray-500 mt-1">GDPR requests, legal notices</p>
        </a>
      </div>

      {/* Help categories */}
      <h2 className="text-xl font-bold text-white mb-4">Help Topics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {helpCategories.map((cat) => (
          <div
            key={cat.title}
            className="p-4 rounded-xl bg-gray-900 border border-gray-800"
          >
            <div className="text-xl mb-2">{cat.icon}</div>
            <h3 className="font-semibold text-white text-sm mb-2">{cat.title}</h3>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li key={item} className="text-xs text-gray-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4 mb-12">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl bg-gray-900 border border-gray-800 overflow-hidden"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer text-white font-medium list-none">
              {faq.q}
              <span className="ml-4 text-teal-400 transition-transform group-open:rotate-180 flex-shrink-0">
                ▾
              </span>
            </summary>
            <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* Legal links */}
      <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500 space-x-4">
        <Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
        <Link href="/guidelines" className="hover:text-teal-400 transition-colors">Community Guidelines</Link>
        <Link href="/cookies" className="hover:text-teal-400 transition-colors">Cookie Policy</Link>
      </div>
    </div>
  );
}
