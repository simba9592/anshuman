import React, { ReactNode } from 'react'
import './component.scss'
import { Modal } from 'react-bootstrap';
import MainButton from './mainButton';
import CancelButton from './cancelButton';

type Props = {
  isOpen: boolean, 
  closeModal: any, 
  handleMain: any,
  title: string, 
  children: ReactNode,
  handleMainTitle: string
  deleteBtn?: boolean
  handleDelete?: any
}

export default function UpdateByAdmin({isOpen, closeModal, handleDelete,  handleMain, handleMainTitle, deleteBtn, title, children}: Props) {

  return (
    <Modal show={isOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <CancelButton title='Close' onClick={closeModal} />
        {
          deleteBtn === true && <MainButton title='Delete User' onClick={handleDelete} />
        }
        <MainButton title={handleMainTitle} onClick={handleMain} />
      </Modal.Footer>
    </Modal>
  )
}
