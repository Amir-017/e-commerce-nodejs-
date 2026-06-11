import fs from "fs";
const inputFile = "./bigDataProducts.json";
const outputFile = "./bigDataProducts.fixed.json";

const data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

const targetCategories = [
  "groceries",
  "tops",
  "home-decoration",
  "kitchen-accessories",
  "sports-accessories",
  "womens-dresses",
  "womens-jewellery"
];

const categoryBrandMap = {
  groceries: "FreshMart",
  tops: "FashionWear",
  "home-decoration": "HomeSpace",
  "kitchen-accessories": "KitchenPro",
  "sports-accessories": "SportZone",
  "womens-dresses": "Elegance",
  "womens-jewellery": "Jewelora"
};

const updated = data.products.map((product) => {
  const category = product.category;

  const hasBrandKey = Object.prototype.hasOwnProperty.call(product, "brand");

  // only target categories + only if brand doesn't exist at all
  if (targetCategories.includes(category) && !hasBrandKey) {
    product.brand = categoryBrandMap[category];
  }

  return product;
});

fs.writeFileSync(outputFile, JSON.stringify(updated, null, 2));

console.log("✅ Done! Brand field added only where missing completely");
export default updated;