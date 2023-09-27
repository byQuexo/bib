"use client";
import React from 'react';
import { Button, Label } from 'flowbite-react';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface KalasurProps {
    von?: string;
    bis?: string;
    datum: Date;
    fach: string;
    raum?: string;
    thema?: string;
}

export default function kelement(klausur: KalasurProps) {
    return (
        <>
            <div className="flex flex-row">
                
            </div>
        </>
    );
}