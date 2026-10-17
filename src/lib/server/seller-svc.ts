/*
 * This file used to hold the whole seller-svc client. It now lives in ./api/
 * (one module per endpoint group); this re-export keeps older imports working.
 */
export { fetchHealth, sellerSvcUrl, useMocks, type Health } from './api/http.js';
