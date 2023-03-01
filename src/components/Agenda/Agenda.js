import React from 'react';
import './Agenda.scss';
import AgendaMemo from '../Contactos/Contactos';
import { useDebounce } from 'use-debounce';

const Agenda = React.memo(() => {

    const API_URL = "http://localhost:3001/contactos";

    const [contactsList, setContactsList] = React.useState([]);

    const [searchText, setSearchText] = React.useState("");

    const [searchWithTime] = useDebounce(searchText, 500);

    const [newContact, setNewContact] = React.useState({
        nombre: "",
        telefono: "",
        foto: ""
    })

    const getContactsAPI = () => {
        fetch(API_URL)
          .then(response => response.json())
          .then(data => setContactsList(data));
    }

    React.useEffect(() => {
        searchWithTime?.length > 0 ?
        fetch( API_URL + "/?nombre_like=" + searchWithTime)
                .then((response) => response.json())
                .then((data) => {
                    setContactsList(data);
                    console.log(data);
                }) : getContactsAPI();
    }, [searchWithTime])

    React.useEffect(() => {
        getContactsAPI();
      }, []);

    const addContact = (event) => {
        event.preventDefault();

        const newContactTemp = {
            ...newContact,
            id: contactsList[contactsList.length - 1].id + 1    
        }

        console.log(newContactTemp);

        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(newContactTemp),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => response.json())
            .then(() => {
                getContactsAPI();
              // Limpiamos el formulario
              setNewContact({
                nombre: "",
                telefono: "",
                foto: ""
              });
            });
    }

    const deleteContact = React.useCallback((contact) => {
        fetch(`${API_URL}/${contact.id}`, {
          method: "DELETE"
        })
          .then(response => response.json())
          .then(() => getContactsAPI());
      }, []);

    return (
        <div className='contacts'>
            <h1>Mi agenda ({contactsList.length})</h1>
            {
                contactsList.map((contact) => {
                    return (
                        <AgendaMemo
                            contacto={contact}
                            deleteContact={ deleteContact }
                        />
                    )
                })
            }

            <div className='contacts__search'>
                <h2>Buscar</h2>
                <input placeholder='Escribe el nombre de un contacto'
                    value={ searchText }
                    onChange={(event) => setSearchText(event.target.value)}
                ></input>
            </div>

            <div className='contacts__add'>
                <form onSubmit={(event) => addContact(event)} className='contacts__formulary'>
                    <h2>Añadir un nuevo contacto</h2>
                    
                    <label className='contacts__field'>Nombre completo
                    <input placeholder='Nombre y apellidos' 
                        name="name" 
                        id="name" 
                        value={ newContact.nombre } 
                        onChange={(event) => setNewContact({
                            ...newContact,
                            nombre: event.target.value,
                        })}>
                    </input>
                    </label>
                    <label className='contacts__field'>Telefono
                    <input placeholder='Telefono' 
                        type='number'
                        name="numero" 
                        id="numero" 
                        value={ newContact.numero } 
                        onChange={(event) => setNewContact({
                            ...newContact,
                            telefono: event.target.value,
                        })}>
                    </input>
                    </label>
                    <label className='contacts__field'>URL de la foto
                    <input placeholder='http://...'
                        name="foto" 
                        id="foto" 
                        value={ newContact.foto } 
                        onChange={(event) => setNewContact({
                            ...newContact,
                            foto: event.target.value,
                        })}>
                    </input>
                    </label>
                    <button className='contacts__button--add' type="submit">Añadir contacto</button>
                </form>
            </div>
        </div>
    );
})

export default Agenda;