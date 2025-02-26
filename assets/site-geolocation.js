const locationCookie = 'bb_location';
const locationDialog = '#location-dialog';
const shopCountry = window.Shopify.country;

function showLocationDialog() {
  const dialog = document.querySelector(locationDialog);
  if (dialog) dialog.show();
}

/**
 * Set the location cookie
 * max-age of 2592000 is 30 days
 * @param {string} country - The country to set the cookie to (US, CA, JP, KR, GB)
 */
function setLocationCookie(country = shopCountry) {
  document.cookie = `${locationCookie}=${country}; max-age=2592000`;
}

/**
 * Get the location from the cookie
 * @returns {string | null}
 */
function getLocationCookie() {
  const geolocationCookie = document.cookie.split('; ').find((row) => row.startsWith(`${locationCookie}=`));
  return geolocationCookie ? geolocationCookie.split('=')[1] : null;
}

/**
 * Get the location from the url
 * @returns {string | null}
 */
function getLocationFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('set-location');
}

/**
 * Get users location from IP address
 * @returns {string | null}
 */
async function getLocationFromIp() {
  const request = await fetch('/apps/bb-api/v1/geolocation', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error('Error:', error));

  if (request?.geolocation?.isoCode) {
    return request.geolocation.isoCode;
  }

  return null;
}

document.addEventListener('DOMContentLoaded', async function () {
  const locationFromUrl = getLocationFromUrl();

  // If location set from url, nothing else to do
  if (locationFromUrl) {
    setLocationCookie(locationFromUrl);
    console.log(`Location set to ${locationFromUrl} from url, nothing else to do.`);
    return;
  }

  const locationCookie = getLocationCookie();
  if (locationCookie) {
    if (locationCookie === shopCountry) {
      // Location set, and in the right place. Nothing else to do.
      console.log(`All good. Location set to ${locationCookie}, and on the ${shopCountry} site.`);
    } else {
      // Location set, but in the wrong place.
      console.log(`Wrong location. Location set to ${locationCookie}, but on the ${shopCountry} site.`);
      showLocationDialog();
    }
    return;
  }

  // No location set, get country from geolocation.
  const locationFromIp = await getLocationFromIp();
  if (locationFromIp) {
    if (locationFromIp === shopCountry) {
      // Location matches shop country, set the cookie so we don't have to do this again.
      console.log(`IP Location of ${locationFromIp} matches shop country of ${shopCountry}, setting cookie.`);
      setLocationCookie(locationFromIp);
    } else {
      // Location does not match shop country. Show dialog.
      console.log(`IP Location of ${locationFromIp} does not match shop country of ${shopCountry}, showing dialog.`);
      showLocationDialog();
    }
    return;
  }
});

/**
 * Proxy tests
 */
document.getElementById('proxy-1').addEventListener('click', function () {
  this.disabled = true;
  this.classList.add('loading');
  fetch('/apps/bb-api/v1/geolocation', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('api-response').value = JSON.stringify(data);
      this.disabled = false;
      this.classList.remove('loading');
    })
    .catch((error) => console.error('Error:', error));
});

document.getElementById('proxy-2').addEventListener('click', function () {
  this.disabled = true;
  this.classList.add('loading');
  fetch('/apps/bb-api/v1/open', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('api-response').value = JSON.stringify(data);
      this.disabled = false;
      this.classList.remove('loading');
    })
    .catch((error) => console.error('Error:', error));
});
