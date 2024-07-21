import { useState, useEffect } from 'react'
import {
    Grid, List, ListItemButton, ListItemIcon,
    ListItemText, Checkbox, Button, Paper
} from '@mui/material'
import styles from './styles.module.css'

export default function Transfer({ cursos, checked, left, right, setChecked, setLeft, setRight, modoModal }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [innerHeight, setInnerHeight] = useState(0)

    useEffect(() => {

        let cursosAux = []

        if (modoModal === 'I') {
            cursos.forEach(curso => {
                cursosAux.push(curso.id)
            })
            setLeft(cursosAux)
        }

        setInnerHeight(window.innerHeight)

        setDomLoaded(true)
    }, [])

    const handleToggle = (value) => {

        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)

        let itemFiltered = left.find(item => {
            return item === value
        })
        if (itemFiltered) {
            setRight(prevRight => [...right, value])

            setLeft(prevLeft => left.filter(item => {
                return item !== value
            }))
        } else {
            setLeft(prevLeft => [...left, value].sort())

            setRight(prevRight => right.filter(item => {
                return item !== value
            }))

        }

    }

    const customList = (items, direction) => (
        <div className={styles.list}>
            <Paper sx={{ width: 220, height: innerHeight <= 620 ? 200 : 250, marginTop: '20px', marginBottom: '10px', marginLeft: "14px", marginRight: "14px", overflow: 'auto', boxShadow: '0 0.5rem 0.5rem rgba(0, 0, 0, 0.1)' }}>
                <List dense component="div" role="list">
                    {items.map((item) => {
                        const labelId = `transfer-list-item-${item}-label`
                        const itemName = cursos.find(c => {
                            return c.id === item
                        }).nome
                        return (
                            <ListItemButton
                                key={item}
                                disabled={modoModal === 'E'}
                                role="listitem"
                                onClick={(e) => handleToggle(item)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(item) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${itemName}`} />
                            </ListItemButton>
                        )
                    })}
                </List>
            </Paper>
        </div>
    )

    return (
        <>
            {domLoaded &&
                <div className={styles.transfer}>
                    <div className={styles.title}>
                        <h2>Cursos</h2>
                    </div>

                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item>{customList(left, 'L')}</Grid>
                        <Grid item>{customList(right, 'R')}</Grid>
                    </Grid>
                </div>
            }
        </>
    )
}