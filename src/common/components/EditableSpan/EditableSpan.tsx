import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField';
import {useSelector} from "react-redux";
import {selectStatus} from "@app/app/selectors";

type PropsType = {
    value: string
    onChange: (newValue: string) => void
}

export const EditableSpan: FC<PropsType> = memo(function ({value, onChange}) {

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(value);
    const status = useSelector(selectStatus)

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(value);
    }
    const activateViewMode = () => {
        setEditMode(false)
        onChange(title)
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            setEditMode(false)
            onChange(title)
        }
    }

    return editMode
        ? <TextField
            multiline
            variant='standard'
            value={title}
            onChange={changeTitle}
            autoFocus
            onKeyPress={onKeyPressHandler}
            onBlur={activateViewMode}
        />
        : <div className='w-[250px] overflow-x-auto '
               onDoubleClick={status === 'loading' ? () => {
               } : activateEditMode}>{value}</div>
});
