"use client";
import React, {useState} from 'react';
import { Button, Label, Textarea, Modal, TextInput } from 'flowbite-react';
import { faMinus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Klausur, { editKlausur, checkValid, storeKlausuren, getKlausuren, delKlausur, replaceKlausur} from './Klausur';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../../@/components/ui/card"

interface KalasurProps {
     id: number;
     von?: string;
     bis?: string;
     datum: Date;
     fach: string;
     raum?: string;
     thema?: string;
}

export default function Kelement(klausur: KalasurProps) {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [klausurEdit, setKlausurEdit] = useState<KalasurProps | undefined>();
    const props = { openModal, setOpenModal };
    const date = new Date(klausur.datum);
    const Editdate = klausurEdit?.datum;
 
    return (
          <>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle style={{maxWidth: "200pt", overflow: "hidden", height: "auto"}}>{klausur.fach}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground gap-3">
                        <div className="flex flex-row gap-3 text-xs">
                            <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{date.toLocaleDateString()}</Label>
                            <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{klausur.von} - {klausur.bis}</Label>
                            <Button color="black" key={klausur.id} style={{marginLeft: 'auto', width: '25pt', height: '15pt', border: 'none'}} id="trash" onClick={() => {
                                delKlausur(klausur.id);
                        }}><FontAwesomeIcon icon={faTrash} size="sm" color='red' id='trash'/></Button>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <span className="text-sm text-muted-foreground">Raum:</span>
                    <div className="flex flex-row gap-3 text-xs">
                        <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{klausur.raum}</Label>
                    </div>
                    <span className="text-sm text-muted-foreground">Thema:</span>
                    <div className="flex flex-row gap-3 text-xs">
                        <Textarea className='text-sm text-muted-foreground' style={{ fontSize: 10}} disabled>{klausur.thema}</Textarea>
                        <Button color="black" key={klausur.id} style={{marginLeft: 'auto', width: '25pt', height: '15pt', border: 'none'}} onClick={() => {
                            setKlausurEdit(editKlausur(klausur.id));
                            setOpenModal('editKlausur');
                        }}><FontAwesomeIcon icon={faPen} size="sm"/></Button>
                    </div>
                </CardContent>
            </Card>

            <Modal show={props.openModal === 'editKlausur'} size="sm" popup onClose={() => props.setOpenModal(undefined)}>
                <Modal.Header style={{marginBottom: "5pt", maxWidth: "50ch", wordBreak: "break-word"}}>Füge eine neue Klausur hinzu</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2 block">
                                <TextInput
                                    placeholder="Fach"
                                    // onChange={(e) => {
                                    //     console.log(e.target.value);
                                    //     newKlausur.fach = e.target.value;
                                    // }}
                                    defaultValue={klausurEdit?.fach}
                                    style={{marginBottom: "10pt"}}
                                    name='fach'
                                    maxLength={20}
                                    required
                                />
                            <div className="flex flex-row gap-4">
                                    <TextInput
                                        placeholder="Raum"
                                        defaultValue={klausurEdit?.raum}
                                        style={{marginBottom: "10pt"}}
                                        name='raum'
                                        maxLength={5}
                                    />
                                    <TextInput
                                        placeholder="Datum"
                                        type='date'
                                        // onChange={(e) => {
                                        //     if (e.target.valueAsDate) {
                                        //         newKlausur.datum = e.target.valueAsDate;
                                        //     }
                                        // }}
                                        defaultValue=''
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
                                        value={klausurEdit?.von}
                                        onChange={(e) => {
                                            klausurEdit!.von = e.target.value;
                                        }}
                                        name='von'
                                    />
                                </div>
                                <div style={{minWidth: "47.5%", marginBottom: "10pt"}}>
                                    <TextInput
                                        type='time'
                                        placeholder='Bis'
                                        value={klausurEdit?.bis}
                                        name='bis'
                                        onChange={(e) => {
                                            klausurEdit!.bis = e.target.value;
                                        }}
                                        />
                                </div>
                            </div>
                            <Textarea
                                placeholder="Thema"
                                // onChange={(e) => {
                                //     console.log(e.target.value);
                                //     newKlausur.thema = e.target.value;
                                // }}
                                style={{marginBottom: "10pt"}}
                                defaultValue={klausurEdit?.thema}
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

                        klausurEdit!.fach = fach.value;
                        klausurEdit!.datum = new Date(datum.value);
                        klausurEdit!.von = von.value;
                        klausurEdit!.bis = bis.value;
                        klausurEdit!.raum = raum.value;
                        klausurEdit!.thema = thema.value;
                        
                        if (checkValid(klausurEdit!)) {
                            replaceKlausur(klausurEdit!.id, klausurEdit!);
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