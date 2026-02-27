export async function getProducts() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/shop/products/', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    return [
      {
        id: 1,
        name: "Angel Chocolate Barsss",
        intro: "Heavenly chocolate bars crafted for perfection.",
        description: "Experience the divine taste of our Angel Chocolate Bars. Made with the finest cocoa beans and a touch of magic, these bars offer a smooth, velvety texture that melts in your mouth.",
        image: "/img/products/item-4.png",
        price: 150,
        variants: [
          {id: 1, name: "Small", gram: 50, price: 150, image: ["/img/products/item-9.png", "/img/products/item-5.png"]},
          {id: 2, name: "Medium", gram: 100, price: 280, image: ["/img/products/item-7.png", "/img/products/item-6.png"]},
          {id: 3, name: "Large", gram: 200, price: 500, image: ["/img/products/item-8.png", "/img/products/item-9.png"]},
        ]
      },
      {
        id: 2,
        name: "Pistachio Kunafa",
        intro: "A crunchy, creamy delight inspired by tradition.",
        description: "Our Pistachio Kunafa chocolate blends the crunch of traditional Kunafa with premium chocolate and rich pistachio cream. A true masterpiece of texture and flavor.",
        image: "/img/products/item-5.png",
        price: 350,
        variants: [
          {id: 1, name: "Standard", gram: 150, price: 350, image: ["/img/products/item-5.png"]},
        ]
      },
      {
        id: 3,
        name: "Melova Dates Chocolate",
        intro: "Nature's candy meets luxury chocolate.",
        description: "Premium dates stuffed with roasted nuts and coated in our signature milk chocolate. A perfect balance of sweetness and crunch.",
        image: "/img/products/item-6.png",
        price: 200,
        variants: [
          {id: 1, name: "Box of 6", gram: 100, price: 200, image: ["/img/products/item-6.png"]},
          {id: 2, name: "Box of 12", gram: 200, price: 380, image: ["/img/products/item-6.png"]},
        ]
      },
      {
        id: 4,
        name: "Melova Dates Chocolate ",
        intro: "Intense dark chocolate with sweet dates.",
        description: "For those who love it bold. Selected dates coated in 70% dark chocolate.",
        image: "/img/products/item-7.png",
        price: 220,
        variants: [
          {id: 1, name: "Box of 6", gram: 100, price: 220, image: ["/img/products/item-7.png"]},
        ]
      },
      {
        id: 5,
        name: "Melova Dates Chocolate ",
        intro: "Creamy white chocolate date delights.",
        description: "Luscious white chocolate coating over premium dates.",
        image: "/img/products/item-8.png",
        price: 220,
        variants: [
          {id: 1, name: "Box of 6", gram: 100, price: 220, image: ["/img/products/item-8.png"]},
        ]
      },
      {
        id: 6,
        name: "Lububu Mystery Chocolate",
        intro: "A surprise in every bite.",
        description: "Dare to try the Lububu Mystery Chocolate? A unique blend of exotic flavors that will surprise your taste buds.",
        image: "/img/products/item-9.png",
        price: 180,
        variants: [
          {id: 1, name: "Bar", gram: 80, price: 180, image: ["/img/products/item-9.png"]},
        ]
      }
    ];
  }
}
