// Axios dependencies for GET/POST requests
const axios = require('axios');

// Set base URL for "development" environment
if (process.env.NODE_ENV === "development") {
  var instance = axios.create({
      baseURL: `http://localhost:${process.env.REACT_APP_DEV_PORT}`,
      timeout: 2000
    });
} else {
  var instance = axios.create({
      timeout: 2000
    });
}

let helpers = {

  getStore(storeID) {
    return instance.get('api/store/' + storeID)
  },

  getStoreData(searchCity) {
    console.log('getStoreData called', searchCity);
    return new Promise((resolve, reject) => {
        let locationData = undefined;
        instance.get(`/api/store-marker/${searchCity}`)
            .then((res) => {
              locationData = this.buildDataLayer(res);
              this.bindStoreData(res.data);                  
                console.log(`This location data was just built from the db: ${JSON.stringify(locationData)}`);
                resolve(locationData);
                
            })            
    });
},

  getPublicReview(sellerId) {
    return instance.get('./../api/review/' + sellerId)
  },

  logIn(credentials) {
    return instance.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    }
    )
  },

  signup(credentials) {
    return instance.post('/auth/signup', {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password
    }
    )
  },

  getUser(id, token) {
    return instance.get(`/api/user/${id}`, {
      headers: {
        authorization: token
      }
    });
  },

  saveStore(storeID, storeData) {
    return instance.put("api/store/" + storeID, storeData)
  },

  // Randy's routes
  getUserSecure(id, token) {
    return instance.get(`./../secure/user/${id}`, {
      headers: {
        authorization: token
      }
    });
  },

  postReview(sellerId,review,token) {
    return instance.post(`./../secure/review/${sellerId}`,{
      review: review.review,
      rating: review.rating,
      customerFirstName: review.customerFirstName,
      customerLastName: review.customerLastName,
      customerId: review.customerId,
      storeName: review.storeName,
      sellerId: review.sellerId
    }, {
      headers: {
        authorization: token
      }
    });
  },

  placeOrder(storeId, order, token) {
    return instance.post(`./../secure/order/${storeId}`, {
      customerId: order.customerId, //same as the ID from the Customer model
      sellerId: order.sellerId, //same as the ID from the Seller collection
      storeId: order.storeId,
      items: order.items,
      orderTotal: order.orderTotal,
      buyerFirstName: order.buyerFirstName,
      buyerLastName: order.buyerLastName,
      sellerFirstName: order.sellerFirstName,
      sellerLastName: order.sellerLastName
    }, {
      headers: {
        authorization: token
      }
    })
  },

  bookmarkStore(storeData, token) {
    return instance.post(`./../secure/bookmark/`, {
      userId: storeData.userId,
      userFirstName: storeData.userFirstName,
      userLastName: storeData.userLastName,
      storeId: storeData.storeId,
      sellerId: storeData.sellerId,
      storeName: storeData.storeName,
      storeLocation: storeData.storeLocation,
    }, {
      headers: {
        authorization: token
      }
    })
  },

  removeBookmark(storeData, token) {
    return instance({
      method: 'delete',
      url: `./../secure/bookmark/`,
      data: {
        userId: storeData.userId,
        storeId: storeData.storeId,
        sellerId: storeData.sellerId,
      },
      headers: {
        authorization: token
      }
    });
  },

  getPublicStore(sellerId) {
    return instance.get('./../api/store/' + sellerId)
  },

  getOrders(sellerID) {
    return instance.get('api/order/' + sellerID);
  },

  getOrdersCustomer(ID) {
    return instance.get('./../api/order/' + ID);
  },

  updateOrderStatus(sellerID, newOrder){
    return instance.put('api/order/' + sellerID, newOrder);
  },

  updateOrderStatusCustomer(sellerID, newOrder){
    return instance.put('./../api/order/' + sellerID, newOrder);
  }
}

// Export API Helper
module.exports = helpers;