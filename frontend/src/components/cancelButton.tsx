import './component.scss'

type Props = {
  title: string, 
  onClick?: any, 
  icon?: string,
}

export default function CancelButton({onClick, title, icon}: Props) {
  return (
    <button 
      className="cancelButton"
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
