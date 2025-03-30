// api/status.js
import Axios from "libs/axios";

const CheckGetEndpoint = async (path) => {
  const response = await Axios.base().get(path, { 
    timeout: 3000,
    validateStatus: () => true
  });

  if (response.status) {
    return { status: 'online' };
  } else {
    return { status: 'offline' };
  }
};

const CheckPostEndpoint = async (path) => {
  const response = await Axios.base().post(path, {}, { 
    timeout: 3000,
    validateStatus: () => true
  });

  if (response.status) {
    return { status: 'online' };
  } else {
    return { status: 'offline' };
  }
};

const CheckPutEndpoint = async (path) => {
  const response = await Axios.base().put(path, {}, { 
    timeout: 3000,
    validateStatus: () => true
  });

  if (response.status) {
    return { status: 'online' };
  } else {
    return { status: 'offline' };
  }
};

const CheckDeleteEndpoint = async (path) => {
  const response = await Axios.base().delete(path, { 
    timeout: 3000,
    validateStatus: () => true
  });

  if (response.status) {
    return { status: 'online' };
  } else {
    return { status: 'offline' };
  }
};

const CheckPatchEndpoint = async (path) => {
  const response = await Axios.base().patch(path, {}, { 
    timeout: 3000,
    validateStatus: () => true
  });

  if (response.status) {
    return { status: 'online' };
  } else {
    return { status: 'offline' };
  }
};

export {
  CheckGetEndpoint,
  CheckPostEndpoint,
  CheckPutEndpoint,
  CheckDeleteEndpoint,
  CheckPatchEndpoint
};