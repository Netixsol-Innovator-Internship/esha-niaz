// Restaurant data structure
const restaurantData = {
  restaurant: {
    name: "McDonald's East London",
    slogan: "I'm lovin' it!",
    minimumOrder: 12,
    deliveryTime: "20-25 Minutes",
    openUntil: "3:00 AM"
  },
  
  products: [
    // Burgers
    {
      id: 1,
      name: "Royal Cheese Burger with extra Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/cold-drink.png",
      type: "burgers",
      category: "Burgers"
    },
    {
      id: 2,
      name: "The classics for 3",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
      price: 23.10,
      image: "images/burger-2.png",
      type: "burgers",
      category: "Burgers"
    },
    {
      id: 3,
      name: "Big Mac Deluxe",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
      price: 23.10,
      image: "images/burger-3.png",
      type: "burgers",
      category: "Burgers"
    },
    {
      id: 4,
      name: "McChicken Special",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/burger-4.png",
      type: "burgers",
      category: "Burgers"
    },
    {
      id: 5,
      name: "Quarter Pounder",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/burger-5.png",
      type: "burgers",
      category: "Burgers"
    },
    {
      id: 6,
      name: "Double Cheeseburger",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/burger-6.png",
      type: "burgers",
      category: "Burgers"
    },
    
    // Fries
    {
      id: 7,
      name: "Large Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/f-1.png",
      type: "fries",
      category: "Fries"
    },
    {
      id: 8,
      name: "Medium Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
      price: 23.10,
      image: "images/f-2.png",
      type: "fries",
      category: "Fries"
    },
    {
      id: 9,
      name: "Small Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
      price: 23.10,
      image: "images/f-3.png",
      type: "fries",
      category: "Fries"
    },
    {
      id: 10,
      name: "Curly Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/f-4.png",
      type: "fries",
      category: "Fries"
    },
    {
      id: 11,
      name: "Sweet Potato Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/f-5.png",
      type: "fries",
      category: "Fries"
    },
    {
      id: 12,
      name: "Loaded Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/f-6.png",
      type: "fries",
      category: "Fries"
    },
    
    // Cold Drinks
    {
      id: 13,
      name: "Coca Cola",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/c-1.png",
      type: "drinks",
      category: "Cold Drinks"
    },
    {
      id: 14,
      name: "Sprite",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
      price: 23.10,
      image: "images/c-2.png",
      type: "drinks",
      category: "Cold Drinks"
    },
    {
      id: 15,
      name: "Orange Juice",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
      price: 23.10,
      image: "images/c-3.png",
      type: "drinks",
      category: "Cold Drinks"
    },
    {
      id: 16,
      name: "Iced Tea",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/c-4.png",
      type: "drinks",
      category: "Cold Drinks"
    },
    {
      id: 17,
      name: "Milkshake",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/c-5.png",
      type: "drinks",
      category: "Cold Drinks"
    },
    {
      id: 18,
      name: "Water",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: 23.10,
      image: "images/c-6.png",
      type: "drinks",
      category: "Cold Drinks"
    }
  ],
  
  reviews: [
    {
      id: 1,
      name: "St Glx",
      location: "South London",
      rating: 5,
      date: "24th September, 2023",
      comment: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
      avatar: "images/review-profile.png"
    },
    {
      id: 2,
      name: "John Smith",
      location: "North London",
      rating: 4,
      date: "22nd September, 2023",
      comment: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
      avatar: "images/review-profile.png"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      location: "East London",
      rating: 5,
      date: "20th September, 2023",
      comment: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
      avatar: "images/review-profile.png"
    },
    {
      id: 4,
      name: "Mike Wilson",
      location: "West London",
      rating: 4,
      date: "18th September, 2023",
      comment: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
      avatar: "images/review-profile.png"
    }
  ],
  
  similarRestaurants: [
    {
      id: 1,
      image: "images/r-11.png",
    },
    {
      id: 2,
      image: "images/r-2.png",
    },
    {
      id: 3,
      image: "images/r-33.png",
    },
    {
      id: 4,
      image: "images/r-4.png",
    },
    {
      id: 5,
      name: "Dominos",
      image: "images/r-5.png",
      rating: 4.2
    },
    {
      id: 6,
      name: "Taco Bell",
      image: "images/r-6.png",
      rating: 3.9
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = restaurantData;
}
