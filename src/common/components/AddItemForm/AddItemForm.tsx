import React, { ChangeEvent, KeyboardEvent, useState, FC, memo } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { AddBox } from '@mui/icons-material';

interface PropsType {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm: FC<PropsType> = memo(function ({addItem, disabled = false}) {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== '') {
            addItem(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
        setTimeout(()=>{
            setError(null)
        },4000)

    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItemHandler();
        }
    }

    return <div className="relative" >
        <TextField variant="outlined"
                   fullWidth
                   disabled={disabled}
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
        />
        <div className='absolute right-[-1px] top-[8px]'>
            <IconButton color="primary"
                        onClick={addItemHandler}
                        disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    </div>
})
