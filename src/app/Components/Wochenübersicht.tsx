"use client"
import React, { use } from "react"
import { useEffect, useState } from "react";
import ical, { CalendarResponse } from 'next-ical';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import "../globals.css";
import { userdata } from "./Profile";

export interface StundenplanProps {
  user: typeof userdata;
  date: Date;
}



export default function Wochenübersicht() {

}

