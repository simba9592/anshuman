import './component.scss'
import { IoIosSearch } from "react-icons/io";

type Props = {
  onChange?: any;
  onKeyDown?: any;
  value: String
}

export default function SearchInput({onChange, onKeyDown, value}: Props) {

  return (
    <div className="searchBox">
      <input type='text' placeholder='Search...' onChange={onChange} onKeyDown={onKeyDown} />
      <IoIosSearch size={20} color='#8A8F93' />
    </div>
  )
}
