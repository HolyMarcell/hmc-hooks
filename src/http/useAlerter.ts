import {useState} from "react";


export interface AlerterProps {
  msg: string;
}

export interface AlerterApi {
  now: () => void;
  response?: string;
}
export const useAlerter = ({msg}: AlerterProps):AlerterApi => {

  const [response, setResponse] = useState(null);

  const alert = () => {
    console.log('We now alert a our message');
    const input = window && window.prompt && window.prompt(msg);
    setResponse(input);
  }

  return {
    now: alert,
    response
  };
}
