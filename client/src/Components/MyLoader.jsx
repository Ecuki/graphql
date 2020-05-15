import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
export default function MyLoader() {
    return (

        <Dimmer active inverted inline='centered'>
            <Loader inverted content='Loading' />
        </Dimmer>


    )
}
