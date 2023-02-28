import './Contactos.scss';
import React from 'react';

const Contactos = (props) => {
    

    return (
        <div className='contacts__item'>
            <div className='contacts__picture'>
                <img className='contacts__img' src={props.contacto.foto} alt='Profile' />
            </div>
            <div className='contacts__info'>
                <p key={props.contacto.id}>{props.contacto.nombre}</p>
                <p>{props.contacto.telefono}</p>
                <button className='contacts__button'  onClick={() => props.deleteContact(props.contacto)}>Eliminar</button>
            </div>
        </div>
    );
}

const AgendaMemo = React.memo(Contactos);

export default AgendaMemo;