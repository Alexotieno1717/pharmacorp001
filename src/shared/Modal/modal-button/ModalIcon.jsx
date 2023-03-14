import React from 'react'

function ModalIcon({ target, label, onClick }) {
  return (
    <i data-bs-toggle="modal" data-bs-target={`#${target}`} onClick={onClick} style={{cursor: 'pointer'}}>{label}</i>
        
  )
}

export default ModalIcon