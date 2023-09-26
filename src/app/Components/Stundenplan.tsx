"use client"
import React, { use } from "react"
import { useEffect, useState } from "react";
import ical, { CalendarResponse } from 'next-ical';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import "../globals.css";
import { userdata } from "./Profile";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ClipLoader from "react-spinners/ClipLoader";
import { Datepicker } from 'flowbite-react';

function getICalFile(username: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const fetchAndStoreICalFile = async () => {
            const response = await fetch('http://localhost:5000/calendar/' + username);
            if (!response.ok) {
                return Promise.reject();
            }
            return await response.blob();
        };
        fetchAndStoreICalFile().then((blob) => {
            resolve(blob);
        }).catch((error) => {
            reject(error);
        });
    });
}

function checkIfUpdateNeeded(username: string) {
    const iCalDataString = localStorage.getItem('ical-' + username);
    const iCalDataTimestamp = localStorage.getItem('ical-' + username + '-timestamp');
    if (iCalDataString && iCalDataTimestamp) {
        const iCalDataTimestampNumber = parseInt(iCalDataTimestamp);
        const now = Date.now();
        const diff = now - iCalDataTimestampNumber;
        if (diff > (1000 * 60 * 2)) {
            return true;
        }
    }
    return false;
}

function checkIfFileExists(username: string) {
    const iCalDataString = localStorage.getItem('ical-' + username);
    if (iCalDataString) {
        return true;
    }
    return false;
}

function DownloadAndStoreInLocalStore(username: string) {
        const fetchAndStoreICalFile = async () => {
                try {
                    const iCalBlob = new Blob([await getICalFile(username)], { type: 'text/calendar' });
                    const iCalDataString: any = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsBinaryString(iCalBlob);
                    });
                    const icalstring = 'ical-' + username;
                    window.localStorage.setItem(icalstring, iCalDataString.toString());
                    window.localStorage.setItem(icalstring + '-timestamp', Date.now().toString());
                    if (iCalDataString) {
                        return iCalDataString;
                    }
                } catch (error) {
                    return null;
                }
            };
        fetchAndStoreICalFile();
}


function getDataFromLocalStorage(username: string) {
    const iCalDataString = localStorage.getItem('ical-' + username);
    if (iCalDataString) {
        return iCalDataString;
    }
    return null;
}

function getEventsFromICalData(iCalDataString: string) {
    const events = ical.sync.parseICS(iCalDataString);
    return events;
}

interface Event {
    summary: string;
    start: Date;
    end: Date;
    ort?: string;
}


function getAllFilesFromLocalStorage() {
    const files: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ical-')) {
            files.push(key);
        }
    }
    return files;
}

function getEventsSummary(events: any): Event[] {
    const eventObj: Event[] = [];
    let event: any = events;
    if (events) {
        for (let key in event) {
            if (event.hasOwnProperty(key)) { 
                eventObj.push({
                    summary: event[key].summary,
                    start: event[key].start,
                    end: event[key].end,
                    ort: event[key].location
                });
            }
        }
    }
    return eventObj;
}

interface EventBlock {
    date: Date;
    start: Date;
    end: Date;
    event: string;
    ort?: string;
}

function makeElementForEvent(events: Event[], currentDate: Date, Klasse: string): JSX.Element {

        const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.start);
            return eventDate.getDate() === currentDate.getDate() && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
        });


        const eventBlocks: EventBlock[] = [];

        const eventsSortedByDate = filteredEvents.sort((a, b) => {
            return a.start.getTime() - b.start.getTime();
        });

        eventsSortedByDate.forEach((event) => {
            const eventDate = new Date(event.start);
            const eventBlock = {
                date: eventDate,
                start: new Date(event.start),
                end: new Date(event.end),
                event: event.summary,
                ort: event.ort
            };
            eventBlocks.push(eventBlock);
        });

        const blocks = ["8:00 - 9:30", "9:45 - 11:15", "11:30 - 13:00", "13:45 - 15:15", "15:30 - 17:00"];

        const eventElements: JSX.Element[] = [];

        interface EventBlockWithSummary {
            event: string;
            ort?: string;
            block: string;
        }

        const eventBlocksWithSummary: EventBlockWithSummary[] = [];
        eventBlocks.forEach((eventBlock, index) => {
          const eventBlockWithSummary = {
            event: eventBlock.event,
            ort: eventBlock.ort,
            block: `${eventBlock.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${eventBlock.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
          };
          eventBlocksWithSummary.push(eventBlockWithSummary);
        });
        const specialEventBlocksWithSummary: EventBlockWithSummary[] = [];
        const eventBlocksWithSummaryAndEmptyBlocks: EventBlockWithSummary[] = [];
        blocks.forEach((block) => {
            const eventBlock = eventBlocksWithSummary.find((eventBlock) => {
                return eventBlock.block === block;
            });
            if(eventBlocksWithSummary.length >= 1 && !blocks.includes(eventBlocksWithSummary[0].block)) {
              specialEventBlocksWithSummary.push({
                  event: eventBlocksWithSummary[0].event,
                  ort: eventBlocksWithSummary[0].ort,
                  block: eventBlocksWithSummary[0].block,
              });
            }
            if (eventBlock) {
                eventBlocksWithSummaryAndEmptyBlocks.push(eventBlock);
            } else {
                eventBlocksWithSummaryAndEmptyBlocks.push({
                    event: "-",
                    block: block,
                });
            }
        });

        eventBlocksWithSummaryAndEmptyBlocks.splice(3, 0, {
            event: "Mittagspause",
            block: "13:00 - 13:45"
        });

        const specialEventBlocksWithSummaryWithoutDuplicates: EventBlockWithSummary[] = [];
        specialEventBlocksWithSummary.forEach((eventBlock) => {
          const eventBlockWithSummary = specialEventBlocksWithSummaryWithoutDuplicates.find((eventBlockWithSummary) => {
            return eventBlockWithSummary.block === eventBlock.block && eventBlockWithSummary.event === eventBlock.event;
          });
          if (!eventBlockWithSummary) {
            specialEventBlocksWithSummaryWithoutDuplicates.push(eventBlock);
          }
        });

        eventBlocksWithSummaryAndEmptyBlocks.forEach((eventBlock, index) => {
          const eventElement = (
            <div key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: '2pt', padding: '1pt', marginRight: '2pt'}}>
              <span>{eventBlock.block}</span>
              <span style={{ marginLeft: '2pt', wordWrap: 'break-word', maxWidth: '50ch'}}>{eventBlock.event}</span>
              <span style={{ marginLeft: '2pt' }}>{eventBlock.ort}</span>
            </div>
          );
          eventElements.push(eventElement);
        });

        const specialeventElements: JSX.Element[] = [];

        specialEventBlocksWithSummaryWithoutDuplicates.forEach((eventBlock, index) => {
          const eventElement = (
            <div key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: '2pt', padding: '1pt', marginRight: '2pt', marginTop: '5pt'}}>
              <span style={{ color: 'red' }}>SPECIAL</span>
              <span style={{ marginLeft: '2pt' }}>{eventBlock.block}</span>
              <span style={{ marginLeft: '2pt', wordWrap: 'break-word', maxWidth: '50ch'}}>{eventBlock.event}</span>
              <span style={{ marginLeft: '2pt' }}>{eventBlock.ort}</span>
            </div>
          );
          specialeventElements.push(eventElement);
        });

        const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        return (
            <>
              <div key="1" style={{ display: 'flex', flexDirection: 'row', marginBottom: '4pt', padding: '1pt', marginRight: '2pt' }}>
                <h2 style={{ textAlign: 'left', width: '50%', fontSize: '15pt'}}>{weekdays[currentDate.getDay()]}</h2>
                <h2 style={{ textAlign: 'right', width: '50%',fontSize: '15pt'}}>{currentDate.toLocaleDateString()}</h2>
              </div>
                {eventElements} 
                {specialeventElements.length === 0 ? null : specialeventElements}
            </>
        );
      }

export default function Stundenplan(username: any, specDate?: Date) {
    const [currentWeek, setCurrentWeek] = useState(0);
    const [icalDataString, setIcalDataString] = useState("");
    const [loading, setLoading] = useState(true);
    const [dataAvailable, setDataAvailable] = useState(false);
    const [currentDay, setCurrentDay] = useState(new Date(Date.now()));

    useEffect(() => {
      if (userdata.auto_refresh) {
        const checkAndUpdate = async () => {
            const files = getAllFilesFromLocalStorage();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storedUsername = file.replace('ical-', '');
                if (checkIfUpdateNeeded(storedUsername)) {
                    await DownloadAndStoreInLocalStore(storedUsername);
                }
            }
            setLoading(false);
        };
        checkAndUpdate();
        const intervalId = setInterval(checkAndUpdate, 1000 * 60 * 30);

        return () => clearInterval(intervalId);
      }else {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
        if (checkIfFileExists(username.username)) {
            const iCalDataString = getDataFromLocalStorage(username.username);
            if (iCalDataString) {
                setIcalDataString(iCalDataString);
                setDataAvailable(true); 
                setCurrentWeek(0)
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        } else {
            setLoading(true);
            setCurrentWeek(0)
            try {
              const getfile = DownloadAndStoreInLocalStore(username.username);
              Promise.resolve(getfile).then(() => {
                setTimeout(() => {
                    const iCalDataString = getDataFromLocalStorage(username.username);
                    if (iCalDataString != null) {
                        setIcalDataString(iCalDataString);
                        setDataAvailable(true); 
                        setLoading(false);
                    }else {
                      setLoading(false);
                      setDataAvailable(false); 
                    }
                }, 1000);
            });
            }catch (error) {
                setDataAvailable(false); 
                console.error('Error parsing iCal data:', error);
            }

        }
    }, [username]);

    const nextDay = () => {
        const nextDay = new Date(currentDay);
        nextDay.setDate(nextDay.getDate() + 1);
        setCurrentDay(nextDay);
    };

    const previousDay = () => {
        const previousDay = new Date(currentDay);
        previousDay.setDate(previousDay.getDate() - 1);
        setCurrentDay(previousDay);
    };
    return (
      <>  
      <br />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '9pt', marginBottom: '9pt'}} className="inline-flex">
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-l" onClick={previousDay}><FontAwesomeIcon icon={faArrowLeft} size="lg" height={20}/></button>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-r" onClick={nextDay}><FontAwesomeIcon icon={faArrowRight} size="lg" height={20}/></button>
                </div>
            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20pt'}}>
                    <ClipLoader color="#000000" loading={loading} size={75} />
                </div>
            ) : 
              (dataAvailable ? 
                (
                    makeElementForEvent(
                        getEventsSummary(getEventsFromICalData(icalDataString)),
                        currentDay,
                        username.username
                    ) 
                ) : (
                    <p>KEINE DATEN VERFÜGBAR</p>
                )
            )}
        </>
    );
}
  