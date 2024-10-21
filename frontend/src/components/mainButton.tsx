import './component.scss'

type Props = {
  title: string, 
  onClick?: any, 
  icon?: string,
  disabled?: Boolean
}

export default function MainButton({onClick, title, disabled = false, icon}: Props) {
  return (
    <button 
      // className={'mainButton' + `${disabled}`}
      className={`mainButton ${disabled ? "disable" : ""}`}
      onClick={onClick}
    >
      <div className='content'>
        {
          icon && <img src={icon} alt="icon" />
        }
        {title}
      </div>
    </button>
  )
}
