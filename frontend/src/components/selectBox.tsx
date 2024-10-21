import './component.scss'

type Props = {
  title: string, 
  icon: string,
  onClick: any, 
  className: string
}

export default function SelectBox({onClick, title, icon, className}: Props) {

  return (
    <div className={`selectBox ${className}`} onClick={onClick}>
      <div>
        <img src={icon} alt="icon" />
      </div>
      <div>{title}</div>
    </div>
  )
}
