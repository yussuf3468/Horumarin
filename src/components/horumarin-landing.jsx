import React, { useState, useEffect } from "react";

function Glossary({ title, meaning, children }) {
  const id = `gloss-${String(title).replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <span
      className="group relative inline-block cursor-help"
      tabIndex={0}
      aria-describedby={id}
    >
      <span className="underline decoration-dotted underline-offset-2">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block group-focus:block w-64 bg-stone-900 text-white text-sm p-3 rounded-md shadow-lg text-left"
      >
        <strong className="font-semibold block">{title}</strong>
        <span className="block mt-1">{meaning}</span>
      </span>
    </span>
  );
}

export default function HorumarinLanding() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNotify = (e) => {
    e.preventDefault();
    alert("Mahadsanid! Waanu kuu soo diri doonaa warka marka aan furno.");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* SEO Meta */}
      <title>Horumarin - Aqoonta Soomaaliyeed Hal Meel</title>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Sophisticated layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50" />

        {/* Ambient light effect - top left */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"
          style={{ animation: "pulse 8s ease-in-out infinite" }}
        />

        {/* Ambient light effect - bottom right */}
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl"
          style={{ animation: "pulse 10s ease-in-out infinite 2s" }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(120, 53, 15, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120, 53, 15, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Main content container */}
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Content */}
            <div
              className={`space-y-6 sm:space-y-8 transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-full border border-amber-500/20">
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-amber-900">
                  Dhawaan Ayaan Furaynaa
                </span>
              </div>

              {/* Main headline with visual hierarchy */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  <span className="block text-stone-900 leading-[0.9]">
                    Horumarin
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 leading-[0.9] mt-1 sm:mt-2">
                    .
                  </span>
                </h1>

                {/* Subheadline with emphasis */}
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-stone-700 leading-tight max-w-xl">
                  Meesha Aqoonta iyo{" "}
                  <Glossary
                    title="Khubrada / Khubaro"
                    meaning="Khubrad / Khubaro = khabiir/in khubrad leh (expert)."
                  >
                    Khubrada
                  </Glossary>{" "}
                  Soomaaliyeed ay ku midoobaan
                </p>
              </div>

              {/* Supporting copy */}
              <p className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-xl">
                Goob cusub oo aad ka hesho jawaabo la hubo,{" "}
                <Glossary
                  title="Hagayaal"
                  meaning="Hagayaal = dad wax ku hanuuniya / tilmaama / tusaale noqda (mentors, guides)"
                >
                  hagayaal
                </Glossary>{" "}
                aad aaminto, iyo aqoon ku anfaceeso mustaqbalka.
              </p>

              {/* CTA buttons with premium styling */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("notify-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="group relative px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-2xl font-semibold text-base sm:text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    Nala Soco
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("vision-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="group px-6 py-3.5 sm:px-8 sm:py-4 bg-white/60 backdrop-blur-md text-stone-800 rounded-2xl font-semibold text-base sm:text-lg border-2 border-stone-200 hover:border-amber-300 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    Baro Aragtida
                    <svg
                      className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Trust indicators */}
              <div
                className={`flex flex-wrap items-center gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-stone-200/50 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-stone-600 font-medium">
                    Ku biir bulshada
                  </span>
                </div>

                <div className="flex items-center gap-2 text-stone-600">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">
                    Tayo sare
                  </span>
                </div>

                <div className="flex items-center gap-2 text-stone-600">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">
                    Aqoon la hubo
                  </span>
                </div>
              </div>
            </div>

            {/* Right column - Visual element */}
            <div
              className={`relative hidden lg:block transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
            >
              <div className="relative">
                {/* Decorative card stack representing knowledge base */}
                <div className="relative h-[600px]">
                  {/* Card 1 - Background */}
                  <div className="absolute top-12 right-12 w-80 h-96 bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl shadow-xl transform rotate-6 opacity-50" />

                  {/* Card 2 - Middle */}
                  <div className="absolute top-6 right-6 w-80 h-96 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl transform rotate-3 border border-amber-200/30">
                    <div className="p-8 space-y-6">
                      <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-stone-300/50 rounded-full w-3/4" />
                        <div className="h-3 bg-stone-300/30 rounded-full w-full" />
                        <div className="h-3 bg-stone-300/30 rounded-full w-5/6" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Front (featured card) */}
                  <div className="absolute top-0 right-0 w-80 h-96 bg-white rounded-3xl shadow-2xl border border-stone-200/50 backdrop-blur-sm hover:scale-105 transition-transform duration-500">
                    <div className="p-8 space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="px-3 py-1 bg-green-100 rounded-full">
                          <span className="text-xs font-semibold text-green-700">
                            La Hubo
                          </span>
                        </div>
                      </div>

                      {/* Question simulation */}
                      <div className="space-y-3">
                        <div className="h-4 bg-gradient-to-r from-stone-900 to-stone-700 rounded-full w-full" />
                        <div className="h-4 bg-gradient-to-r from-stone-900 to-stone-700 rounded-full w-4/5" />
                        <div className="h-4 bg-gradient-to-r from-stone-900 to-stone-700 rounded-full w-3/5" />
                      </div>

                      {/* Answer preview */}
                      <div className="pt-4 space-y-2 border-t border-stone-200">
                        <div className="h-2 bg-stone-300 rounded-full w-full" />
                        <div className="h-2 bg-stone-300 rounded-full w-5/6" />
                        <div className="h-2 bg-stone-300 rounded-full w-4/6" />
                        <div className="h-2 bg-stone-300 rounded-full w-full" />
                        <div className="h-2 bg-stone-300 rounded-full w-3/4" />
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                          <div className="space-y-1">
                            <div className="h-2 bg-stone-300 rounded w-16" />
                            <div className="h-1.5 bg-stone-200 rounded w-12" />
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-amber-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating accent elements */}
                  <div
                    className="absolute -top-6 left-12 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg opacity-80 animate-bounce"
                    style={{ animationDuration: "3s" }}
                  />
                  <div
                    className="absolute bottom-12 -left-6 w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg opacity-60"
                    style={{ animation: "pulse 4s ease-in-out infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Horumarin Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
              Waa Maxay Horumarin?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full" />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-stone-700 leading-relaxed mb-6">
              Horumarin waa goob digitaal oo loogu talagalay dadka Soomaaliyeed,
              halkaas oo ay ku helaan jawaabo sax ah, khubaro la aaminsan karo,
              iyo aqoon waxtar leh.
            </p>
            <p className="text-xl text-stone-700 leading-relaxed mb-6">
              Waxaan rumaysan nahay in aqoontu tahay furaha horumar, in
              khubraduna tahay nuurka haga jidka, iyo in midnimadu tahay awooda
              wax walba suurto galisa.
            </p>
            <p className="text-xl text-stone-700 leading-relaxed">
              Halkan, dhalinyaradu way heli doonaan dad ay ka barto oo ay aamini
              karaan. Bulshada oo dhan waxay dhisi doontaa aqoon dhab ah oo aan
              ku salaysnayn been iyo warar khaldan.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
              Dhibaatada Jirta
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-red-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Macluumaad Been ah
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Waxaa jira macluumaad badan oo aan la garanin kuwa runta ah iyo
                kuwa beenta ah. Taasi waxay kelisaa dadka.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-orange-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Aqoon Kala Firdhisan
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Aqoonta ayaa ku firdhisan Facebook, YouTube, iyo meelo kale.
                Marka aad u baahato, ma heli kartid fudud.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Dhalinyaro La'aan Hagid
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Dhalinyaradu ma helaan meel ay ka sugaan talo iyo hagid dad
                khibrad leh oo ay aamini karaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section
        id="vision-section"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
              Xalka Aan Dhisayno
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-700 mx-auto rounded-full" />
            <p className="text-xl text-stone-600 mt-6 max-w-3xl mx-auto">
              Horumarin waxay leedahay hab casri ah oo lagu hubiyo in aqoontu
              tahay mid sax ah oo ay bixiyaan dad khibrad leh.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                <Glossary
                  title="Khubaro"
                  meaning="Khubaro = experts; dadka leh xirfad iyo aqoon la hubo"
                >
                  Khubaro
                </Glossary>{" "}
                La Hubo
              </h3>
              <p className="text-stone-700">
                Kaliya dad khibrad la hubo ayaa jawaabin kara su'aalaha, si loo
                hubiyo in macluumaadku yahay mid sax ah.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-teal-700 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Qaybaha Kala Duwan
              </h3>
              <p className="text-stone-700">
                Waxbarasho, Caafimaad, Ganacsi, Diinta, Tiknoolaji, Dhaqan, iyo
                Nolosha Dibadda.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Hab Doorasho
              </h3>
              <p className="text-stone-700">
                Dadku way doorataan jawaabaha ugu wanaagsan iyagoo cod siinaya,
                si jawaabaha fiican u soo baxaan.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Sumcad iyo Darajada
              </h3>
              <p className="text-stone-700">
                Khubaro fiican ayaa hela sumcad sare iyagoo bixiya jawaabo tayo
                leh, taasoo siisa sharaf iyo qadarin.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Kaydka Aqoonta
              </h3>
              <p className="text-stone-700">
                Maktabad weyn oo aqoon ah oo soo kordhaysa oo qof kastaa uu ka
                faa'iidaysan karo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-700 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Bulshada Wada Dhisan
              </h3>
              <p className="text-stone-700">
                Qof kastaa ayaa gacan ka geysan kara dhismaha kaydkan aqoonta,
                si wada jir ah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
              Sidee Ayay u Shaqaysaa?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full" />
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex-shrink-0 w-16 h-16 bg-amber-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  Weydii Su'aal
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Qor su'aashaada - wax kastoo aad rabto oo ku saabsan
                  waxbarasho, caafimaad, ganacsi, diinta, tiknoolaji, ama
                  nolosha guud.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  Hel Jawaabo La Hubo
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Khubaro la hubo ayaa bixin doona jawaabo ku salaysan khibrad
                  iyo aqoon dhab ah. Dadku way doorataan jawaabaha ugu fiican.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  Dhis Sumcad
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Haddii aad bixiso jawaabo wanaagsan, sumcaddaadu way kordhi
                  doontaa, oo waxaad noqon doontaa qof dadku ay aamini karaan.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  Noqo Qof Saameyn Leh
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Aqoontaada ayaa caawini doonta dadka kale, waad saameyn
                  doontaa bulshada, oo waxaad ka qayb qaadan doontaa dhismaha
                  mustaqbalka.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Long Term Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Himilada Mustaqbalka
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full" />
            <p className="text-xl text-stone-300 mt-6 max-w-3xl mx-auto">
              Waxaan ku dadaalaynaa inaan dhisno meel ka mid ah mustaqbalka
              bulshada Soomaaliyeed oo dhan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Kaydka Aqoonta Ugu Weyn
              </h3>
              <p className="text-stone-300 leading-relaxed">
                Inuu noqdo kaydka aqoonta Soomaaliyeed ee ugu weyn adduunka,
                halkaas oo qof kastaa uu wax walba ka heli karo.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Xiriir Shaqo iyo Fursado
              </h3>
              <p className="text-stone-300 leading-relaxed">
                Meel ay dhalinyaradu ka helaan hagayaal iyo fursado shaqo,
                iyagoo la xiriiraya dad khibrad leh.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Koorsooyin Waxbarasho</h3>
              <p className="text-stone-300 leading-relaxed">
                Koorsooyin waxbarasho oo Af-Soomaaliga ah, oo laga barto xirfado
                cusub, tiknoolaji, iyo cilmiga.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                App Mobileka Mustaqbalka
              </h3>
              <p className="text-stone-300 leading-relaxed">
                App mobile oo casri ah oo aad meel kastaa ka heli kartid aqoonta
                aad u baahato, si fudud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
                DhiriGalin & Horumarin
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full" />
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    <Glossary
                      title="DhiriGalin"
                      meaning="DhiriGalin = dhiirrigelin; kicinta riyada iyo himilada (encouragement / inspiration)"
                    >
                      DhiriGalin
                    </Glossary>
                  </h3>
                  <p className="text-lg text-stone-600">
                    Waxay kicisaa riyada iyo himilada.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-4xl text-stone-400">+</div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    Horumarin
                  </h3>
                  <p className="text-lg text-stone-600">
                    Waxay dhistaa jidka iyo aqoonta.
                  </p>
                </div>
              </div>

              <div className="mt-12 p-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
                <p className="text-xl text-center text-stone-800 font-medium leading-relaxed">
                  <span className="text-indigo-700 font-bold">DhiriGalin</span>{" "}
                  waxay kicisaa riyada.
                  <br />
                  <span className="text-purple-700 font-bold">
                    Horumarin
                  </span>{" "}
                  waxay dhistaa jidka.
                  <br />
                  <span className="text-stone-900 font-bold mt-4 block">
                    Labaduba waa horumarinta bulshada.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="notify-section"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-orange-700"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Weydii. Wadaag. Horumar.
          </h2>
          <p className="text-xl sm:text-2xl text-amber-100 mb-12 max-w-2xl mx-auto">
            Ku biir bulshada dhisaysa mustaqbalka cusub ee aqoonta Soomaaliyeed.
          </p>

          <form onSubmit={handleNotify} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Emailkaaga halkan geli"
                required
                className="flex-1 px-6 py-4 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-amber-800 rounded-xl font-semibold text-lg hover:bg-amber-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Nala Soco
              </button>
            </div>
          </form>

          <p className="text-amber-100 mt-6 text-sm">
            Waanu kuu soo diri doonaa warka marka aan furno Horumarin
          </p>
        </div>
      </section>

      {/* Footer */}
       <footer className="bg-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Column 1 - Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Horumarin</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Aqoonta Soomaaliyeed hal meel.
              </p>
              <div className="flex items-center gap-2 text-stone-400 text-sm pt-2">
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>by</span>
                <a
                  href="https://lenzro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                >
                  Lenzro
                </a>
              </div>
            </div>
            
            {/* Column 2 - Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Xiriirka
              </h4>
              <div className="space-y-2">
                <p className="text-stone-400 text-sm">
                  <a
                    href="tel:+254722261776"
                    className="hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +254 722 261 776
                  </a>
                </p>
                <p className="text-stone-400 text-sm">
                  <a
                    href="mailto:team@lenzro.com"
                    className="hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    team@lenzro.com
                  </a>
                </p>
              </div>
            </div>
            
            {/* Column 3 - Coming Soon Message */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Dhawaan Ayaan Furayno
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Ku soo biir bulshada Soomaaliyeed ee dhisaysa mustaqbalka aqoonta. Waanu kuu soo diri doonaa warka marka aan bilaabno.
              </p>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-stone-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-400 text-sm">
                © 2026 Horumarin — Xuquuqda Loo Haystay
              </p>
              
              {/* Social links placeholder */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
