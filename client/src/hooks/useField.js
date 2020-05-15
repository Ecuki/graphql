import React, { useState } from 'react';

const useField = (type) => {
    const [value, setValue] = useState("")


    const onChange = e => { setValue(e.target.value) }
    const isEmpty = () => value.trim() ? false : true
    const clear = () => setValue("")

    return [{ value, type, onChange }, { isEmpty, clear }];
}

export default useField;
