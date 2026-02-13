import React, { useState, useEffect } from 'react';

export default function HorumarinLanding() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNotify = (e) => {
    e.preventDefault();
    alert('Mahadsanid! Waanu kuu soo diri doonaa warka marka aan furno.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* SEO Meta */}
      <title>Horumarin - Aqoonta Soomaaliyeed Hal Meel</title>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-orange-100/20 to-stone-100/30" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180, 83, 9, 0.06) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className={`relative max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block px-4 py-2 bg-amber-100/70 backdrop-blur-sm rounded-full text-amber-900 font-medium text-sm mb-6 border border-amber-200/60">
            Dhawaan Ayaan Furayno
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 mb-6 leading-tight">
            Horumarin
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-stone-700 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
            Meesha Aqoonta iyo Khibradaha Soomaaliyeed ay ku midoobaan
          </p>
          
          <p className="text-lg sm:text-xl text-stone-600 mb-12 max-w-2xl mx-auto">
            Goob cusub oo aad ka hesho jawaabo la hubo, hagayaal aad aaminto, iyo aqoon ku taraynaysa mustaqbalka.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('notify-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-amber-700 text-white rounded-xl font-semibold text-lg hover:bg-amber-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Nala Soco
            </button>
            <button 
              onClick={() => document.getElementById('vision-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-700 rounded-xl font-semibold text-lg hover:bg-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg border border-stone-200"
            >
              Baro Aragtida
            </button>
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
              Horumarin waa goob digitaal oo loogu talagalay dadka Soomaaliyeed, halkaas oo ay ku helaan jawaabo sax ah, khubaro la aaminsan karo, iyo aqoon waxtar leh.
            </p>
            <p className="text-xl text-stone-700 leading-relaxed mb-6">
              Waxaan rumaysan nahay in aqoontu tahay furaha horumar, in khubraduna tahay nuurka haga jidka, iyo in midnimadu tahay awooda wax walba suurto galisa.
            </p>
            <p className="text-xl text-stone-700 leading-relaxed">
              Halkan, dhalinyaradu way heli doonaan dad ay ka barto oo ay aamini karaan. Bulshada oo dhan waxay dhisi doontaa aqoon dhab ah oo aan ku salaysnayn been iyo warar khaldan.
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
                <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Macluumaad Been ah
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Waxaa jira macluumaad badan oo aan la garanin kuwa runta ah iyo kuwa beenta ah. Taasi waxay kelisaa dadka.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Aqoon Kala Firdhisan
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Aqoonta ayaa ku firdhisan Facebook, YouTube, iyo meelo kale. Marka aad u baahato, ma heli kartid fudud.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                Dhalinyaro La'aan Hagid
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Dhalinyaradu ma helaan meel ay ka sugaan talo iyo hagid dad khibrad leh oo ay aamini karaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="vision-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
              Xalka Aan Dhisayno
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-700 mx-auto rounded-full" />
            <p className="text-xl text-stone-600 mt-6 max-w-3xl mx-auto">
              Horumarin waxay leedahay hab casri ah oo lagu hubiyo in aqoontu tahay mid sax ah oo ay bixiyaan dad khibrad leh.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Khubaro La Hubo
              </h3>
              <p className="text-stone-700">
                Kaliya dad khibrad la hubo ayaa jawaabin kara su'aalaha, si loo hubiyo in macluumaadku yahay mid sax ah.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-teal-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Qaybaha Kala Duwan
              </h3>
              <p className="text-stone-700">
                Waxbarasho, Caafimaad, Ganacsi, Diinta, Tiknoolaji, Dhaqan, iyo Nolosha Dibadda.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Hab Doorasho
              </h3>
              <p className="text-stone-700">
                Dadku way doorataan jawaabaha ugu wanaagsan iyagoo cod siinaya, si jawaabaha fiican u soo baxaan.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Sumcad iyo Darajada
              </h3>
              <p className="text-stone-700">
                Khubaro fiican ayaa hela sumcad sare iyagoo bixiya jawaabo tayo leh, taasoo siisa sharaf iyo qadarin.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Kaydka Aqoonta
              </h3>
              <p className="text-stone-700">
                Maktabad weyn oo aqoon ah oo soo kordhaysa oo qof kastaa uu ka faa'iidaysan karo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Bulshada Wada Dhisan
              </h3>
              <p className="text-stone-700">
                Qof kastaa ayaa gacan ka geysan kara dhismaha kaydkan aqoonta, si wada jir ah.
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
                  Qor su'aashaada - wax kastoo aad rabto oo ku saabsan waxbarasho, caafimaad, ganacsi, diinta, tiknoolaji, ama nolosha guud.
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
                  Khubaro la hubo ayaa bixin doona jawaabo ku salaysan khibrad iyo aqoon dhab ah. Dadku way doorataan jawaabaha ugu fiican.
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
                  Haddii aad bixiso jawaabo wanaagsan, sumcaddaadu way kordhi doontaa, oo waxaad noqon doontaa qof dadku ay aamini karaan.
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
                  Aqoontaada ayaa caawini doonta dadka kale, waad saameyn doontaa bulshada, oo waxaad ka qayb qaadan doontaa dhismaha mustaqbalka.
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
              Waxaan ku dadaalaynaa inaan dhisno meel ka mid ah mustaqbalka bulshada Soomaaliyeed oo dhan.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Kaydka Aqoonta Ugu Weyn
              </h3>
              <p className="text-stone-300 leading-relaxed">
                Inuu noqdo kaydka aqoonta Soomaaliyeed ee ugu weyn adduunka, halkaas oo qof kastaa uu wax walba ka heli karo.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Xiriir Shaqo iyo Fursado
              </h3>
              <p className="text-stone-300 leading-relaxed">
                Meel ay dhalinyaradu ka helaan hagayaal iyo fursado shaqo, iyagoo la xiriiraya dad khibrad leh.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Koorsooyin Waxbarasho
              </h3>
              <p className="text-stone-300 leading-relaxed">
                Koorsooyin waxbarasho oo Af-Soomaaliga ah, oo laga barto xirfado cusub, tiknoolaji, iyo cilmiga.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                App Mobileka Mustaqbalka
              </h3>
              <p className="text-stone-300 leading-relaxed">
                App mobile oo casri ah oo aad meel kastaa ka heli kartid aqoonta aad u baahato, si fudud.
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
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">DhiriGalin</h3>
                  <p className="text-lg text-stone-600">Waxay kicisaa riyada iyo himilada.</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-4xl text-stone-400">+</div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">Horumarin</h3>
                  <p className="text-lg text-stone-600">Waxay dhistaa jidka iyo aqoonta.</p>
                </div>
              </div>

              <div className="mt-12 p-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
                <p className="text-xl text-center text-stone-800 font-medium leading-relaxed">
                  <span className="text-indigo-700 font-bold">DhiriGalin</span> waxay kicisaa riyada.<br />
                  <span className="text-purple-700 font-bold">Horumarin</span> waxay dhistaa jidka.<br />
                  <span className="text-stone-900 font-bold mt-4 block">Labaduba waa horumarinta bulshada.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="notify-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-orange-700">
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
      <footer className="bg-stone-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Horumarin</h3>
            <p className="text-stone-400 text-lg mb-6">Aqoonta Soomaaliyeed hal meel.</p>
            
            <div className="inline-flex items-center gap-2 text-stone-400 text-sm">
              <span>Developed by</span>
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
          
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-400 text-sm">
              © 2026 Horumarin — Xuquuqda Loo Haystay
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
