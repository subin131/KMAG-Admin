import { Select } from 'antd';
import '../Modal/Modal.css';

const { Option } = Select;

export default function NormalDropdown({values , ...props}) {
  let selectValues;
  if(values){
    let newValues = [...values];
    newValues?.shift();
    let sortedValues = newValues?.sort((a, b) => a.name.localeCompare(b.name));
    selectValues = [values[0],...sortedValues];
  }
return(
  <div className='mt-1'>
    <Select className='mx-1' defaultValue={props.defaultValue || values[0].name} style={{ width: props.width || 120 }} {...props}>
        {selectValues?.map((item,i)=>(
            <Option value={item.option} key={i}>{item.name}</Option>
         ))}        
        </Select>
  </div>
)
}
