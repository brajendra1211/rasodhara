import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@farmstore.test" },
    update: {},
    create: {
      name: "Store Admin",
      email: "admin@farmstore.test",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@farmstore.test" },
    update: {},
    create: {
      name: "Test Customer",
      email: "customer@farmstore.test",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "9876543210",
    },
  });

  const categories = [
    {
      name: "Cold-Pressed Oils",
      slug: "cold-pressed-oils",
      description: "Traditional wood-pressed oils, extracted without heat or chemicals.",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    },
    {
      name: "Ghee & Dairy",
      slug: "ghee-dairy",
      description: "Farm-fresh ghee made using the traditional bilona method.",
      image: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=400",
    },
    {
      name: "Spices & Masalas",
      slug: "spices-masalas",
      description: "Sun-dried, stone-ground spices sourced directly from farmers.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
    },
    {
      name: "Grains & Pulses",
      slug: "grains-pulses",
      description: "Naturally grown grains and pulses, free from pesticides.",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const coldPressed = await prisma.category.findUniqueOrThrow({ where: { slug: "cold-pressed-oils" } });
  const ghee = await prisma.category.findUniqueOrThrow({ where: { slug: "ghee-dairy" } });
  const spices = await prisma.category.findUniqueOrThrow({ where: { slug: "spices-masalas" } });
  const grains = await prisma.category.findUniqueOrThrow({ where: { slug: "grains-pulses" } });

  const products = [
    {
      name: "Wood-Pressed Groundnut Oil",
      slug: "wood-pressed-groundnut-oil",
      description:
        "Extracted from sun-dried groundnuts using a traditional wooden ghani, this oil retains its natural aroma, flavor, and nutrients.",
      price: 45000,
      mrp: 55000,
      stock: 40,
      categoryId: coldPressed.id,
      isBestSeller: true,
      isJainFriendly: true,
      tasteProfile: "Nutty, rich",
      oilType: "Groundnut",
      weightGrams: 1000,
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800"],
    },
    {
      name: "Cold-Pressed Coconut Oil",
      slug: "cold-pressed-coconut-oil",
      description:
        "Made from fresh coconuts using the cold-press method, ideal for cooking, hair, and skin care.",
      price: 38000,
      mrp: 42000,
      stock: 50,
      categoryId: coldPressed.id,
      isBestSeller: true,
      isJainFriendly: true,
      tasteProfile: "Mild, sweet",
      oilType: "Coconut",
      weightGrams: 500,
      images: ["https://images.unsplash.com/photo-1584385002340-d886f3a0f097?w=800"],
    },
    {
      name: "Wood-Pressed Mustard Oil",
      slug: "wood-pressed-mustard-oil",
      description: "Pungent and flavorful mustard oil, pressed the traditional way for maximum nutrition.",
      price: 32000,
      mrp: 38000,
      stock: 35,
      categoryId: coldPressed.id,
      isBestSeller: false,
      isJainFriendly: true,
      tasteProfile: "Pungent, sharp",
      oilType: "Mustard",
      weightGrams: 1000,
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800"],
    },
    {
      name: "A2 Bilona Cow Ghee",
      slug: "a2-bilona-cow-ghee",
      description: "Slow-churned from curd using the bilona method, made from A2 desi cow milk.",
      price: 85000,
      mrp: 95000,
      stock: 25,
      categoryId: ghee.id,
      isBestSeller: true,
      isJainFriendly: true,
      tasteProfile: "Rich, grainy",
      oilType: null,
      weightGrams: 500,
      images: ["https://images.unsplash.com/photo-1631206753348-db44968fd440?w=800"],
    },
    {
      name: "Stone-Ground Turmeric Powder",
      slug: "stone-ground-turmeric-powder",
      description: "Sun-dried turmeric roots, stone-ground to preserve curcumin content and natural color.",
      price: 12000,
      mrp: 15000,
      stock: 60,
      categoryId: spices.id,
      isBestSeller: false,
      isJainFriendly: true,
      tasteProfile: "Earthy, slightly bitter",
      oilType: null,
      weightGrams: 200,
      images: ["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800"],
    },
    {
      name: "Farm-Fresh Toor Dal",
      slug: "farm-fresh-toor-dal",
      description: "Naturally grown pigeon peas, sun-dried and cleaned without polishing agents.",
      price: 16000,
      mrp: 18000,
      stock: 45,
      categoryId: grains.id,
      isBestSeller: false,
      isJainFriendly: true,
      tasteProfile: "Mild, earthy",
      oilType: null,
      weightGrams: 1000,
      images: ["https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800"],
    },
  ];

  for (const product of products) {
    const { images, ...rest } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...rest,
        images: { create: images.map((url) => ({ url })) },
      },
    });
  }

  const pickleCategories = [
    {
      name: "Pickles & Chutneys",
      slug: "pickles-chutneys",
      description: "Traditional Indian pickles and chutneys, cured the slow way in small batches.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
    },
    {
      name: "Sun-Dried Wadis",
      slug: "sun-dried-wadis",
      description: "Lentil-based nuggets, sun-dried the traditional way for use in curries and everyday cooking.",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400",
    },
  ];

  for (const category of pickleCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const picklesCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "pickles-chutneys" } });
  const wadisCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "sun-dried-wadis" } });

  const PICKLE_IMAGES = [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800",
    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800",
    "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800",
  ];

  const pickleProducts = [
    {
      name: "Punjabi Aam Achaar",
      slug: "punjabi-aam-achaar",
      description:
        "Raw mangoes cut and cured with a Punjabi-style spice mix of mustard, fennel and fenugreek, then matured in cold-pressed mustard oil until the flavours settle in. A tangy, well-spiced pickle that pairs well with parathas, dal and rice.",
      ingredients: "Raw mango, mustard oil, mustard seeds, fennel seeds, fenugreek seeds, cumin seeds, turmeric, red chilli powder, salt",
      tasteProfile: "Tangy, spicy",
      oilType: "Mustard Oil",
      isJainFriendly: true,
      isBestSeller: true,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 27900, mrp: 32900, stock: 60, order: 0 },
        { label: "1kg Jar", price: 69900, mrp: 79900, stock: 30, order: 1 },
      ],
    },
    {
      name: "Rajasthani Lasoda Achaar",
      slug: "rajasthani-lasoda-achaar",
      description:
        "A traditional Rajasthani pickle made from lasoda (gunda) berries, slow-cured with mustard oil and a mix of whole and ground spices. Distinctly tangy with the firm, chewy bite typical of this desert-region specialty.",
      ingredients: "Lasoda (gunda berries), mustard oil, fennel seeds, mustard seeds, fenugreek seeds, cumin seeds, turmeric, red chilli, asafoetida, dry mango powder, salt",
      tasteProfile: "Tangy, earthy",
      oilType: "Mustard Oil",
      isJainFriendly: true,
      isBestSeller: false,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 29900, mrp: 34900, stock: 40, order: 0 },
        { label: "1kg Jar", price: 74900, mrp: 84900, stock: 20, order: 1 },
      ],
    },
    {
      name: "Chatpata Aam Achaar",
      slug: "chatpata-aam-achaar",
      description:
        "A drier-style raw mango pickle finished with a punchy blend of red chilli, black salt and roasted spices. Less oil than a traditional achar, with a sharper, chatpata kick.",
      ingredients: "Raw mango, mustard oil, fennel seeds, red chilli powder, black salt, turmeric, asafoetida, salt, mustard seeds, cumin seeds",
      tasteProfile: "Tangy, spicy",
      oilType: "Mustard Oil",
      isJainFriendly: true,
      isBestSeller: false,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 26900, mrp: 31900, stock: 45, order: 0 },
        { label: "1kg Jar", price: 66900, mrp: 76900, stock: 25, order: 1 },
      ],
    },
    {
      name: "Heeng Aam Achaar",
      slug: "heeng-aam-achaar",
      description:
        "Raw mango pickle built around a generous hand of hing (asafoetida), giving it a deep, savoury aroma alongside the usual tang. A drier-style achar that keeps well at room temperature.",
      ingredients: "Raw mango, mustard oil, red chilli powder, black salt, salt, asafoetida, Kashmiri red chilli powder",
      tasteProfile: "Tangy, savoury",
      oilType: "Mustard Oil",
      isJainFriendly: false,
      isBestSeller: false,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 26900, mrp: 31900, stock: 40, order: 0 },
        { label: "1kg Jar", price: 66900, mrp: 76900, stock: 20, order: 1 },
      ],
    },
    {
      name: "Meethi Aam Chutney (Chunda)",
      slug: "meethi-aam-chutney-chunda",
      description:
        "Grated raw mango slow-cooked with jaggery into a sweet-tangy chutney, rounded out with a touch of warming spice. Good alongside parathas or mixed into curd for a quick side.",
      ingredients: "Raw mango, jaggery, black salt, salt, black pepper, cumin seeds, dry ginger powder, raisins, red chilli powder",
      tasteProfile: "Sweet, tangy",
      oilType: null,
      isJainFriendly: true,
      isBestSeller: false,
      shelfLife: "9 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "350g Jar", price: 24900, mrp: 29900, stock: 35, order: 0 },
        { label: "900g Jar", price: 59900, mrp: 69900, stock: 18, order: 1 },
      ],
    },
    {
      name: "Stuffed Red Chilli Pickle",
      slug: "stuffed-red-chilli-pickle",
      description:
        "Whole red chillies slit and stuffed with a roasted spice filling, then cured in mustard oil. A fiery, well-rounded pickle for those who like heat with their meal.",
      ingredients: "Red chilli, mustard oil, mustard seeds, fenugreek seeds, carom seeds, coriander seeds, turmeric, dry mango powder, cumin seeds, fennel seeds",
      tasteProfile: "Spicy, tangy",
      oilType: "Mustard Oil",
      isJainFriendly: true,
      isBestSeller: true,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 28900, mrp: 33900, stock: 35, order: 0 },
        { label: "1kg Jar", price: 71900, mrp: 81900, stock: 18, order: 1 },
      ],
    },
    {
      name: "Stuffed Green Chilli Pickle",
      slug: "stuffed-green-chilli-pickle",
      description:
        "Fresh green chillies stuffed with a mustard-and-fennel spice mix and matured in oil. Milder than the red chilli version but still packs a distinct tang.",
      ingredients: "Green chilli, mustard oil, mustard seeds, fenugreek seeds, coriander seeds, turmeric, dry mango powder, cumin seeds, fennel seeds",
      tasteProfile: "Spicy, tangy",
      oilType: "Mustard Oil",
      isJainFriendly: true,
      isBestSeller: false,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 27900, mrp: 32900, stock: 35, order: 0 },
        { label: "1kg Jar", price: 69900, mrp: 79900, stock: 18, order: 1 },
      ],
    },
    {
      name: "Khatta Meetha Nimbu Achaar",
      slug: "khatta-meetha-nimbu-achaar",
      description:
        "Whole lemons cured with jaggery and a warm masala of black pepper, cinnamon and cloves, balancing sweet, sour and salty in one jar. A classic accompaniment to khichdi and curd rice.",
      ingredients: "Lemon, jaggery powder, salt, black salt, cumin, garam masala, black pepper, black cardamom, dry ginger, bay leaf, cinnamon, nutmeg, mace, cloves",
      tasteProfile: "Sweet, tangy",
      oilType: null,
      isJainFriendly: true,
      isBestSeller: false,
      shelfLife: "12 months from the date of packaging",
      categoryId: picklesCategory.id,
      variants: [
        { label: "400g Jar", price: 25900, mrp: 30900, stock: 40, order: 0 },
        { label: "1kg Jar", price: 64900, mrp: 74900, stock: 20, order: 1 },
      ],
    },
    {
      name: "Moong Dal Aaloo Masala Wadi",
      slug: "moong-dal-aaloo-masala-wadi",
      description:
        "Sun-dried lentil nuggets made from moong dal and potato, seasoned with ginger, green chilli and garam masala. Fry them up as a quick side or drop into curries for texture.",
      ingredients: "Moong dal, potato, ginger, green chilli, garam masala, asafoetida, black pepper, turmeric, dried fenugreek leaves",
      tasteProfile: "Savoury, mildly spiced",
      oilType: null,
      isJainFriendly: false,
      isBestSeller: false,
      shelfLife: "6 months from the date of packaging",
      categoryId: wadisCategory.id,
      variants: [
        { label: "200g Pack", price: 14900, mrp: 16900, stock: 50, order: 0 },
        { label: "500g Pack", price: 34900, mrp: 39900, stock: 25, order: 1 },
      ],
    },
    {
      name: "Urad Dal Petha Wadi",
      slug: "urad-dal-petha-wadi",
      description:
        "Sun-dried nuggets made from urad dal and ash gourd (petha), a traditional way of preserving lentils for later use. Adds a hearty bite to curries once fried or simmered.",
      ingredients: "Urad dal, ash gourd (petha), garam masala, asafoetida, black pepper",
      tasteProfile: "Savoury",
      oilType: null,
      isJainFriendly: true,
      isBestSeller: true,
      shelfLife: "6 months from the date of packaging",
      categoryId: wadisCategory.id,
      variants: [
        { label: "200g Pack", price: 14900, mrp: 16900, stock: 50, order: 0 },
        { label: "500g Pack", price: 34900, mrp: 39900, stock: 25, order: 1 },
      ],
    },
    {
      name: "Urad Dal Lauki Wadi",
      slug: "urad-dal-lauki-wadi",
      description:
        "Urad dal and bottle gourd (lauki) shaped into small nuggets and sun-dried the traditional way. A pantry staple that fries up quickly for curries or a simple side.",
      ingredients: "Urad dal, bottle gourd (lauki), garam masala, asafoetida, black pepper",
      tasteProfile: "Savoury",
      oilType: null,
      isJainFriendly: true,
      isBestSeller: false,
      shelfLife: "6 months from the date of packaging",
      categoryId: wadisCategory.id,
      variants: [
        { label: "200g Pack", price: 13900, mrp: 15900, stock: 50, order: 0 },
        { label: "500g Pack", price: 32900, mrp: 37900, stock: 25, order: 1 },
      ],
    },
  ];

  for (let i = 0; i < pickleProducts.length; i++) {
    const { variants, ...rest } = pickleProducts[i];
    const lowestPrice = Math.min(...variants.map((v) => v.price));
    const lowestVariant = variants.find((v) => v.price === lowestPrice)!;
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        price: lowestVariant.price,
        mrp: lowestVariant.mrp,
        stock: totalStock,
        images: { create: [{ url: PICKLE_IMAGES[i % PICKLE_IMAGES.length] }] },
        variants: { create: variants },
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "FarmStore",
      tagline: "Cold-pressed oils, ghee, spices and grains, sourced directly from farmers and delivered fresh to your door.",
      contactEmail: "hello@farmstore.test",
      contactPhone: "+91 98765 43210",
    },
  });

  const announcements = [
    { text: "Free shipping on prepaid orders above ₹999", order: 0 },
    { text: "100% cold-pressed — no refining, no additives", order: 1 },
    { text: "Secure checkout powered by Razorpay", order: 2 },
    { text: "Farm-fresh, delivered pan-India", order: 3 },
  ];
  for (const a of announcements) {
    const existing = await prisma.announcementMessage.findFirst({ where: { text: a.text } });
    if (!existing) await prisma.announcementMessage.create({ data: a });
  }

  const heroSlides = [
    {
      title: "Cold-pressed oils, straight from the farm",
      subtitle: "Wood-ghani pressed, no refining, no additives — just traditional goodness.",
      ctaLabel: "Shop oils",
      ctaHref: "/shop?category=cold-pressed-oils",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600",
      badge: "Best Seller",
      order: 0,
    },
    {
      title: "A2 Bilona Ghee, slow-churned the traditional way",
      subtitle: "Made from desi cow milk using the age-old bilona method.",
      ctaLabel: "Shop ghee",
      ctaHref: "/shop?category=ghee-dairy",
      image: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=1600",
      badge: "New Launch",
      order: 1,
    },
    {
      title: "Stone-ground spices & masalas",
      subtitle: "Sun-dried, chemical-free, ground the old-fashioned way.",
      ctaLabel: "Shop spices",
      ctaHref: "/shop?category=spices-masalas",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600",
      badge: null,
      order: 2,
    },
  ];
  for (const s of heroSlides) {
    const existing = await prisma.heroSlide.findFirst({ where: { title: s.title } });
    if (!existing) await prisma.heroSlide.create({ data: s });
  }

  const trustBadges = [
    { label: "100% Natural, No Preservatives", icon: "leaf", order: 0 },
    { label: "Secure Payments", icon: "shield", order: 1 },
    { label: "Pan-India Shipping", icon: "truck", order: 2 },
    { label: "Easy Returns", icon: "refresh", order: 3 },
  ];
  for (const b of trustBadges) {
    const existing = await prisma.trustBadge.findFirst({ where: { label: b.label } });
    if (!existing) await prisma.trustBadge.create({ data: b });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
