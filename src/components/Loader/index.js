import { TailSpin, ThreeDots } from "react-loader-spinner";
import "./loader.css"
import {Spinner} from 'react-bootstrap';

export const TailSpinLoader = () => {
  return (
    <div className='page_loader'>
        <Spinner animation="border" variant="secondary"/>
    </div>
  );
};
export const ThreeDotsLoader = () => {
  return(
  <div className="m-2" style={{display:"flex" , }}>
    <ThreeDots color="#00BFFF" height={60} width={60} />
  </div>)
};
