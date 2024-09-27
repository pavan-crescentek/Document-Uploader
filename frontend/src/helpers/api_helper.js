import axios from 'axios';
import { toast } from 'react-toastify';
import { api } from '../config';

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';

// content type
const token = JSON.parse(sessionStorage.getItem('authUser'))
  ? JSON.parse(sessionStorage.getItem('authUser')).token
  : null;
if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.response.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = error?.response?.data?.message
          ? error.response.data.message
          : 'Invalid credentials';
        break;
      case 404:
        message = 'Sorry! the data you are looking for could not be found';
        break;
      default:
        message = error.message || error;
    }
    // if (error.response.status === 401) {
    //   sessionStorage.removeItem('authUser');
    //   toast.error('Unauthorized user.');
    //   return (window.location.href = '/logout');
    // }
    if (message !== '') {
      toast.error(message);
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response
      .then((res) => {
        if (!res.status) {
          res?.message && toast.error(res.message);
          return res;
        }
        if (res.message) {
          toast.success(res.message);
        }
        return res;
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });
  };
  /**
   * post given data to url
   */
  create = (url, data, headers) => {
    const response = axios.post(url, data, { headers });
    return response
      .then((res) => {
        if (!res.status) {
          res.message && toast.error(res.message);
          return res;
        }
        if (res.message) {
          toast.success(res.message);
        }
        return res;
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    const response = axios.patch(url, data);
    return response
      .then((res) => {
        if (!res.status) {
          res.message && toast.error(res.message);
          return res;
        }
        if (res.message) {
          toast.success(res.message);
        }
        return res;
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });
  };

  put = (url, data) => {
    const response = axios.put(url, data);
    return response
      .then((res) => {
        if (!res.status) {
          res.message && toast.error(res.message);
          return res;
        }
        if (res.message) {
          toast.success(res.message);
        }
        return res;
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    const response = axios.delete(url, { ...config });
    return response
      .then((res) => {
        if (!res.status) {
          res.message && toast.error(res.message);
          return res;
        }
        if (res.message) {
          toast.success(res.message);
        }
        return res;
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem('authUser');
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, getLoggedinUser, setAuthorization };
