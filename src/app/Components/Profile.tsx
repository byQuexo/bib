"use client";
import React, { useState, useCallback } from 'react';
import "../globals.css";
import { HiX } from 'react-icons/hi';
import { MdAnnouncement } from 'react-icons/md';
import { loadUserData, saveUserData } from '../Functions/Functions';
import { Button, Modal, Banner, ToggleSwitch, Label, TextInput, Checkbox } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { faCircleInfo, faKey, faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { redirect } from 'next/dist/server/api-utils';

export const userdata = {
    token: '',
    refreshrate: 30,
    auto_refresh: false,
}

export default function Profile() {
    const user: typeof userdata = loadUserData() ?? userdata;
    const [openModal, setOpenModal] = useState<string | undefined>();
    const props = { openModal, setOpenModal };
    const [token, setToken] = useState('');
    const [refreshrate, setRefreshrate] = useState(user.refreshrate);
    const [auto_refresh, setAuto_refresh] = useState(user.auto_refresh);
    const [showToken, setShowToken] = useState(false);
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', minWidth: 300}}>
                <div style={{ width: '80%', maxWidth: '400px', height: '400px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', padding: '20px', fontSize: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Settings</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="token"
                                    value="Dein Token"
                                />
                            </div>
                            <TextInput
                                icon={() => <FontAwesomeIcon icon={faKey} size="lg"/>}
                                id="token"
                                defaultValue={user.token}
                                placeholder="YOUR TOKEN"
                                onChange={(e) => {
                                    setToken(e.target.value);
                                }}
                                required
                                type={showToken ? 'text' : 'password'}
                            />
                            <br />
                            <div className="flex items-center gap-2">
                                <Checkbox id='show' defaultChecked={user.auto_refresh} onChange={() => {
                                    setShowToken(!showToken);
                                }} style={{fontSize: '0.8rem', alignItems: 'center'}} placeholder='Show Token'/>
                                <Label 
                                    htmlFor='show'
                                    value='Show Token'
                                />
                            </div>
                            <br />
                            <ToggleSwitch
                                checked={auto_refresh}
                                label="Auto Refresh"
                                onChange={function () { setAuto_refresh(!auto_refresh) }}
                            />
                            <br />
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="refreshrate"
                                        value="Refreshrate"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button color="gray" onClick={() => {
                                            setRefreshrate(refreshrate - 15 > 15 ? refreshrate - 15 : 15);
                                        }
                                        }>-</Button>
                                        <p>{refreshrate}</p>
                                        <Button color="gray" onClick={() => {
                                            setRefreshrate(refreshrate + 15 < 120 ? refreshrate + 15 : 120);
                                        }
                                        }>+</Button>
                                    </div>
                                </div>
                                <span>Noch keinen Token ? ..<a href="https://intranet.bib.de/tiki-index.php?page=ical-access" className="inline font-small text-cyan-600 underline dark:text-cyan-500 underline-offset-2 decoration-600 dark:decoration-500 decoration-solid hover:no-underline">Token Erstellen</a></span>
                            </div>
                            <Button color="success" onClick={() => {
                                const checkToken = async () => {
                                    try {
                                        user.token = token;
                                        const response = await fetch('https://intranet.bib.de/ical/' + user.token + "/-");
                                        if (response.status === 200) {
                                            user.refreshrate = refreshrate;
                                            user.auto_refresh = auto_refresh;
                                            saveUserData(user);
                                            props.setOpenModal('check');
                                        }   
                                    } catch (error) {
                                        props.setOpenModal('error');
                                    }
                                }
                                checkToken();
                            }
                        }>Speichern</Button>        
                    </div>
                </div>
            </div>
            <Modal show={props.openModal === 'default'} onClose={() => props.setOpenModal(undefined)}>
                <Modal.Header>Anleitung zum Generieren eines Tokens</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400"></p>
                    </div>
                </Modal.Body>
            </Modal>

        <Modal show={props.openModal === 'check'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Token wurde gespeichert!!!!
            </h3>
            <div className="flex justify-center gap-4">
            <Button color="success" href='/'>
                Zurück zum Stundenplan
              </Button>
              <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                Weitere Einstellungen vornehmen.
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={props.openModal === 'error'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Der eigegebene Token ist nicht gültig!
            </h3>
            <div className="flex justify-center gap-4">
            <Button color="failure" href='/'>
                Zurück zum Stundenplan
              </Button>
              <Button color="success" onClick={() => props.setOpenModal(undefined)}>
                Erneut Versuchen
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
    );
}
