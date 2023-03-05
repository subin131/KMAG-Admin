import { Select } from "antd";
const { Option } = Select;

// input dropdown
export function InputDropdown({ values, ...props }) {
  return (
    <div className="mt-1">
      <Select
        className="mx-1"
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...props}
        style={{width: props.width || 200}}
        defaultValue={props.defaultValue || values[0].name}
      >
        {values.map((item, i) => (
          <Option value={item.option} key={i}>
            {item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
