import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {IconButton, TextField} from '@material-ui/core'
import AddBox from '@material-ui/icons/AddBox'

export type AddItemFormSubmitHelperType = { setError: (error: string) => void, setTitle: (title: string) => void }
type AddItemFormPropsType = {
    addItem: (title: string, helper: AddItemFormSubmitHelperType) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(function ({addItem, disabled = false}: AddItemFormPropsType) {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = async () => {
        if (title.trim() !== '') {
            addItem(title, {setError, setTitle})
        } else {
            setError('Title is required')
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addItemHandler()
        }
    }

    return <div style={{padding: '0 5px 0 20px'}}>
        <TextField variant="outlined"
                   disabled={disabled}
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   style={{width:'220px'}}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled} style={{marginLeft: '5px'}}>
            <div style={{position:'absolute', right:"40px", top:'14px'}}><AddBox/></div>
        </IconButton>
        <div style={{height: '1px', fontSize: '13px', color: 'red', padding: '0 0 10px 10px'}}>{error}</div>
    </div>
})
