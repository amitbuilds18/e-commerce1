import tshirt from "../assets/images/tshirt.jpg";
import jeans from "../assets/images/jeans.jpg";
import hoodie from "../assets/images/hoodie.jpg";
import shirt from "../assets/images/shirt.jpg";
import jacket from "../assets/images/jacket.jpg";
import shoes from "../assets/images/shoes.jpg";
import watch from "../assets/images/watch.jpg";
import bag from "../assets/images/bag.jpg";
import cap from "../assets/images/cap.jpg";
import dress from "../assets/images/dress.jpg";
import sunglasses from "../assets/images/sunglasses.jpg";

export const products = [
  // Featured Products
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 999,
    image: tshirt,
    category: "Men",
    rating: 4.5,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: 1499,
    image: jeans,
    category: "Men",
    rating: 4.7,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
  },
  {
    id: 3,
    name: "Winter Hoodie",
    price: 1999,
    image: hoodie,
    category: "Women",
    rating: 4.8,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
  },
  {
    id: 4,
    name: "Formal Shirt",
    price: 1299,
    image: shirt,
    category: "Men",
    rating: 4.4,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
  },

  // Trending Products
  {
    id: 5,
    name: "Leather Jacket",
    price: 2499,
    image: jacket,
    category: "Men",
    rating: 4.8,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 2999,
    image: shoes,
    category: "Shoes",
    rating: 4.9,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
  },
  {
    id: 7,
    name: "Luxury Watch",
    price: 3999,
    image: watch,
    category: "Accessories",
    rating: 4.7,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
  },
  {
    id: 8,
    name: "Travel Bag",
    price: 1899,
    image: bag,
    category: "Accessories",
    rating: 4.6,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
  },

  // Best Sellers
  {
    id: 9,
    name: "Sports Cap",
    price: 599,
    image: cap,
    category: "Accessories",
    rating: 4.5,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
  },
  {
    id: 10,
    name: "Summer Dress",
    price: 1799,
    image: dress,
    category: "Women",
    rating: 4.8,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
  },
  {
    id: 11,
    name: "Sunglasses",
    price: 999,
    image: sunglasses,
    category: "Accessories",
    rating: 4.7,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
  },
  {
    id: 12,
    name: "Premium Hoodie",
    price: 2199,
    image: hoodie,
    category: "Men",
    rating: 4.9,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
  },
];