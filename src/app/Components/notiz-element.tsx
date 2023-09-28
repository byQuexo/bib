"use client";
import React from 'react';
import { Button, Label, Textarea } from 'flowbite-react';
import { faMinus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { delKlausur } from './Klausur';
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
    const date = new Date(klausur.datum);
    return (
          <>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle style={{maxWidth: "200pt", overflow: "hidden"}}>{klausur.fach}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground gap-3">
                        <div className="flex flex-row gap-3 text-xs">
                            <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{date.toLocaleDateString()}</Label>
                            <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{klausur.von} - {klausur.bis}</Label>
                            <Button color="black" key={klausur.id} style={{marginLeft: 'auto', width: '25pt', height: '15pt', border: 'none'}} id="trash" onClick={() => {
                                //console.table(klausur);
                        }}><FontAwesomeIcon icon={faTrash} size="sm" color='red' id='trash'/></Button>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <span className="text-sm text-muted-foreground">Thema:</span>
                    <div className="flex flex-row gap-3 text-xs">
                        <Textarea className='text-sm text-muted-foreground' style={{ fontSize: 10}} disabled>{klausur.thema}</Textarea>
                        <Button color="black" key={klausur.id} style={{marginLeft: 'auto', width: '25pt', height: '15pt', border: 'none'}} onClick={() => {
                            //delKlausur(klausur.id);
                        }}><FontAwesomeIcon icon={faPen} size="sm"/></Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}