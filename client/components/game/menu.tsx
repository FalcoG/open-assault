import React from 'react'

import Overlay from '../gui/overlay'

const Menu: React.FunctionComponent<{ visible: boolean}> = ({ visible }) => {
  return (
    <>
      {visible && (
        <Overlay position={['center', 'center']}>
          Hello menu
        </Overlay>
      )}
    </>
  )
}

export default Menu
