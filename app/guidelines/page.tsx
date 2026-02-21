import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "MIDEEYE Community Guidelines — how to contribute positively to our Somali knowledge community.",
};

export default function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-teal">
      <h1>Community Guidelines</h1>
      <p className="text-gray-500 text-sm">Last updated: January 2025</p>

      <p>
        MIDEEYE is a knowledge community built on respect, curiosity, and
        collective growth. These guidelines exist to keep it that way for
        everyone.
      </p>

      <h2>Our Core Values</h2>
      <ul>
        <li>
          <strong>Curiosity:</strong> questions of all levels are welcome
        </li>
        <li>
          <strong>Respect:</strong> disagree with ideas, not people
        </li>
        <li>
          <strong>Accuracy:</strong> share what you know; be honest about what
          you don't
        </li>
        <li>
          <strong>Inclusion:</strong> everyone belongs regardless of background
          or viewpoint
        </li>
      </ul>

      <h2>✅ Do</h2>
      <ul>
        <li>Ask genuine questions and give well-thought-out answers</li>
        <li>Credit sources when sharing knowledge</li>
        <li>
          Use the vote system to surface quality content, not to punish people
          you disagree with
        </li>
        <li>
          Report content that violates these guidelines using the report button
        </li>
        <li>Communicate in Somali, English, or Arabic — all are welcome</li>
      </ul>

      <h2>🚫 Don't</h2>
      <h3>Harmful Content</h3>
      <ul>
        <li>
          Threats, incitement to violence, or calls for harm against any person
          or group
        </li>
        <li>Content that promotes terrorism or extremist ideologies</li>
        <li>Self-harm or suicide encouragement</li>
      </ul>
      <h3>Harassment &amp; Hate</h3>
      <ul>
        <li>Personal attacks, insults, or targeted harassment</li>
        <li>
          Discrimination based on clan, ethnicity, religion, gender, age, or
          disability
        </li>
        <li>Doxxing (sharing someone's private information without consent)</li>
      </ul>
      <h3>Misinformation</h3>
      <ul>
        <li>
          Deliberately spreading false information, especially about health or
          current events
        </li>
        <li>Manipulating screenshots or misrepresenting sources</li>
      </ul>
      <h3>Spam &amp; Manipulation</h3>
      <ul>
        <li>Repetitive or off-topic posting</li>
        <li>
          Vote manipulation, fake engagement, or coordinated inauthentic
          behaviour
        </li>
        <li>Commercial advertising without authorisation</li>
      </ul>
      <h3>Illegal Content</h3>
      <ul>
        <li>Copyright infringement</li>
        <li>Content illegal in Somalia, the EU, or the United States</li>
        <li>Any content involving the exploitation of minors</li>
      </ul>

      <h2>Reporting &amp; Enforcement</h2>
      <p>
        Use the flag/report button on any post, answer, or profile. Our
        moderation team reviews reports and may take actions including content
        removal, warning, temporary suspension, or permanent ban depending on
        severity and pattern.
      </p>
      <p>
        Repeated minor violations are treated cumulatively. Single severe
        violations (violence, CSAM, terrorism) result in immediate and permanent
        removal.
      </p>

      <h2>Appeals</h2>
      <p>
        If you believe a moderation decision was made in error, email{" "}
        <a href="mailto:appeals@mideeye.com">appeals@mideeye.com</a> within 14
        days with a brief explanation. We aim to respond within 7 business days.
      </p>

      <h2>A Note on Our Community</h2>
      <p>
        MIDEEYE is built for the Somali-speaking world and its diaspora — a
        community with rich history, diverse opinions, and incredible potential.
        These guidelines are not about silencing debate; they are about ensuring
        every member can participate safely and with dignity.
      </p>
      <p>Nabad iyo caano.</p>
    </div>
  );
}
