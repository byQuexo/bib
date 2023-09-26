"use client";
import React, {useState} from 'react';
import "../globals.css";
import { TextInput, Button, Modal, Label } from 'flowbite-react';
import { faCalendarDays, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



interface KalasurProps {
    von?: string;
    bis?: string;
    datum: Date;
    fach: string;
    raum?: string;
    thema?: string;
}

export const Klausuren: KalasurProps[] = [];

export default function Klausur() {
    const [klausuren, setKlausuren] = useState(Klausuren);
    const [openModal, setOpenModal] = useState<string | undefined>();
    const props = { openModal, setOpenModal };

    const newKlausur: KalasurProps = {
        von: '' || undefined,
        bis: '' || undefined,
        datum: new Date(),
        fach: '',
        raum: '' || undefined,
        thema: '' || undefined,
    }

    const checkValid = (klausur: KalasurProps) => {
        if (klausur.von != undefined && klausur.bis != undefined) {
            if (klausur.von >= klausur.bis) {
                return false;
            } else if (klausur.von >= "17:00" && klausur.bis < "08:00") {
                return false;
            } 
        }else if (klausur.datum.getDay() !== 6 || klausur.datum.getDay() !== 0 || klausur.datum < new Date(Date.now())){
            return false;
        }else {
            return true;
        }
        return true;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', minWidth: 300}}>
                <div style={{ width: '80%', maxWidth: '400px', height: '400px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', padding: '20px', fontSize: '1rem' }}>
                    <div className="mb-2 block flex flex-row" style={{marginBottom: "15pt"}}>
                        <h2 style={{ fontSize: '1.5rem' }}>Klausur</h2>
                        <Button color="primary noborder" onClick={() => props.setOpenModal('addKlausur')} style={{marginLeft: 'auto'}} ><FontAwesomeIcon icon={faPlus} size="lg"/></Button>
                    </div> 
                    <div className="flex flex-col gap-2" style={{height: '100%', overflowY: 'auto'}}>
                        {klausuren.map((klausur, index) => {
                            return (
                                <div key={index}>
                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-col gap-2" style={{width: '100%'}}>
                                            <div className="flex flex-row gap-2">
                                                <h2 style={{ fontSize: '1.5rem' }}>{klausur.fach}</h2>
                                                <h2 style={{ fontSize: '1.5rem' }}>{klausur.raum}</h2>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <h2 style={{ fontSize: '1.5rem' }}>{klausur.datum.toLocaleDateString()}</h2>
                                                <h2 style={{ fontSize: '1.5rem' }}>{klausur.von} - {klausur.bis}</h2>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <h2 style={{ fontSize: '1.5rem' }}>{klausur.thema}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Modal show={props.openModal === 'addKlausur'} size="sm" popup onClose={() => props.setOpenModal(undefined)}>
                <Modal.Header style={{marginBottom: "5pt", maxWidth: "50ch", wordBreak: "break-word"}}>Füge eine neue Klausur hinzu</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2 block">
                                <TextInput
                                    placeholder="Fach"
                                    onChange={(e) => {
                                        newKlausur.fach = e.target.value;
                                    }}
                                    style={{marginBottom: "10pt"}}
                                    name='fach'
                                    required
                                />
                            <div className="flex flex-row gap-4">
                                    <TextInput
                                        placeholder="Raum"
                                        onChange={(e) => {
                                            newKlausur.raum = e.target.value;
                                            
                                        }}
                                        style={{marginBottom: "10pt"}}
                                        name='raum'
                                        maxLength={10}
                                    />
                                    <TextInput
                                        placeholder="Datum"
                                        type='date'
                                        onChange={(e) => {
                                            if (e.target.valueAsDate) {
                                                newKlausur.datum = e.target.valueAsDate;
                                                console.log(newKlausur.datum);
                                            }
                                        }}
                                        style={{marginBottom: "10pt"}}
                                        name='datum'
                                        required
                                    />
                            </div>
                            <div className="flex flex-row gap-4">
                                <div style={{minWidth: "47.5%"}}>
                                    <TextInput
                                        type='time'
                                        placeholder='Von'
                                        onChange={(e) => {
                                            newKlausur.von = e.target.value;
                                            const bis = document.getElementsByName('bis')[0] as HTMLInputElement;
                                            //setzte bis auf von + 1:30h mit format hh:mm;
                                            const von = newKlausur.von.split(':');
                                            const bisH = parseInt(von[0]) + 1;
                                            const bisM = parseInt(von[1]) + 30;
                                            const str = `${bisH.toString().padStart(2, '0')}:${bisM.toString().padStart(2, '0')}`;
                                            bis.value = str;
                                            newKlausur.bis = str;
                                        }}
                                        name='von'
                                    />
                                </div>
                                <div style={{minWidth: "47.5%", marginBottom: "10pt"}}>
                                    <TextInput
                                        type='time'
                                        placeholder='Bis'
                                        name='bis'
                                        onChange={(e) => {
                                            newKlausur.bis = e.target.value;
                                        }}
                                        />
                                </div>
                            </div>
                            <TextInput
                                placeholder="Thema"
                                onChange={(e) => {
                                    newKlausur.thema = e.target.value;
                                }}
                                style={{marginBottom: "10pt"}}
                                name='thema'
                                />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button color="success" onClick={() => {
                        if (checkValid(newKlausur)) { 
                            setKlausuren([...klausuren, newKlausur]);
                            console.table(klausuren);
                            props.setOpenModal(undefined);
                        } else {
                            alert("Ungültige Eingabe");
                        }
                        }}>
                        Bestätigen
                    </Button>
                    <Button color="failure" onClick={() => props.setOpenModal(undefined)}>
                        Decline
                    </Button>
                    </Modal.Footer>
            </Modal>
        </>
    );
}
    