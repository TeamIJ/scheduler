import Head from 'next/head'
import { useState } from "react";
import { useRouter } from "next/router";
import styles from './styles.module.css'
import { Navbar } from '../../components/ui/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar user='Jacksom'/>
      <h1>Oi S2</h1>

    </div>
  )
}
