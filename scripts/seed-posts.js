"use strict";

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }

  return env;
}

function getEnvValue(envFile, keyList) {
  for (const key of keyList) {
    if (process.env[key]) return process.env[key];
    if (envFile[key]) return envFile[key];
  }
  return null;
}

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function chunkArray(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const envFile = loadEnvFile(path.join(root, ".env.local"));

  const supabaseUrl = getEnvValue(envFile, [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL",
  ]);
  const supabaseAnonKey = getEnvValue(envFile, [
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
  ]);
  const seedUserEmail = getEnvValue(envFile, ["SEED_USER_EMAIL"]);
  const seedUserPassword = getEnvValue(envFile, ["SEED_USER_PASSWORD"]);
  const seedUserName = getEnvValue(envFile, ["SEED_USER_NAME"]) || "Seed User";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or ANON KEY.");
    console.error(
      "Set them in .env.local or in your shell before running this script.",
    );
    process.exit(1);
  }

  if (!seedUserEmail || !seedUserPassword) {
    console.error("Missing SEED_USER_EMAIL or SEED_USER_PASSWORD.");
    console.error(
      "Create a user in the app, then set credentials in .env.local.",
    );
    process.exit(1);
  }

  const seedCount = parseInt(getEnvValue(envFile, ["SEED_COUNT"]) || "50", 10);
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log("Signing in seed user...");
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: seedUserEmail,
      password: seedUserPassword,
    });

  if (signInError || !signInData?.user) {
    console.error("Failed to sign in seed user:", signInError?.message);
    process.exit(1);
  }

  const seedUserId = signInData.user.id;
  const realSomaliPosts = [
    {
      title: "Sidee Loo Bilaabaa Barashada Programming-ka 2026?",
      content: `
Programming waa xirfad mustaqbal leh. Haddii aad rabto inaad bilowdo:

1. Baro aasaaska: HTML, CSS, iyo JavaScript.
2. Samee mashruucyo yaryar sida website fudud.
3. Ka faa’iidayso YouTube iyo freeCodeCamp.
4. Ku biir community Somali tech ah si aad talo u hesho.

Ha sugin inaad noqoto perfect – ku bilow maanta.
    `,
      category: "tech",
      post_type: "resource",
    },
    {
      title: "5 Xirfadood Oo Online Lagu Barto Oo Dakhli Lagu Sameeyo",
      content: `
Haddii aad rabto inaad lacag online ka samayso:

- Graphic Design
- Video Editing
- Programming
- Digital Marketing
- Copywriting

Ku bilow adigoo baranaya hal xirfad, kadibna samee portfolio.
    `,
      category: "business",
      post_type: "discussion",
    },
    {
      title: "Sidee Loo Helaa Shaqo Remote Ah Adigoo Soomaaliya Jooga?",
      content: `
Shaqo remote ah waa fursad weyn. Samee:

1. CV iyo LinkedIn professional ah.
2. Baro English communication.
3. Isdiiwaangeli Upwork, Fiverr, iyo Remote OK.
4. Samee mashruucyo aad tusin karto shaqo-bixiyaha.

Joogitaankaaga maaha caqabad.
    `,
      category: "business",
      post_type: "resource",
    },
    {
      title: "Talooyin Ku Saabsan Horumarinta Caafimaadka Maskaxda",
      content: `
Caafimaadka maskaxdu waa muhiim:

- Samee jimicsi joogto ah.
- Ka fogow stress badan.
- La hadal qof aad ku kalsoon tahay.
- U qoondee waqti nasasho.

Maskax caafimaad qabta = nolol horumar leh.
    `,
      category: "health",
      post_type: "discussion",
    },
    {
      title: "Sidee Loo Bilaabaa Ganacsi Yar Oo Online Ah?",
      content: `
Ganacsi online ah waxaad ku bilaabi kartaa:

1. Dooro badeecad ama adeeg.
2. Samee Instagram ama TikTok page.
3. Dhis kalsoonida macaamiisha.
4. Adeeg tayo leh bixiso.

Ganacsi yar maanta, shirkad weyn berri.
    `,
      category: "business",
      post_type: "guide",
    },

    // Education
    {
      title: "Sidee Loo Kordhiyaa Diiradda Marka La Baranayo?",
      content: `
Haddii aad dhib ku qabto focus:

- Demi telefoonka inta aad wax baranayso.
- Isticmaal farsamada Pomodoro (25 daqiiqo shaqo, 5 daqiiqo nasasho).
- Samee jadwal maalinle ah.
- Ku shaqee meel deggan.

Diirad = natiijo fiican.
    `,
      category: "education",
      post_type: "resource",
    },

    {
      title: "Maxay Tahay Personal Branding? Sideese Loo Dhisaa?",
      content: `
Personal branding waa sida aad dadka ugu muuqato online.

- Dooro niche cad.
- La wadaag aqoontaada si joogto ah.
- Samee content qiimo leh.
- Noqo mid daacad ah.

Magacaaga ka dhig brand.
    `,
      category: "business",
      post_type: "article",
    },

    {
      title: "Sidee Loo Sameeyaa Budget Qofeed?",
      content: `
Haddii aad rabto inaad maaliyaddaada hagaajiso:

1. Qor dakhligaaga.
2. Qor kharashaadkaaga.
3. Ka jar waxyaabaha aan muhiimka ahayn.
4. Keydso ugu yaraan 10%.

Lacag maamuliddu waa furaha xasiloonida.
    `,
      category: "general",
      post_type: "guide",
    },

    {
      title: "Sidee Loo Dhisaa Website Adigoo Aan Coding Aqoon?",
      content: `
Waxaad isticmaali kartaa:

- WordPress
- Wix
- Shopify

Dooro template, ku dar content, kadibna publish.
Maaha inaad noqoto programmer si aad u yeelato website.
    `,
      category: "tech",
      post_type: "resource",
    },

    {
      title: "5 Buug Oo Qof Kasta Horumarinaya Noloshiisa U Baahan Yahay",
      content: `
Buugaag lagula talinayo:

- Atomic Habits
- Rich Dad Poor Dad
- Deep Work
- The 7 Habits of Highly Effective People
- Think and Grow Rich

Akhri si aad maskaxdaada u kobciso.
    `,
      category: "education",
      post_type: "article",
    },

    // Community & Culture
    {
      title: "Sidee Bulshadeena Soomaaliyeed U Horumarin Kartaa?",
      content: `
Horumarka bulshada wuxuu ku bilaabmaa:

- Wada shaqeyn
- Taageerida ganacsiyada maxaliga ah
- Waxbarasho
- Hal-abuur

Isbedelku adiga ayuu kaa bilaabmaa.
    `,
      category: "culture",
      post_type: "discussion",
    },

    {
      title: "Maxay Tahay Freelancing? Sidee Loo Bilaabaa?",
      content: `
Freelancing waa inaad xirfadaada si madax bannaan u iibiso.

- Dooro xirfad.
- Samee profile professional ah.
- Samee portfolio.
- U dir proposals tayo leh.

Bilow yar, kor u kac weyn.
    `,
      category: "business",
      post_type: "guide",
    },

    {
      title: "Sidee Loo Dhisaa Self-Confidence?",
      content: `
Isku kalsoonaantu waa la dhisi karaa:

- Ka shaqee xirfadahaaga.
- Samee wax yar oo maalin kasta kaa hormariya.
- Ka fogow dadka niyad jabinaya.
- Ku hadal si kalsooni leh.

Naftaada aamin.
    `,
      category: "general",
      post_type: "discussion",
    },

    {
      title: "Sidee Loo Helaa Scholarship Dibadda Ah?",
      content: `
Haddii aad rabto scholarship:

1. Raadi jaamacadaha bixiya.
2. Diyaari CV iyo Motivation Letter.
3. Baro IELTS ama TOEFL.
4. Codso si waqtigeeda ah.

Fursadaha waa badan yihiin.
    `,
      category: "education",
      post_type: "resource",
    },

    {
      title: "Ganacsiga Digital-ka Soomaaliya: Fursado Cusub",
      content: `
Suuqa digital-ka Soomaaliya si degdeg ah ayuu u korayaa:

- E-commerce
- Online services
- Content creation
- Tech startups

Hadda waa waqtigii la bilaabi lahaa.
    `,
      category: "business",
      post_type: "article",
    },

    {
      title: "Sidee Loo Bilaabaa Barashada AI iyo Machine Learning?",
      content: `
AI waa mustaqbalka.

- Baro Python.
- Faham xisaabta aasaasiga ah.
- Isticmaal Coursera ama YouTube.
- Samee mashruucyo AI yar yar.

Ha ka baqin technology-ga cusub.
    `,
      category: "tech",
      post_type: "resource",
    },

    {
      title: "Sidee Loo Sameeyaa Routine Subaxeed Wax Ku Ool Ah?",
      content: `
Subax wanaagsan = maalin wanaagsan.

- Soo kac waqti go'an.
- Samee jimicsi fudud.
- Qor yoolalka maalinta.
- Ka fogow social media 1 saac ugu horeysa.

Noloshaada maamul.
    `,
      category: "health",
      post_type: "guide",
    },

    {
      title: "Maxay Tahay Passive Income?",
      content: `
Passive income waa dakhli ku soo gala adigoo si joogto ah u shaqaynayn.

Tusaale:
- YouTube
- Online course
- Affiliate marketing
- Rental property

Samee nidaam kuu shaqeeya.
    `,
      category: "business",
      post_type: "article",
    },

    {
      title: "Sidee Loo Horumariyaa Xirfadaha Isgaarsiinta?",
      content: `
Isgaarsiinta fiican waa furaha guusha:

- Dhegeyso si feejigan.
- Ku hadal si cad.
- Ka fogow hadal xanaaq leh.
- Bar luuqado cusub.

Xiriir wanaagsan = fursado badan.
    `,
      category: "general",
      post_type: "discussion",
    },

    {
      title: "Horumarinta Nolosha: 10 Tallaabo Oo Fudud",
      content: `
1. Qorshee yoolal cad.
2. Akhri maalin kasta.
3. Bar xirfad cusub.
4. Samee jimicsi.
5. Ka fogow waqtiga luminta.
6. La shaqee dad wanaagsan.
7. Keydso lacag.
8. Nadiifi jadwalkaaga.
9. Noqo mid joogto ah.
10. Ha quusan.

Horumarku waa safar, maaha meel la gaaro.
    `,
      category: "general",
      post_type: "article",
    },
  ];

  const postTypes = [
    "question",
    "discussion",
    "media",
    "resource",
    "announcement",
  ];

  const normalizePostType = (value) => {
    if (value === "guide" || value === "article") return "resource";
    if (postTypes.includes(value)) return value;
    return "discussion";
  };
  console.log(`Creating ${realSomaliPosts.length} real Somali posts...`);

  const posts = realSomaliPosts.map((post, index) => ({
    user_id: seedUserId,
    title: post.title,
    content: post.content,
    category: post.category,
    post_type: normalizePostType(post.post_type),
    image_video_url: `https://picsum.photos/seed/horumarin-real-${index}/1200/675`,
    link_url: null,
  }));

  for (const batch of chunkArray(posts, 25)) {
    const { error } = await supabase.from("questions").insert(batch);
    if (error) {
      console.error("Failed to insert posts:", error.message);
      process.exit(1);
    }
  }

  console.log("Seeding complete.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
