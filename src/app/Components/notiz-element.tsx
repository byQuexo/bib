"use client";
import React from 'react';
import { Button, Label } from 'flowbite-react';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Separator } from "../../../@/components/ui/separator";

interface KalasurProps {
     von?: string;
     bis?: string;
     datum: Date;
     fach: string;
     raum?: string;
     thema?: string;
}

export default function Kelement(klausur: KalasurProps) {
    return (
        <>
            <div className="flex flex-row gap-2 border" style={{borderRadius: '10px', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)', padding: '20px', maxWidth: '94%', marginLeft: '1pt', marginRight: '2pt', marginTop: '5pt', maxHeight: "50pt"}}>
                <div className="flex flex-col" style={{maxWidth: '70%'}}>
                    <Label className='text-lg' style={{maxWidth: "25ch"}}>{klausur.fach}</Label>
                    <div className="flex flex-row gap-3 text-xs">
                        <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{klausur.datum.toLocaleDateString()}</Label>
                        <Label className='text-sm text-muted-foreground' style={{ fontSize: 10}}>{klausur.von} - {klausur.bis}</Label>
                    </div>
                </div>
                <Button color="failure" name="delete" style={{marginLeft: 'auto', width: '25pt', height: '15pt'}} onClick={() => {
                    console.log("delete");

                }}><FontAwesomeIcon icon={faMinus} size="sm"/></Button>
            </div>
        </>
    );
}