import ical from 'next-ical';
import { userdata } from '../Components/Profile';




export function getICalFile(username?: string): Promise<Blob> {
    const user = loadUserData() ?? userdata;
    return new Promise((resolve, reject) => {
        const fetchAndStoreICalFile = async () => {
            const response = await fetch('https://intranet.bib.de/ical/' + user.token + '/' + username ?? '');
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

export function checkIfUpdateNeeded(username: string) {
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

export function checkIfFileExists(username: string) {
    const iCalDataString = localStorage.getItem('ical-' + username);
    if (iCalDataString) {
        return true;
    }
    return false;
}

export function DownloadAndStoreInLocalStore(username: string) {
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


export function getDataFromLocalStorage(username: string) {
    const iCalDataString = localStorage.getItem('ical-' + username);
    if (iCalDataString) {
        return iCalDataString;
    }
    return null;
}

export function getEventsFromICalData(iCalDataString: string) {
    const events = ical.sync.parseICS(iCalDataString);
    return events;
}

export interface Event {
    summary: string;
    start: Date;
    end: Date;
    ort?: string;
}


export function getAllFilesFromLocalStorage() {
    const files: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ical-')) {
            files.push(key);
        }
    }
    return files;
}

export function getEventsSummary(events: any): Event[] {
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


export function saveUserData(data: typeof userdata) {
    if(typeof window === 'undefined') return;
    localStorage.setItem('userdata', JSON.stringify(data));
}


export function loadUserData() {
    if(typeof window === 'undefined') return null;
    const userdata = localStorage.getItem('userdata');
    if (userdata) {
        return JSON.parse(userdata);
    }
    return null;
}