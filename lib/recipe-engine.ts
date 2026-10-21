export interface RecipeNutrient {
  calories: number; // kkal
  protein: number; // gram
  iron: number; // mg
  zinc: number; // mg
  calcium: number; // mg
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  estimatedCost: number; // Rupiah
  isLocalHero?: boolean; // bahan pangan unggulan lokal
}

export interface SmartRecipe {
  id: string;
  title: string;
  category: "Stunting (TB/U)" | "Wasting (BB/TB)" | "Underweight (BB/U)" | "Gizi Seimbang";
  targetAge: string;
  costPerServing: number;
  preparationTime: string;
  nutrients: RecipeNutrient;
  akgPercentage: {
    protein: number; // % AKG harian balita (~20g)
    iron: number; // % AKG harian balita (~7mg)
    zinc: number; // % AKG harian balita (~3mg)
    calcium: number; // % AKG harian balita (~650mg)
  };
  highlights: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
}

export interface DeficitCondition {
  is_stunted?: boolean;
  is_underweight?: boolean;
  is_wasted?: boolean;
  child_name?: string;
}

// Master Template Resep Gizi Cerdas Berbasis Pangan Lokal Terjangkau
const RECIPE_TEMPLATES: SmartRecipe[] = [
  {
    id: "resep-lele-kelor",
    title: "Nugget Kukus Lele & Daun Kelor",
    category: "Stunting (TB/U)",
    targetAge: "12 - 59 Bulan",
    costPerServing: 4800,
    preparationTime: "30 Menit",
    nutrients: {
      calories: 210,
      protein: 15.4,
      iron: 3.8,
      zinc: 1.4,
      calcium: 180,
    },
    akgPercentage: {
      protein: 77, // 15.4 / 20g
      iron: 54, // 3.8 / 7mg
      zinc: 46, // 1.4 / 3mg
      calcium: 28, // 180 / 650mg
    },
    highlights: [
      "Protein hewani ikan lele lokal tinggi asam amino esensial",
      "Kandungan kalsium & zat besi daun kelor untuk pemadatan tulang",
      "Biaya sangat hemat (< Rp5.000/porsi)",
    ],
    ingredients: [
      { name: "Fillet Daging Ikan Lele Lokal", amount: "80 gram", estimatedCost: 2200, isLocalHero: true },
      { name: "Daun Kelor Segar (Cincang Halus)", amount: "20 gram", estimatedCost: 500, isLocalHero: true },
      { name: "Telur Ayam Ras", amount: "1/2 butir", estimatedCost: 900, isLocalHero: true },
      { name: "Tepung Tapioka & Terigu", amount: "2 sdm", estimatedCost: 500 },
      { name: "Bawang Putih & Garam Beriodium", amount: "Secukupnya", estimatedCost: 700 },
    ],
    instructions: [
      "Haluskan daging lele bersama bawang putih dan sedikit garam.",
      "Campurkan cincangan daun kelor, kocokan telur, dan tepung tapioka hingga kalis merata.",
      "Tuang adonan ke dalam loyang tahan panas yang telah diolesi sedikit minyak.",
      "Kukus selama 20 menit hingga matang sempurna, lalu potong-potong sesuai porsi makan anak.",
      "Dapat disajikan langsung selagi hangat bersama nasi lembek.",
    ],
  },
  {
    id: "resep-hati-bayam",
    title: "Bubur Tim Hati Ayam & Bayam Merah Gurih",
    category: "Stunting (TB/U)",
    targetAge: "6 - 24 Bulan",
    costPerServing: 5200,
    preparationTime: "25 Menit",
    nutrients: {
      calories: 240,
      protein: 16.8,
      iron: 6.2,
      zinc: 2.1,
      calcium: 95,
    },
    akgPercentage: {
      protein: 84,
      iron: 88, // Sangat tinggi zat besi heme untuk mencegah anemia stunting
      zinc: 70,
      calcium: 15,
    },
    highlights: [
      "Sumber zat besi heme terbaik dari hati ayam (bioavailabilitas tinggi)",
      "Mencegah anemia defisiensi besi penyebab hambatan pertumbuhan otak",
      "Tekstur lembut ramah pencernaan balita",
    ],
    ingredients: [
      { name: "Hati Ayam Segar (Rebus & Cincang)", amount: "50 gram", estimatedCost: 2000, isLocalHero: true },
      { name: "Beras Putih Pulen", amount: "3 sdm", estimatedCost: 1000 },
      { name: "Daun Bayam Hijau/Merah", amount: "25 gram", estimatedCost: 500, isLocalHero: true },
      { name: "Tahu Putih Halus", amount: "30 gram", estimatedCost: 700, isLocalHero: true },
      { name: "Minyak Kelapa / Santan Segar", amount: "1 sdt", estimatedCost: 1000 },
    ],
    instructions: [
      "Rebus beras bersama air kaldu hingga menjadi bubur beras yang lembut.",
      "Tumis hati ayam cincang dengan sedikit minyak kelapa dan bawang putih hingga harum.",
      "Masukkan tumisan hati ayam dan tahu lumat ke dalam bubur yang sedang mendidih.",
      "Tambahkan daun bayam pada 3 menit terakhir agar vitamin tidak rusak.",
      "Aduk hingga kekentalan pas, saring atau haluskan sesuai tahapan usia balita.",
    ],
  },
  {
    id: "resep-rolade-tempe-telur",
    title: "Rolade Tempe & Telur Padat Kalori",
    category: "Wasting (BB/TB)",
    targetAge: "12 - 59 Bulan",
    costPerServing: 4200,
    preparationTime: "25 Menit",
    nutrients: {
      calories: 285,
      protein: 14.5,
      iron: 3.1,
      zinc: 1.6,
      calcium: 165,
    },
    akgPercentage: {
      protein: 72,
      iron: 44,
      zinc: 53,
      calcium: 25,
    },
    highlights: [
      "Padat kalori dan protein untuk menaikkan berat badan balita wasting secara bertahap",
      "Perpaduan protein nabati tempe fermentasi dan protein hewani telur ayam",
      "Bahan dapat dibeli di warung desa mana pun",
    ],
    ingredients: [
      { name: "Tempe Kedelai (Kukus & Haluskan)", amount: "75 gram", estimatedCost: 1500, isLocalHero: true },
      { name: "Telur Ayam Ras (Didadar Tipis untuk Kulit)", amount: "1 butir", estimatedCost: 1800, isLocalHero: true },
      { name: "Wortel Parut", amount: "20 gram", estimatedCost: 400 },
      { name: "Minyak Goreng untuk Olesan", amount: "1 sdt", estimatedCost: 500 },
    ],
    instructions: [
      "Campurkan tempe halus bersama parutan wortel, sedikit garam, dan bumbu halus.",
      "Buat dadar telur tipis di atas wajan anti lengket sebagai lapisan kulit.",
      "Ratakan adonan tempe di atas lembaran telur dadar, lalu gulung rapat memanjang.",
      "Bungkus gulungan dengan daun pisang atau plastik tahan panas, kukus selama 20 menit.",
      "Potong melintang menjadi 5-6 bagian menarik menyerupai roda sebelum disajikan.",
    ],
  },
  {
    id: "resep-sup-ikan-tahu",
    title: "Sup Kuah Kuning Ikan Gabus & Tahu Sutra",
    category: "Underweight (BB/U)",
    targetAge: "9 - 59 Bulan",
    costPerServing: 5900,
    preparationTime: "30 Menit",
    nutrients: {
      calories: 230,
      protein: 17.2,
      iron: 2.8,
      zinc: 1.9,
      calcium: 210,
    },
    akgPercentage: {
      protein: 86,
      iron: 40,
      zinc: 63,
      calcium: 32,
    },
    highlights: [
      "Kaya albumin alami dari ikan tawar untuk pemulihan jaringan tubuh",
      "Kalsium tinggi dari tahu lokal ramah anggaran",
      "Kuah gurih rempah kunyit merangsang nafsu makan anak",
    ],
    ingredients: [
      { name: "Daging Ikan Air Tawar (Gabus/Nila/Lele)", amount: "70 gram", estimatedCost: 3200, isLocalHero: true },
      { name: "Tahu Putih Lembut (Potong Dadu)", amount: "50 gram", estimatedCost: 1000, isLocalHero: true },
      { name: "Tomat & Daun Bawang", amount: "Secukupnya", estimatedCost: 700 },
      { name: "Kunyit, Jahe, Bawang Merah, Bawang Putih", amount: "Bumbu Halus", estimatedCost: 1000 },
    ],
    instructions: [
      "Tumis bumbu halus (kunyit, jahe, bawang) hingga wangi dan tidak langu.",
      "Tuangkan air kaldu mendidih, masukkan potongan daging ikan segar.",
      "Masukkan dadu tahu lembut dan potongan tomat segar.",
      "Masak dengan api sedang hingga kuah meresap dan ikan matang sempurna.",
      "Sajikan selagi hangat bersama nasi lembek bertabur bawang goreng renyah.",
    ],
  },
];

/**
 * Menghasilkan daftar resep gizi cerdas yang disesuaikan dengan kondisi antropometri anak
 */
export function generateSmartRecipes(condition?: DeficitCondition): SmartRecipe[] {
  if (!condition) {
    return RECIPE_TEMPLATES;
  }

  const { is_stunted, is_wasted, is_underweight } = condition;

  // Urutkan resep berdasarkan tingkat relevansi defisiensi
  return [...RECIPE_TEMPLATES].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (is_stunted) {
      if (a.category.includes("Stunting")) scoreA += 10;
      if (b.category.includes("Stunting")) scoreB += 10;
      // Bonus jika zat besi & protein tinggi
      scoreA += a.nutrients.iron * 2 + a.nutrients.protein;
      scoreB += b.nutrients.iron * 2 + b.nutrients.protein;
    }

    if (is_wasted) {
      if (a.category.includes("Wasting")) scoreA += 10;
      if (b.category.includes("Wasting")) scoreB += 10;
      // Bonus jika kalori tinggi
      scoreA += a.nutrients.calories / 10;
      scoreB += b.nutrients.calories / 10;
    }

    if (is_underweight) {
      if (a.category.includes("Underweight")) scoreA += 8;
      if (b.category.includes("Underweight")) scoreB += 8;
      scoreA += a.nutrients.protein;
      scoreB += b.nutrients.protein;
    }

    return scoreB - scoreA;
  });
}
