import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Invalid inputs...</h4>
          <ul>
            {err.response.data.errors.map((err) => (
              <li key={err.error}>{err.error}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export { useRequest };
