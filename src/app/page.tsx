"use client";
import React , { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';
import Stundenplan from './Components/Stundenplan';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Datepicker, DatepickerProps} from 'flowbite-react';

interface MyComboboxProps {
  people: { id: number; name: string }[];
}
function MyCombobox({ people }: MyComboboxProps) {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [query, setQuery] = useState('');

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        });
  const name = selectedPerson ? selectedPerson.name : ''
  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Input
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(person) => name}
      />
      <Combobox.Options>
        {filteredPeople.map((person) => (
          <Combobox.Option key={person.id} value={person}>
            {person.name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

const peopleGet = async () => {
  const response = await fetch('https://t7hfkh2l-5000.euw.devtunnels.ms/calendar/all/-');
  const data = await response.json();
  return data.map((person: { id: number; name: string }) => ({
    id: person.id,
    name: person.name,
    }));
}


async function fetchData() {
  const peopleData = await peopleGet();
  const people: { id: number; name: string; }[] = peopleData;
  console.log(people);
}

export default function Home() {
  const [klasse, setKlasse] = useState('bbm3h20m');
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setKlasse(event.target.value);
      event.target.value = '';
    }
  };
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
          <div className="p-6 mt-6 text-left border w-500 rounded-xl shadow-xl">
          <h1 className="text-6xl font-bold">
            Stundenplan
          </h1>
          <p className="mt-3 text-2xl">
            Gib dein Klassen oder ein Dozenten Kürzel ein.
          </p>
            <div className="flex items-center justify-between gap-4">
              <a href="/profile" style={{textAlign: 'left'}}><FontAwesomeIcon icon={faGear} size="lg" height={20}/></a>
              <a href="/profile" style={{textAlign: 'left'}}><FontAwesomeIcon icon={faPlus} size="lg" height={20}/></a>
              <Datepicker
                language="de-DE"
                datatype='Date'
                disabled={true}
                title='COMMING SOON'
              />
            </div>
            <input
              type="text"
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 mt-4 text-base text-black transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100 focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
            </input>
            <Stundenplan username={klasse.toLowerCase()}/>
          </div>
      </main>
    </div>
    </>
  );
};

