const products = [
  // Telephone category
  {
    id: 1,
    name: "Telephone",
    description: "Good telephone.",
    price: "25000 TL",
    image: "/images/1.png",
    category: "Telephone",
    inCart: false
  },
  {
    id: 9,
    name: "Smartphone A",
    description: "High-quality smartphone.",
    price: "28000 TL",
    image: "/images/9.png",
    category: "Telephone"
  },
  {
    id: 10,
    name: "Smartphone B",
    description: "Affordable smartphone.",
    price: "15000 TL",
    image: "/images/10.png",
    category: "Telephone"
  },
  {
    id: 11,
    name: "Smartphone C",
    description: "Gaming smartphone.",
    price: "30000 TL",
    image: "/images/11.png",
    category: "Telephone"
  },
  {
    id: 12,
    name: "Basic Phone",
    description: "Simple and durable.",
    price: "5000 TL",
    image: "/images/12.png",
    category: "Telephone"
  },

  // TV category
  {
    id: 2,
    name: "Television",
    description: "Great television.",
    price: "35000 TL",
    image: "/images/2.png",
    category: "TV"
  },
  {
    id: 13,
    name: "Smart TV",
    description: "4K Smart TV.",
    price: "40000 TL",
    image: "/images/13.png",
    category: "TV"
  },
  {
    id: 14,
    name: "LED TV",
    description: "High-resolution LED TV.",
    price: "30000 TL",
    image: "/images/14.png",
    category: "TV"
  },
  {
    id: 15,
    name: "OLED TV",
    description: "Excellent color quality.",
    price: "45000 TL",
    image: "/images/15.png",
    category: "TV"
  },
  {
    id: 16,
    name: "Curved TV",
    description: "Immersive viewing experience.",
    price: "37000 TL",
    image: "/images/16.png",
    category: "TV"
  },

  // Laptop category
  {
    id: 3,
    name: "Laptop",
    description: "Performance laptop.",
    price: "50000 TL",
    image: "/images/3.png",
    category: "Laptop"
  },
  {
    id: 17,
    name: "Gaming Laptop",
    description: "High-end gaming laptop.",
    price: "60000 TL",
    image: "/images/17.png",
    category: "Laptop"
  },
  {
    id: 18,
    name: "Ultrabook",
    description: "Lightweight and powerful.",
    price: "45000 TL",
    image: "/images/18.png",
    category: "Laptop"
  },
  {
    id: 19,
    name: "Business Laptop",
    description: "Perfect for work.",
    price: "55000 TL",
    image: "/images/19.png",
    category: "Laptop"
  },
  {
    id: 20,
    name: "2-in-1 Laptop",
    description: "Tablet and laptop in one.",
    price: "48000 TL",
    image: "/images/20.png",
    category: "Laptop"
  },

  // Consoles category
  {
    id: 4,
    name: "Xbox",
    description: "Playing games.",
    price: "20000 TL",
    image: "/images/4.png",
    category: "Consoles"
  },
  {
    id: 8,
    name: "PS5",
    description: "Game play.",
    price: "40000 TL",
    image: "/images/8.png",
    category: "Consoles"
  },
  {
    id: 21,
    name: "Nintendo Switch",
    description: "Portable gaming console.",
    price: "30000 TL",
    image: "/images/21.png",
    category: "Consoles"
  },
  {
    id: 22,
    name: "Xbox Series S",
    description: "Compact console.",
    price: "22000 TL",
    image: "/images/22.png",
    category: "Consoles"
  },
  {
    id: 23,
    name: "Retro Console",
    description: "Classic game collection.",
    price: "10000 TL",
    image: "/images/23.png",
    category: "Consoles"
  },

  // Accessory category
  {
    id: 5,
    name: "Toast Machine",
    description: "Hungry solver.",
    price: "1500 TL",
    image: "/images/5.png",
    category: "Accessory"
  },
  {
    id: 24,
    name: "Wireless Earbuds",
    description: "Noise-canceling earbuds.",
    price: "2500 TL",
    image: "/images/24.png",
    category: "Accessory"
  },
  {
    id: 25,
    name: "Smartwatch",
    description: "Fitness tracking smartwatch.",
    price: "3500 TL",
    image: "/images/25.png",
    category: "Accessory"
  },
  {
    id: 26,
    name: "Phone Charger",
    description: "Fast charging adapter.",
    price: "500 TL",
    image: "/images/26.png",
    category: "Accessory"
  },
  {
    id: 27,
    name: "Bluetooth Speaker",
    description: "Portable speaker.",
    price: "1500 TL",
    image: "/images/27.png",
    category: "Accessory"
  },

  // White goods category
  {
    id: 6,
    name: "Washing Machine",
    description: "Clean clothes.",
    price: "15000 TL",
    image: "/images/6.png",
    category: "White"
  },
  {
    id: 7,
    name: "Dishwasher",
    description: "Clean dishes.",
    price: "17000 TL",
    image: "/images/7.png",
    category: "White"
  },
  {
    id: 28,
    name: "Refrigerator",
    description: "Keeps food fresh.",
    price: "20000 TL",
    image: "/images/28.png",
    category: "White"
  },
  {
    id: 29,
    name: "Microwave",
    description: "Heats food quickly.",
    price: "8000 TL",
    image: "/images/29.png",
    category: "White"
  },
  {
    id: 30,
    name: "Oven",
    description: "Perfect for baking.",
    price: "12000 TL",
    image: "/images/30.png",
    category: "White"
  }
];

export default products;
