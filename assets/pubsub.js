const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  variantSelectChange: 'variant-select-change',
  variantChange: 'variant-change',
  cartError: 'cart-error',
  sectionRefreshed: 'section-refreshed',
};

let subscribers = {};

function subscribe(eventName, callback) {
  console.log('SUBSCRIBE', eventName, callback);
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}

function publish(eventName, data) {
  console.log('PUBLISH', eventName, data);
  if (subscribers[eventName]) {
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
  }
}
