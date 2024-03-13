import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      console.log("response from doRequest", response.data);
  
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log("Error in use-hooks catch", err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {/* {err &&
              err.response &&
              err.response.data.errors.map((err, index) => (
                <li key={index}>{err.message}</li>
              ))} */}
            {err && <li>{err.message}</li>}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
