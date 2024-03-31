import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { validateSession } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import styles from './styles.module.css'
import { Button } from "@/components/ui/Button";
import ModalAgendamento from "./modal";

export default function Home() {

    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [optionLoginChecked, setOptionLoginChecked] = useState('P')

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    return (
        <>
            <Navbar user={user.name} />
            <Button color={'red'} onClick={() => setShowModal(true)} />
            {showModal &&
                <ModalAgendamento setShowModal={setShowModal} />
            }
        </>
    );
}