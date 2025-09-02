export const endpoints = {
  // AUTH
  login: '/auth/login',
  register: '/auth/signup',
  me: '/users/me',
  updateMe: '/users/me',

  // CARS (live auctions)
  liveAuctions: '/cars/live',
  carById: (id) => `/cars/${id}`,
  myCars: '/cars/my',
  endAuction: (id) => `/cars/${id}/end`, // POST

  createCar: '/cars',

  // BIDS
  bidsForCar: (carId) => `/bids/car/${carId}`,
  myBids: '/bids/me',
  placeBid: '/bids', // POST { carId, amount }

  // NOTIFICATIONS
  notifications: 'notifications/me',
  markNotificationRead: (id) => `/notifications/${id}/read`,
};
