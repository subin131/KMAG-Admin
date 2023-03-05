import { Select } from 'antd';
import '../Modal/Modal.css';

const { Option } = Select;

export default function DefaultDropdown({values , ...props}) {
return(
  <div className='mt-1'>
    <Select className='mx-1' value={props.defaultValue || values[0].name} style={{ width: props.width || 120 }} {...props}>
        {values.map((item,i)=>(
            <Option value={item.option} key={i}>{item.name}</Option>
         ))}        
        </Select>
  </div>
)
}
