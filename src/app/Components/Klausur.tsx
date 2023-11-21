"use client";
import React, {useState, useEffect, use} from 'react';
import "../globals.css";
import { TextInput, Button, Modal, Label, Textarea, Breadcrumb} from 'flowbite-react';
import { faCalendarDays, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import Kelement from './notiz-element';
import { Particles } from '.';

interface KalasurProps {
    id: number;
    von?: string;
    bis?: string;
    datum: Date;
    fach: string;
    raum?: string;
    thema?: string;
}

export function getKlausurbyId(id: number): KalasurProps | undefined {
    const klausuren = getKlausuren();
    return klausuren.find((k: KalasurProps) => k.id === id);
} 

export function editKlausur(id: number): KalasurProps | undefined {
    const klausuren = getKlausuren();
    return klausuren.find((k: KalasurProps) => k.id === id);
}

export function getKlausuren(): KalasurProps[] {
    let klausur: string | null = null;
    if (typeof window !== 'undefined') {
        klausur = localStorage.getItem('klausuren');
    }
    if (klausur) {
        return JSON.parse(klausur) as KalasurProps[];
    }
    return [];
}

export function delKlausur(id: number) {
    const klausuren = getKlausuren();
    const newKlausuren = klausuren.filter((klausur: KalasurProps) => klausur.id !== id);
    storeKlausuren(newKlausuren);
}

export function replaceKlausur(id: number, klausur: KalasurProps) {
    //ersetzte die alte klausur mit der neuen klausur mit der id
    const klausuren = getKlausuren();
    const newKlausuren = klausuren.filter((klausur: KalasurProps) => klausur.id !== id);
    storeKlausuren([...newKlausuren, klausur]);
}

export function storeKlausuren(klausuren: KalasurProps[]){
    localStorage.setItem('klausuren', JSON.stringify(klausuren));
}

export const checkValid = (klausur: KalasurProps) => {
    if(klausur.von !== '' && klausur.bis !== '') {
        klausur.von = "08:00";
        klausur.bis = "09:30";
    }
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

export const Klausuren: KalasurProps[] = [];

export default function Klausur() {
    const [klausuren, setKlausuren] = useState(getKlausuren());
    const [von, setVon] = useState(new Date(new Date().setHours(8, 0, 0, 0)).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}));
    const [bis, setBis] = useState(new Date(new Date().setHours(9, 30, 0, 0)).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}));
    
    const [openModal, setOpenModal] = useState<string | undefined>();
    const props = { openModal, setOpenModal };

    const newKlausur: KalasurProps = {
        id: klausuren.length + 1,
        von: '' || undefined,
        bis: '' || undefined,
        datum: new Date(),
        fach: '',
        raum: '',
        thema: '',
    }

    


    useEffect(() => {
        setKlausuren(getKlausuren());
    }
    , [getKlausuren()]);

    klausuren.sort((a, b) => {
        if (a.datum > b.datum) {
            return 1;
        } else if (a.datum < b.datum) {
            return -1;
        } else {
            return 0;
        }
    });

    return (
        <>
        <Particles />
        <Breadcrumb aria-label="Solid background breadcrumb example" className='fixed bg-gray-50 px-5 py-3 dark:bg-gray-900'>
            <Breadcrumb.Item href="/">
                <p>
                Home
                </p>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                Klausuren 
            </Breadcrumb.Item>
        </Breadcrumb>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', minWidth: 300}}>
                <div style={{ width: '80%', maxWidth: '400px', height: '600px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', padding: '20px', fontSize: '1rem' }}>
                    <div className="mb-2 block flex flex-row" style={{marginBottom: "15pt"}}>
                        <h2 style={{ fontSize: '1.5rem' }}>Klausur</h2>
                        <Button color="primary noborder" onClick={() => props.setOpenModal('addKlausur')} style={{marginLeft: 'auto'}} ><FontAwesomeIcon icon={faPlus} size="lg"/></Button>
                    </div> 
                    <div className="flex flex-col gap-2" style={{height: '90%', overflowY: 'auto'}}>
                        <ScrollArea className="rounded-md border h-75 w-65">
                            {klausuren.length === 0 ? 
                                <div className="flex flex-col justify-center items-center h-full">
                                    <Label className="text-lg text-muted-foreground">Keine Klausuren</Label>
                                </div>
                                :
                                <div className='flex flex-col gap-2'>
                                    {klausuren.map((klausur, index) => {
                                        return (
                                            <div key={index}>
                                                <Kelement {...klausur} />
                                            </div>        
                                        );
                                    })}
                                </div>
                            }
                        </ScrollArea>
                    </div>
                </div>
            </div>
            <Modal show={props.openModal === 'addKlausur'} size="sm" popup onClose={() => props.setOpenModal(undefined)}>
                <Modal.Header style={{marginBottom: "5pt", maxWidth: "50ch", wordBreak: "break-word"}}>Füge eine neue Klausur hinzu</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2 block">
                                <TextInput
                                    placeholder="Fach"
                                    style={{marginBottom: "10pt"}}
                                    name='fach'
                                    maxLength={20}
                                    required
                                />
                            <div className="flex flex-row gap-4">
                                    <TextInput
                                        placeholder="Raum"
                                        style={{marginBottom: "10pt"}}
                                        name='raum'
                                        maxLength={5}
                                    />
                                    <TextInput
                                        placeholder="Datum"
                                        type='date'
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
                                        value={von}
                                        onChange={(e) => {
                                            newKlausur.von = e.target.value;
                                            setVon(e.target.value);
                                        }}
                                        name='von'
                                    />
                                </div>
                                <div style={{minWidth: "47.5%", marginBottom: "10pt"}}>
                                    <TextInput
                                        type='time'
                                        placeholder='Bis'
                                        value={bis}
                                        name='bis'
                                        onChange={(e) => {
                                            newKlausur.bis = e.target.value;
                                            setBis(e.target.value);
                                        }}
                                        />
                                </div>
                            </div>
                            <Textarea
                                placeholder="Thema"
                                style={{marginBottom: "10pt"}}
                                name='thema'
                                />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button color="success" onClick={() => {
                        const fach = document.getElementsByName('fach')[0] as HTMLInputElement;
                        const datum = document.getElementsByName('datum')[0] as HTMLInputElement;
                        const von = document.getElementsByName('von')[0] as HTMLInputElement;
                        const bis = document.getElementsByName('bis')[0] as HTMLInputElement;
                        const raum = document.getElementsByName('raum')[0] as HTMLInputElement;
                        const thema = document.getElementsByName('thema')[0] as HTMLInputElement;

                        newKlausur.fach = fach.value;
                        newKlausur.datum = new Date(datum.value);
                        newKlausur.von = von.value;
                        newKlausur.bis = bis.value;
                        newKlausur.raum = raum.value;
                        newKlausur.thema = thema.value;

                        setVon(new Date(new Date().setHours(8, 0, 0, 0)).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}));
                        setBis(new Date(new Date().setHours(9, 30, 0, 0)).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}));
                        
                        if (checkValid(newKlausur)) {
                            console.table(newKlausur);
                            storeKlausuren([...klausuren, newKlausur]);
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
    